"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import Sheet from "@/components/overlay/Sheet";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useCopy } from "@/lib/use-copy";

import { KAKAO_CHANNEL } from "@/app/(home)/order/_lib/order";

const CHAT = `${KAKAO_CHANNEL}/chat`;
const STEPS = ["아래 버튼 누르기", "채팅창에 붙여넣기", "보내기"];
/** 카카오톡을 연 주문 id — 카톡에서 돌아와 새로 열려도 다시 붙잡지 않게 */
const SENT_KEY = "request-done-sent";

interface Order {
  id: string;
  contact_name: string | null;
  road_address: string | null;
  detail_address: string | null;
  urgent: boolean;
}

/** 카톡으로 보낼 글 — 담당자는 성함·현장 주소로 주문을 찾는다(현장명은 노션 자동화가 주소로 짓기 때문에 고객은 모른다) */
const messageOf = (o: Order | null) =>
  [
    "[바로키친 AS 접수]",
    o?.contact_name && `성함 ${o.contact_name}`,
    o?.road_address && `현장 ${[o.road_address, o.detail_address].filter(Boolean).join(" ")}`,
    o?.urgent && "바로배송 요청",
  ]
    .filter(Boolean)
    .join("\n");

const read = () => {
  try {
    return sessionStorage.getItem(SENT_KEY);
  } catch {
    return null;
  }
};

/**
 * 접수 완료 — 카카오톡 채널 채팅으로 성함·현장을 보내게 한다(2026-11-23 사용자 「페어피스처럼 행동을 강제」, 시안 C).
 * 「복사하고 카카오톡 열기」는 보낼 글을 복사한 뒤 채널 채팅을 연다. 열지 않고 나가면(뒤로·주문 내역) 시트로 한 번 붙잡는다.
 */
export default function RequestDonePage() {
  const router = useRouter();
  const copy = useCopy();
  const [order, setOrder] = useState<Order | null>(null);
  const [leaveTo, setLeaveTo] = useState<string | null>(null);
  const sent = useRef(false);
  const text = messageOf(order);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    // id 없이 열면(새로 고침·즐겨찾기) 가장 최근 주문 — 본인 주문만 읽힌다(RLS)
    const q = supabase.from("SituationOrder").select("id, contact_name, road_address, detail_address, urgent").eq("kind", "order");
    (id ? q.eq("id", id) : q.order("created_at", { ascending: false }).limit(1)).maybeSingle().then(({ data }) => {
      if (!data) return;
      setOrder(data as Order);
      sent.current = read() === data.id;
    });
  }, []);

  // 휴대폰 뒤로(제스처·버튼)도 붙잡는다 — 같은 주소를 한 칸 더 쌓아 두고, 뒤로가 오면 다시 쌓고 시트를 띄운다
  useEffect(() => {
    history.pushState(null, "", location.href);
    const onPop = () => {
      if (sent.current) return router.replace("/");
      history.pushState(null, "", location.href);
      setLeaveTo("/");
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [router]);

  const leave = (to: string) => (sent.current ? router.replace(to) : setLeaveTo(to));

  const openChat = async () => {
    await copy.run("send", text);
    sent.current = true;
    try {
      if (order) sessionStorage.setItem(SENT_KEY, order.id);
    } catch {
      // 저장이 막혀도 카톡은 연다
    }
    // 출처(Referer)를 넘기지 않는다 — 넘기면 카카오가 채팅방에 「이전 페이지: as.barogagu.com」 줄과 미리보기 카드를 붙인다(2026-11-24 사용자 「끄고」).
    // 어디서 왔는지는 고객이 붙여넣는 첫 메시지 머리말로 가른다.
    const a = document.createElement("a");
    a.href = CHAT;
    a.rel = "noreferrer";
    a.click();
  };

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator onBack={() => leave("/")} />
      <Header size="Medium" title="주문이 접수됐어요" subtitle="카카오톡으로 한 번만 보내 주시면 끝나요" />
      <div className="flex flex-col gap-4 px-5 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/request/done-chat.svg" alt="" className="mx-auto w-[168px]" />
        <ol className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1 break-keep rounded-[10px] bg-gray-100 px-1.5 py-2 text-center text-[14px]/[20px] font-600 text-gray-600">
              <span className="block text-[12px] text-primary">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        {/* amp-mask: 세션 리플레이에서 성함·주소를 가린다 */}
        <div className="amp-mask rounded-xl border border-gray-200 bg-gray-50 px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14px] font-600 text-gray-500">보낼 내용</span>
            <Button variant="inverse" size="sm" onClick={() => copy.run("box", text)}>
              {copy.copied === "box" ? "복사됨" : "복사"}
            </Button>
          </div>
          <p className="select-all whitespace-pre-line text-[16px]/[25px] text-gray-900">{text}</p>
        </div>
      </div>
      <div className="h-[140px]" />
      <BottomBar>
        <div className="flex flex-col gap-1">
          <Button variant="kakao" className="rounded-[12px]" onClick={openChat}>
            <KakaoBubble />
            복사하고 카카오톡 열기
          </Button>
          <Button variant="ghost" size="md" onClick={() => leave("/order-history")}>
            주문 내역 보기
          </Button>
        </div>
      </BottomBar>
      <Sheet
        open={!!leaveTo}
        onOpenChange={(o) => !o && setLeaveTo(null)}
        title="카카오톡으로 보내셨나요?"
        description="보내 주셔야 담당자가 주문을 찾아 일정을 확정할 수 있어요."
        footer={
          <div className="flex w-full gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                sent.current = true;
                router.replace(leaveTo ?? "/");
              }}
            >
              이미 보냈어요
            </Button>
            <Button variant="kakao" className="flex-1 rounded-[12px]" onClick={openChat}>
              보내러 가기
            </Button>
          </div>
        }
      />
    </div>
  );
}

/** 카카오톡 말풍선 — 노란 버튼 위 검정 */
const KakaoBubble = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.4.3.7.6.5l4.3-2.8c.5.1 1 .1 1.4.1 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
  </svg>
);
