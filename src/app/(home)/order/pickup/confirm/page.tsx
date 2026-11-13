"use client";

import { useEffect } from "react";

import { formatDate } from "@/app/(home)/order-history/utils/formatters";
import { trackView } from "@/services/analytics/amplitude";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { getPreviousScreenName, setScreenName } from "@/utils/screenName";

import { BankAccountBox, KakaoChannelLink, OrderDetails, OrderDoneBar, RecentOrderGate, Step, useRecentOrder } from "../../_components/OrderDone";
import PickUpAddressCard from "../../_components/PickUpAddressCard";

export default function OrderConfirmPage() {
  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    setScreenName("order_pickup_confirm");
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
  const address = (
    <Step n={recentOrder.hasSetProducts ? 1 : 5} title="아래 주소에서 픽업할 수 있어요">
      <PickUpAddressCard compact />
    </Step>
  );

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
          <div className="mb-10 mt-5 flex flex-col gap-2">
            {!recentOrder.hasSetProducts && (
              <>
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
                  <p className="pb-7 font-400 text-gray-500">알림톡 보내드리고 곧바로 제작 시작해요</p>
                </Step>
              </>
            )}
            {address}
          </div>
        </div>
        <OrderDetails orderItems={orderItems}>
          <div className="mb-2 mt-3 border-b border-gray-200 pb-3 text-gray-500">
            <p className="mb-1 text-[17px] font-600 text-gray-800">픽업 정보</p>
            <p>픽업 날짜: {recentOrder.pickup_time ? formatDate(recentOrder.pickup_time.toString(), true) : "날짜 정보 없음"}</p>
          </div>
          <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
            <p className="mb-1 text-[17px] font-600 text-gray-800">픽업 차량 정보</p>
            <p>{recentOrder.vehicle_type === "직접 입력" ? recentOrder.vehicle_type_direct_input : recentOrder.vehicle_type || ""}</p>
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
