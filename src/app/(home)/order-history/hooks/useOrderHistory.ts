import { useState, useEffect } from "react";
import useUserStore from "@/store/userStore";

interface OrderItem {
    cart_item_id: number;
    product_type: string;
    unit_price: number;
    item_count: number;
    item_options: any;
}

interface Order {
    order_id: string;
    cart_id: number;
    order_type: "DELIVERY" | "PICK_UP";
    recipient_phone: string;
    order_price: number;
    order_options: any;
    created_at: string;
    cart_items: OrderItem[];
}

interface OrderHistoryResponse {
    orders: Order[];
}

export const useOrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const userId = useUserStore.getState().id;

                if (!userId) {
                    setError("사용자 정보를 찾을 수 없습니다.");
                    setLoading(false);
                    return;
                }

                console.log("🔍 사용자 ID로 주문 내역 조회 시도:", userId);

                const response = await fetch(`/api/order?user_id=${userId}`);

                console.log("📡 API 응답 상태:", response.status, response.statusText);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("❌ API 에러 응답:", errorData);

                    // 백엔드 서버 문제인 경우 임시로 빈 배열 반환
                    if (response.status === 404 || response.status === 500) {
                        console.log("⚠️ 백엔드 서버 문제로 인해 빈 주문 내역을 표시합니다.");
                        setOrders([]);
                        return;
                    }

                    throw new Error(`주문 내역을 불러오는데 실패했습니다. (${response.status})`);
                }

                const data: OrderHistoryResponse = await response.json();
                console.log("✅ 주문 내역 데이터:", data);
                setOrders(data.orders || []);
            } catch (err) {
                console.error("💥 주문 내역 조회 에러:", err);
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    return { orders, loading, error };
};

export type { Order, OrderItem, OrderHistoryResponse }; 