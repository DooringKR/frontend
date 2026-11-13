"use client";

import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomBar from "@/components/overlay/BottomBar";
import { EmptyState, Loading } from "@/components/state/StateViews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAction } from "@/components/ui/use-action";
import { useCopy } from "@/lib/use-copy";
import { useOrderStore } from "@/store/orderStore";

import { BANK_ACCOUNT, KAKAO_CHANNEL } from "../_lib/order";

/* 배송·픽업 완료 화면이 같이 쓰는 조각 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 완료 화면 주문 정보는 store·localStorage 의 any
type Any = any;

const sortItemsByNickName = (items: Any[]) =>
  [...items].sort((a, b) => {
    const aNum = Number.parseInt(a?.nick_name ?? "", 10);
    const bNum = Number.parseInt(b?.nick_name ?? "", 10);
    const aValid = Number.isFinite(aNum);
    const bValid = Number.isFinite(bNum);
    if (aValid && bValid) return aNum - bNum;
    if (aValid) return -1;
    if (bValid) return 1;
    return String(a?.id ?? "").localeCompare(String(b?.id ?? ""));
  });

/** 방금 넣은 주문 — 스토어 먼저(주문 직전에 넣음), 없으면 localStorage. undefined = 읽기 전, null = 없음 */
export function useRecentOrder() {
  const [recentOrder, setRecentOrder] = useState<Any>(undefined);
  const [orderItems, setOrderItems] = useState<Any[]>([]);
  useEffect(() => {
    let data: { order_id?: string; order: Any; cartItems: Any[] } | null = useOrderStore.getState().recentOrderForConfirm;
    if (data) useOrderStore.getState().clearRecentOrderForConfirm();
    else
      try {
        data = JSON.parse(localStorage.getItem("recentOrder") ?? "null");
      } catch {
        data = null;
      }
    if (!data) return setRecentOrder(null);
    const all = data.cartItems || [];
    const setProducts = all.filter((item: Any) => item.detail_product_type === DetailProductType.LONGDOOR);
    const hasSetProducts = setProducts.length > 0;
    setRecentOrder({ ...(data.order || {}), hasSetProducts, order_id: data.order_id });
    setOrderItems(sortItemsByNickName(hasSetProducts ? setProducts : all));
  }, []);
  return { recentOrder, orderItems };
}

/** 읽기 전·없음 화면 — 있으면 null */
export function RecentOrderGate({ recentOrder }: { recentOrder: Any }) {
  const router = useRouter();
  if (recentOrder === undefined) return <Loading />;
  if (recentOrder === null) return <EmptyState text="주문 정보가 없습니다." action={{ label: "홈으로", onClick: () => router.replace("/") }} />;
  return null;
}

/** 남은 단계 한 칸 — 번호 동그라미 + 제목, 밑에 세로줄과 내용 */
export function Step({ n, title, children }: { n: number; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">{n}</div>
        <div>{title}</div>
      </div>
      {children && (
        <div className="mt-2 flex">
          <div className="mx-[14.5px] w-[3px] shrink-0 rounded-full bg-gray-200"></div>
          {children}
        </div>
      )}
    </div>
  );
}

export function KakaoChannelLink() {
  return (
    <a href={KAKAO_CHANNEL} target="_blank" rel="noopener noreferrer" className="flex w-full gap-2 py-[10px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/kakaoTalk.svg" alt="카카오톡 아이콘" />
      <span className="text-[17px] font-600">카카오톡 채널 바로가기</span>
    </a>
  );
}

/** 송금 계좌 + 복사 */
export function BankAccountBox() {
  const copy = useCopy();
  const [bank, account] = BANK_ACCOUNT.split(" ");
  return (
    <div className="flex w-[291px] flex-col gap-5 rounded-xl border border-gray-200 p-4 pb-7 font-400 text-gray-400">
      <div className="flex flex-col">
        <span className="text-sm font-500">예상 금액 바탕으로 견적서 송부 예정</span>
        <span className="text-xl font-600 text-red-500">견적서 확인 후 송금해주세요</span>
      </div>
      <div className="flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/bank.svg" alt="IBK기업은행 로고" className="h-7 w-7 justify-start" />
        <div className="flex flex-col items-start">
          <span className="text-[17px] font-500 text-gray-600">{account}</span>
          <span className="text-sm font-500">{bank}</span>
        </div>
        <Button variant="inverse" size="sm" onClick={() => copy.run("account", BANK_ACCOUNT)}>
          {copy.copied === "account" ? "복사됨" : "복사"}
        </Button>
      </div>
      {copy.failed && <p className="select-all text-[14px] text-gray-600">{copy.failed}</p>}
    </div>
  );
}

/** 주문 상품 목록 + 받는 방법별 내용(children) — 처음 펼침 */
export function OrderDetails({ orderItems, children }: { orderItems: Any[]; children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 px-5 py-10">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="group flex w-full justify-between rounded-xl bg-white p-3">
          <span className="font-semibold">주문내역 확인</span>
          <ChevronDown className="size-5 text-gray-500 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-xl bg-white p-5 text-sm">
          <div className="mb-5 flex justify-between">
            <span className="text-[17px] font-600">주문 상품</span>
          </div>
          <div className="flex flex-col gap-5 border-b border-gray-200 pb-3">
            {orderItems.map((item, i) => {
              if (!item) return null;
              const unitPrice = item.unit_price || 0;
              const subtotal = unitPrice * (item.item_count || 0);
              return (
                <div key={i} className="mb-3 border-b border-gray-200 pb-3">
                  <div className="mb-2 flex items-center gap-2 font-600 text-gray-800">
                    {item.nick_name && (
                      <Badge color="gray" weight="weak">
                        {item.nick_name}
                      </Badge>
                    )}
                    <span>{item.detail_product_type}</span>
                  </div>
                  <p className="text-gray-600">수량: {item.item_count}개</p>
                  <p className="text-gray-600">단가: {unitPrice === 0 ? "별도 견적" : `${unitPrice.toLocaleString()}원`}</p>
                  <p className="mt-1 font-600 text-gray-600">소계: {subtotal === 0 ? "별도 견적" : `${subtotal.toLocaleString()}원`}</p>
                </div>
              );
            })}
          </div>
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

/** 아래 버튼 — 홈으로 · 주문 자세히 보기(주문 번호가 없으면 막음) */
export function OrderDoneBar({ orderId }: { orderId?: string }) {
  const router = useRouter();
  const nav = useAction({ holdOnSuccess: true });
  const hasId = !!orderId && orderId !== "undefined";
  return (
    <BottomBar>
      <Button
        variant="secondary"
        onClick={() => {
          localStorage.removeItem("recentOrder");
          useOrderStore.getState().clearRecentOrderForConfirm();
          router.push("/");
        }}
      >
        홈으로
      </Button>
      <Button
        variant="secondary"
        disabled={!hasId}
        busy={nav.busy}
        onClick={() => nav.run(async () => router.replace(`/order-history/${orderId}?from=confirm`))}
      >
        주문 자세히 보기
      </Button>
    </BottomBar>
  );
}
