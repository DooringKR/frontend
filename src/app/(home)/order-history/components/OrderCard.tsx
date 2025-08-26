import { formatDate, formatPrice, getOrderTypeText } from "../utils/formatters";
import { Order } from "../hooks/useOrderHistory";
import { Chip } from "@/components/Chip/Chip";
import { useRouter } from "next/navigation";

interface OrderCardProps {
    order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/order-history/${order.order_id}`);
    };

    return (
        <div
            className="bg-white rounded-[16px] p-5 border border-gray-200 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleCardClick}
        >
            <div className="flex flex-col gap-2">
                {/* 날짜, 주소, 대표 주문 상품 1개 */}
                <div className="flex justify-between items-center">
                    <div className="text-[17px]/[24px] font-500 text-gray-500">{formatDate(order.created_at)}</div>
                    <Chip text={order.order_type === "DELIVERY" ? "배송" : "직접 픽업"} color={order.order_type === "DELIVERY" ? "blue" : "green"} />
                </div>
                {order.order_type === "DELIVERY" && order.order_options?.delivery && (
                    <div className="text-[20px]/[28px] font-700 text-gray-800">
                        {order.order_options.delivery.recipient_road_address}, {order.order_options.delivery.recipient_detail_address}
                    </div>
                )}
            </div>
            <div>
                {/* 총 금액 */}
                <div className="flex justify-between items-center">
                    {order.cart_items.length > 1 && (
                        <Chip text={`외 ${order.cart_items.length - 1}개`} color='gray' />
                    )}
                    <div className="text-[20px]/[28px] font-600 text-blue-500">{formatPrice(order.order_price)}원</div>
                </div>
            </div>
        </div>
    );
}; 