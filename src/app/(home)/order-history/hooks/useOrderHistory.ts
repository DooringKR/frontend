import { useCallback, useEffect, useState } from "react";

import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import { OrderWithItems, ReadOrderHistoryUsecase } from "@/DDD/usecase/read_order_history_usecase";
import useBizClientStore from "@/store/bizClientStore";

/**
 * 품목 주문 내역 — orders: null = 아직 안 읽음, [] = 없음. 회원 정보가 없으면 needLogin(오류 대신 로그인 안내).
 */
export const useOrderHistory = () => {
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needLogin, setNeedLogin] = useState(false);

  const reload = useCallback(async () => {
    setOrders(null);
    setError(null);
    const userId = useBizClientStore.getState().getBizClientId();
    if (!userId) return setNeedLogin(true);
    try {
      const response = await new ReadOrderHistoryUsecase(new OrderSupabaseRepository(), new OrderItemSupabaseRepository()).execute(userId);
      if (!response.success) throw new Error(response.message);
      setOrders(response.data || []);
    } catch (err) {
      console.error("주문 내역 조회 에러:", err);
      setError("주문 내역을 불러오지 못했어요");
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { orders, error, needLogin, reload };
};

export type { OrderWithItems };
