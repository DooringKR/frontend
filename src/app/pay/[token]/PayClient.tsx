"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import { useEffect, useState } from "react";

import Footer from "@/app/(home)/_components/Footer";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import type { PayInfo } from "@/lib/pay";

/** 결제창·카드 명세에 보이는 이름 — KCP 에 등록된 사이트 이름 */
const SERVICE = "바로키친 AS";
const COMPANY = "주식회사 도어링";
/** 푸터 「환불규정」과 같은 문서 */
const REFUND_URL = "https://witty-sundae-3d1.notion.site/305b6a70ff3980a5b2a2ffb5f4694b89";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 text-[16px]">
      <div className="w-16 shrink-0 text-gray-500">{label}</div>
      <div className="min-w-0 flex-1 text-right text-gray-800">{children}</div>
    </div>
  );
}

const HEAD: Record<PayInfo["status"], { title: string; subtitle?: string }> = {
  open: { title: "결제 요청", subtitle: `${SERVICE} · ${COMPANY}` },
  paid: { title: "결제가 완료됐어요" },
  canceled: { title: "지난 결제 링크예요", subtitle: "새로 받은 링크로 결제해 주세요" },
  mismatch: { title: "결제를 확인하고 있어요", subtitle: "담당자가 연락드려요" },
};

/**
 * 결제 요청 — 「카드로 결제」 → 포트원 V2 결제창(NHN KCP). PC 는 창이 닫히면 이어서, 모바일은 이 주소로 돌아와(redirectUrl)
 * 서버가 포트원에 다시 물은 상태를 받는다. 결제창이 돌려준 값으로 「완료」를 띄우지 않는다.
 */
export default function PayClient({ token, initial, redirectError }: { token: string; initial: PayInfo; redirectError: string | null }) {
  const [info, setInfo] = useState(initial);
  const pay = useAction();

  // 모바일 결제창이 붙여 돌려준 쿼리(paymentId·code·message)는 한 번 보이고 주소에서 뺀다
  useEffect(() => {
    if (redirectError && initial.status === "open") pay.setError(redirectError);
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 처음 한 번
  }, []);

  const recheck = async () => {
    const res = await fetch(`/api/pay/${token}`, { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error ?? "결제 상태를 읽지 못했어요.");
    setInfo(body as PayInfo);
    return body as PayInfo;
  };

  const start = () =>
    pay.run(async () => {
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      if (!storeId || !channelKey) throw new Error("결제 설정이 없어요.");
      const res = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId: info.paymentId,
        // KCP 는 100바이트까지 — 한글 30자 남짓
        orderName: `${SERVICE} ${info.label}`.slice(0, 30),
        totalAmount: info.amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        redirectUrl: `${window.location.origin}/pay/${token}`,
        // KCP 모바일은 site_name 필수, shop_user_id 는 타입이 요구(로그인이 없어 결제 번호로)
        bypass: { kcp_v2: { site_name: SERVICE, shop_user_id: info.paymentId } },
      });
      const now = await recheck();
      if (now.status !== "open") return;
      throw new Error(res?.code ? res.message || "결제가 되지 않았어요." : "결제를 확인하지 못했어요. 잠시 뒤 다시 열어 주세요.");
    });

  const head = HEAD[info.status];
  const quote = info.quote;
  return (
    <div className="flex min-h-screen flex-col">
      <Header title={head.title} subtitle={info.status === "paid" && info.paidAt ? when(info.paidAt) : head.subtitle} />
      {/* 견적 내용 — 그 현장에서 마지막으로 보낸 견적서의 품목(어드민이 스냅샷에서 읽음), 합계는 고객 견적서가 보인 금액 */}
      {quote && quote.items.length > 0 && (
        <section className="mx-5 mt-6">
          <h2 className="text-[14px] font-600 text-gray-500">견적 내용</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {quote.items.map((it, i) => (
              <div key={i} className="flex gap-4 py-3 text-[16px]">
                <div className="min-w-0 flex-1 text-gray-800">
                  {it.name}
                  {it.quantity != null && <div className="text-[14px] text-gray-500">{`${it.quantity}${it.unit ?? ""}`}</div>}
                </div>
                <div className="shrink-0 text-gray-800">{won(it.amount)}</div>
              </div>
            ))}
            {quote.total != null && <Row label="견적 합계">{won(quote.total)}</Row>}
          </div>
        </section>
      )}
      {quote && quote.items.length > 0 && <h2 className="mx-5 mt-8 text-[14px] font-600 text-gray-500">이번 결제</h2>}
      <div className={`mx-5 flex flex-col divide-y divide-gray-100 ${quote && quote.items.length > 0 ? "" : "mt-6"}`}>
        <Row label="항목">{info.label}</Row>
        <Row label="금액">
          <span className="font-700">{won(info.amount)}</span>
        </Row>
        {info.test && (
          <Row label="">
            <Badge color="gray">테스트 결제</Badge>
          </Row>
        )}
      </div>
      <a href={REFUND_URL} target="_blank" rel="noopener noreferrer" className="mx-5 mt-4 text-[14px] text-gray-500 underline">
        환불규정
      </a>
      <div className="mt-auto pt-10">
        <Footer />
      </div>
      {info.status === "open" && (
        <BottomBar top={<ActionError error={pay.error} className="mb-3" />}>
          <Button busy={pay.busy} onClick={() => void start()}>
            카드로 결제
          </Button>
        </BottomBar>
      )}
    </div>
  );
}
