import { useState, useEffect } from "react";
import { ReadOrderHistoryUsecase, OrderWithItems } from "@/DDD/usecase/read_order_history_usecase";
import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import useBizClientStore from "@/store/bizClientStore";

export const useOrderHistory = () => {
    const [ordersWithItems, setOrdersWithItems] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const userId = useBizClientStore.getState().getBizClientId();

                if (!userId) {
                    setError("사용자 정보를 찾을 수 없습니다.");
                    setLoading(false);
                    return;
                }

                console.log("🔍 사용자 ID로 주문 내역 조회 시도:", userId);

                // DDD 스타일의 Usecase 사용
                const usecase = new ReadOrderHistoryUsecase(
                    new OrderSupabaseRepository(),
                    new OrderItemSupabaseRepository()
                );

                const response = await usecase.execute(userId);

                if (!response.success) {
                    throw new Error(response.message || "주문 내역 조회에 실패했습니다.");
                }

                console.log("✅ 주문 내역 데이터:", response.data);
                setOrdersWithItems(response.data || []);

            } catch (err) {
                console.error("💥 주문 내역 조회 에러:", err);
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    return { ordersWithItems, loading, error };
};

export type { OrderWithItems }; 