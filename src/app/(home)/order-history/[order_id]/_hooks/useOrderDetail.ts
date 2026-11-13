import { useCallback, useEffect, useState } from "react";
import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";

import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import { ReadOrderHistoryUsecase } from "@/DDD/usecase/read_order_history_usecase";

import { fetchMaterialDetail } from "../../../cart/_lib/materialDetail";

// 자재 정보를 포함한 OrderItem 타입
type OrderItemWithMaterial = OrderItem & {
  materialDetails: any;
  relatedDoors?: Door[]; // 롱문의 경우 관련 Door 배열
};

// 자재 정보를 포함한 Order 타입
type OrderWithItemsAndMaterials = {
  order: any;
  orderItems: OrderItemWithMaterial[];
};

/**
 * 주문 상세 + 항목마다 자재 상세(장바구니와 같은 fetchMaterialDetail).
 * loading 은 orderId 가 들어와 다 읽을 때까지 켜 둔다 — 읽기 전에 오류·없음 갈래가 먼저 보이지 않게.
 */
export const useOrderDetail = (orderId: string | null) => {
  const [orderWithItems, setOrderWithItems] = useState<OrderWithItemsAndMaterials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!orderId) return setLoading(false);
    setLoading(true);
    setError(null);
    try {
      const response = await new ReadOrderHistoryUsecase(new OrderSupabaseRepository(), new OrderItemSupabaseRepository()).getOrderDetail(orderId);
      if (!response.success) throw new Error(response.message);
      const orderData = response.data!;
      const orderItems = await Promise.all(
        orderData.orderItems.map(async (orderItem: OrderItem) => {
          const { detail, relatedDoors } = await fetchMaterialDetail(orderItem.detail_product_type, orderItem.item_detail);
          return { ...orderItem, materialDetails: detail ?? {}, relatedDoors } as OrderItemWithMaterial;
        }),
      );
      setOrderWithItems({ order: orderData.order, orderItems });
    } catch (err) {
      console.error("주문 상세 조회 에러:", err);
      setError("주문 정보를 불러오지 못했어요");
      setOrderWithItems(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { orderWithItems, loading, error, reload };
};
