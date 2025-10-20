"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrderDetail } from "./_hooks/useOrderDetail";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import OrderHeader from "./_components/OrderHeader";
import OrderTimeline from "./_components/OrderTimeline";
import OrderItemsList from "./_components/OrderItemsList";
import { ORDER_HISTORY_FROM_CONFIRM } from "@/constants/pageName";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  // confirm 페이지에서 온 경우인지 확인
  const isFromConfirm = searchParams.get("from") === "confirm";

  useEffect(() => {
    if (params?.order_id) {
      const newOrderId = params.order_id as string;
      setOrderId(newOrderId);
    }
  }, [params]);

  // 훅은 항상 실행되지만, 내부에서 orderId가 null이면 아무것도 하지 않음
  const { orderWithItems, loading, error } = useOrderDetail(orderId);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
      // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
      setScreenName('order_history_detail');
      const prev = getPreviousScreenName();
      trackView({
          object_type: "screen",
          object_name: null,
          current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
          previous_screen: prev,
      });
  }, []);

  // orderId가 없으면 로딩 상태 표시
  if (!orderId) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="주문 상세" size="Medium" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-gray-500">주문 ID를 불러오는 중...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="주문 상세" size="Medium" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-gray-500">주문 정보를 불러오는 중...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !orderWithItems) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="주문 상세" size="Medium" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-black-500">
            <div className="mb-2">주문 정보를 불러오는 중 ...</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const order = orderWithItems.order as DeliveryOrder | PickUpOrder;
  const orderItems = orderWithItems.orderItems;

  // order_type 판단
  const isDelivery = (order as DeliveryOrder).delivery_arrival_time !== undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <InitAmplitude />
      <TopNavigator title="상세 내역" page={isFromConfirm ? ORDER_HISTORY_FROM_CONFIRM : undefined} />
      <div className="flex flex-col pb-[60px]">
        {/* 주문 방식 & 가격 */}
        <OrderHeader order={order} isDelivery={isDelivery} />

        {/* 주문 일시 & 배송 일시 */}
        <OrderTimeline order={order} isDelivery={isDelivery} />

        {/* 주문 상품 */}
        <OrderItemsList orderItems={orderItems} />
      </div>
      <BottomNavigation />
    </div>
  );
}
