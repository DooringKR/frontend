"use client";

import { useParams } from "next/navigation";
import { useOrderDetail } from "./_hooks/useOrderDetail";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import OrderHeader from "./_components/OrderHeader";
import OrderTimeline from "./_components/OrderTimeline";
import OrderItemsList from "./_components/OrderItemsList";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.order_id as string;

  // DDD 스타일의 커스텀 훅 사용
  const { orderWithItems, loading, error } = useOrderDetail(orderId);

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
          <div className="text-center text-red-500">
            <div className="mb-2">오류가 발생했습니다</div>
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
      <TopNavigator title="상세 내역" />
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
