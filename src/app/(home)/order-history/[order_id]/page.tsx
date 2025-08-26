"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Header from "@/components/Header/Header";
import { Chip } from "@/components/Chip/Chip";
import { formatDate, formatPrice, getOrderTypeText } from "../utils/formatters";
import { Order } from "../hooks/useOrderHistory";

interface OrderItemWithDetails {
    cart_item_id: number;
    product_type: string;
    unit_price: number;
    item_count: number;
    item_options: any;
    details?: {
        order_item_id: number;
        order_id: string;
        product_type: string;
        unit_price: number;
        item_count: number;
        item_options: Record<string, any>;
        created_at: string;
        last_updated_at: string;
    };
}
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import PickUpIcon from "public/icons/pick-up";
import MapIcon from "public/icons/map";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = params.order_id as string;

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                // 주문 내역에서 해당 주문을 찾기
                const userId = 1; // 실제로는 useUserStore에서 가져와야 함
                const response = await fetch(`/api/order?user_id=${userId}`);

                if (!response.ok) {
                    throw new Error("주문 정보를 불러오는데 실패했습니다.");
                }

                const data = await response.json();
                const foundOrder = data.orders?.find((o: Order) => o.order_id === orderId);

                if (!foundOrder) {
                    setError("주문을 찾을 수 없습니다.");
                    return;
                }

                // 각 주문 품의 상세 정보를 가져오기
                const orderItemsWithDetails = await Promise.all(
                    foundOrder.cart_items.map(async (item: any) => {
                        try {
                            const itemResponse = await fetch(`/api/order_item/${item.cart_item_id}`);
                            if (itemResponse.ok) {
                                const itemData = await itemResponse.json();
                                return {
                                    ...item,
                                    details: itemData.order_item
                                };
                            }
                        } catch (error) {
                            console.error(`주문 품 ${item.cart_item_id} 조회 실패:`, error);
                        }
                        return item;
                    })
                );

                setOrder({
                    ...foundOrder,
                    cart_items: orderItemsWithDetails
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header title="주문 상세" size="Medium" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">주문 정보를 불러오는 중...</div>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header title="주문 상세" size="Medium" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500 text-center">
                        <div className="mb-2">오류가 발생했습니다</div>
                        <div className="text-sm">{error}</div>
                    </div>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <TopNavigator title="상세 내역" />
            <div className="flex flex-col">
                {/* 주문 방식 & 가격 */}
                <div className="flex flex-col px-5 pt-5 pb-[60px] gap-2">
                    <div className="flex gap-2">
                        {order.order_type === "PICK_UP" ? <PickUpIcon /> : <MapIcon />}
                        <div className="text-[17px]/[24px] font-500 text-gray-500">픽업 주문</div>
                    </div>
                    <div className="text-[26px]/[36px] font-700 text-gray-900">
                        {formatPrice(order.order_price)}원
                    </div>
                </div>
                {/* 주문 일시 */}
                <div></div>
                {/* 주문 상품 */}
                <div className="flex flex-col px-5 gap-4">
                    <div className="text-[20px]/[28px] font-700 text-gray-900">주문 상품</div>
                    <div className="space-y-3">
                        {order.cart_items.map((item) => (
                            <div
                                key={item.cart_item_id}
                                className="bg-white rounded-[16px] p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => {
                                    const itemWithDetails = item as OrderItemWithDetails;
                                    if (itemWithDetails.details) {
                                        console.log("주문 품 상세 정보:", itemWithDetails.details);
                                        alert(`상품: ${itemWithDetails.details.product_type}\n수량: ${itemWithDetails.details.item_count}개\n단가: ${formatPrice(itemWithDetails.details.unit_price)}원\n생성일: ${formatDate(itemWithDetails.details.created_at)}`);
                                    }
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="text-[17px]/[24px] font-600 text-gray-900 mb-1">
                                            {item.product_type}
                                        </div>
                                        <div className="text-[14px]/[20px] font-500 text-gray-500">
                                            {item.item_count}개 × {formatPrice(item.unit_price)}원
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[17px]/[24px] font-600 text-gray-900">
                                            {formatPrice(item.unit_price * item.item_count)}원
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 수령 방법 */}
                <div></div>
                {/* 배송인 경우: 배송 정보 */}
                {order.order_type === "DELIVERY" && <div>
                    {/* 배송 일정 */}
                    <div></div>
                    {/* 배송 주소 */}
                    <div></div>
                    {/* 배송 기사 요청 사항 */}
                    <div></div>
                </div>}
                {/* 받는 분 휴대전화 */}
                <div></div>
            </div>
            <BottomNavigation />
        </div>
    );
} 