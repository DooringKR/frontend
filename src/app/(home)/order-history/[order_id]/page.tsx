"use client";

import { useParams } from "next/navigation";
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

export default function OrderDetailPage() {
  const params = useParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  console.log("🔍 OrderDetailPage - params:", params);
  console.log("🔍 OrderDetailPage - order_id from params:", params?.order_id);
  console.log("🔍 OrderDetailPage - current orderId state:", orderId);

  useEffect(() => {
    if (params?.order_id) {
      const newOrderId = params.order_id as string;
      console.log("🔍 OrderDetailPage - setting orderId:", newOrderId);
      setOrderId(newOrderId);
    }
  }, [params]);

  // 훅은 항상 실행되지만, 내부에서 orderId가 null이면 아무것도 하지 않음
  const { orderWithItems, loading, error } = useOrderDetail(orderId);

  console.log("🔍 OrderDetailPage - hook result:", { orderWithItems, loading, error });

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
