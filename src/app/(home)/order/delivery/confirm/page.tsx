"use client";

import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useEffect } from "react";

import { trackView } from "@/services/analytics/amplitude";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { getPreviousScreenName, setScreenName } from "@/utils/screenName";

import { BankAccountBox, KakaoChannelLink, OrderDetails, OrderDoneBar, RecentOrderGate, Step, useRecentOrder } from "../../_components/OrderDone";

const arrivalText = (o: { is_today_delivery?: boolean; delivery_arrival_time?: string }) =>
  new Date(o.delivery_arrival_time ?? "").toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit" });

export default function OrderConfirmPage() {
  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    setScreenName("order_delivery_confirm");
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? (window.screen_name ?? null) : null,
      previous_screen: getPreviousScreenName(),
    });
  }, []);

  const { recentOrder, orderItems } = useRecentOrder();
  if (!recentOrder) return <RecentOrderGate recentOrder={recentOrder} />;

  const phone = formatPhoneNumber(recentOrder.recipient_phone);
  const today = recentOrder.is_today_delivery === true;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto pb-[100px]">
        <div className="flex flex-col px-5 pt-[60px]">
          <p className="mb-2 text-[23px] font-700 text-gray-900">주문이 잘 접수되었어요</p>
          <p className="text-[17px] font-400 text-gray-500">남은 단계를 확인해주세요.</p>
          <div className="flex items-center justify-center py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/check-mark-green.svg" alt="체크 아이콘" className="h-24 w-24" />
          </div>
          {!recentOrder.hasSetProducts && (
            <div className="mb-10 mt-5 flex flex-col gap-2">
              <Step
                n={1}
                title={
                  <>
                    시공 현장 사진, 도면을 카톡 채널 또는
                    <br />
                    문자(010-6409-4542)로 보내주세요
                  </>
                }
              >
                <KakaoChannelLink />
              </Step>
              <Step n={2} title="바로가구에서 주문 확인하면">
                <p className="pb-7 font-400 text-gray-500">
                  {phone}로
                  <br />
                  담당자 확인 후 순차적으로 확인 전화드려요
                </p>
              </Step>
              <Step n={3} title="주문금액을 아래 계좌로 송금하고">
                <BankAccountBox />
              </Step>
              <Step n={4} title="바로가구에서 입금 확인하면">
                <p className="pb-7 font-400 text-gray-500">알림톡 보내드리고 곧바로 배송 시작해요</p>
              </Step>
              <Step n={5} title={`퀵 ∙ 용달로 ${today ? "오늘" : arrivalText(recentOrder)}까지 배송해드려요`} />
            </div>
          )}
        </div>
        <OrderDetails orderItems={orderItems}>
          <div className="mb-2 mt-3 border-b border-gray-200 pb-3 text-gray-500">
            <p className="mb-1 text-[17px] font-600 text-gray-800">배송일정</p>
            <p>{today ? "당일배송" : arrivalText(recentOrder)}</p>
          </div>
          <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
            <p className="mb-1 text-[17px] font-600 text-gray-800">배송주소</p>
            <p>{recentOrder.road_address}</p>
            <p>{recentOrder.detail_address}</p>
          </div>
          <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
            <p className="mb-1 text-[17px] font-600 text-gray-800">배송기사 요청사항</p>
            {recentOrder.delivery_method === DeliveryMethod.OPEN_GATE && (
              <>
                <p>공동현관으로 올라오세요</p>
                {recentOrder.gate_password && <p>공동현관 비밀번호: {recentOrder.gate_password}</p>}
              </>
            )}
            {recentOrder.delivery_method === DeliveryMethod.CALL && <p>전화주시면 마중 나갈게요</p>}
            {recentOrder.delivery_method === DeliveryMethod.LEAVE_DOOR && <p>문 앞에 두면 가져갈게요</p>}
            {recentOrder.delivery_method === DeliveryMethod.DIRECT_INPUT && recentOrder.delivery_method_direct_input && (
              <>
                <p>직접입력</p>
                <p>{recentOrder.delivery_method_direct_input}</p>
              </>
            )}
          </div>
          <div className="text-gray-500">
            <p className="mb-1 text-[17px] font-600 text-gray-800">받는 분 휴대폰 번호</p>
            <p>{phone}</p>
          </div>
        </OrderDetails>
        <OrderDoneBar orderId={recentOrder.order_id} />
      </div>
    </div>
  );
}
