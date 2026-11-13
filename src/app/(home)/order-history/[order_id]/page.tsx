"use client";

import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import { EmptyState, ErrorBanner, Loading } from "@/components/state/StateViews";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { ORDER_HISTORY_FROM_CONFIRM } from "@/constants/pageName";
import { trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, setScreenName } from "@/utils/screenName";

import OrderHeader from "./_components/OrderHeader";
import OrderItemsList from "./_components/OrderItemsList";
import OrderTimeline from "./_components/OrderTimeline";
import { useOrderDetail } from "./_hooks/useOrderDetail";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = (params?.order_id as string | undefined) ?? null;
  // 주문 확인 화면에서 왔으면 위 X 로 홈
  const isFromConfirm = searchParams.get("from") === "confirm";
  const { orderWithItems, loading, error, reload } = useOrderDetail(orderId);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName("order_history_detail");
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  const order = orderWithItems?.order as DeliveryOrder | PickUpOrder | undefined;
  // order_type 판단
  const isDelivery = !!order && (order as DeliveryOrder).delivery_arrival_time !== undefined;

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <InitAmplitude />
      {/* 로딩·오류 갈래에도 뒤로(새 탭이면 주문 내역으로) */}
      <TopNavigator title="상세 내역" page={isFromConfirm ? ORDER_HISTORY_FROM_CONFIRM : undefined} backTo="/order-history" />
      <div className="flex flex-col pb-[60px]">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="p-5">
            <ErrorBanner text={error} onRetry={reload} />
          </div>
        ) : !order || !orderWithItems ? (
          <EmptyState text="주문을 찾을 수 없어요" action={{ label: "주문 내역", onClick: () => router.replace("/order-history") }} />
        ) : (
          <>
            {/* 주문 방식 & 가격 */}
            <OrderHeader order={order} isDelivery={isDelivery} />
            {/* 주문 일시 & 배송 일시 */}
            <OrderTimeline order={order} isDelivery={isDelivery} />
            {/* 주문 상품 */}
            <OrderItemsList orderItems={orderWithItems.orderItems} />
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}
