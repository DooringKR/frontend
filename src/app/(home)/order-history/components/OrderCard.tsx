import { formatDate, formatPrice } from "../utils/formatters";
import { OrderWithItems } from "../hooks/useOrderHistory";
import NavRow from "@/components/nav/NavRow";
import { Badge } from "@/components/ui/badge";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
interface OrderCardProps {
    orderWithItems: OrderWithItems;
}

/** 주문 한 건 — 카드 전체를 누르면 상세로(NavRow) */
export const OrderCard = ({ orderWithItems }: OrderCardProps) => {
    const { order, orderItems } = orderWithItems;
    const isPickUp = order instanceof PickUpOrder;

    return (
        <NavRow
            card
            href={`/order-history/${order.id}`}
            label={
                <span className="flex items-center justify-between gap-2">
                    <span className="text-gray-500">{order.created_at ? formatDate(order.created_at.toString()) : "날짜 정보 없음"}</span>
                    <Badge color={isPickUp ? "green" : "blue"}>{isPickUp ? "직접 픽업" : "배송"}</Badge>
                </span>
            }
            description={
                <span className="flex flex-col gap-2">
                    {/* 픽업 정보 (차량 타입) · 배송 정보 (주소) */}
                    {order instanceof PickUpOrder && (
                        <span className="text-[16px]/[24px] font-500 text-gray-700">
                            차량: {order.vehicle_type_direct_input || order.vehicle_type || "미지정"}
                        </span>
                    )}
                    {order instanceof DeliveryOrder && (
                        <span className="text-[16px]/[24px] font-500 text-gray-700">
                            배송지: {order.road_address} {order.detail_address}
                        </span>
                    )}
                    {orderItems.length > 1 && (
                        <span>총 {orderItems.reduce((sum, item) => sum + (item.item_count || 0), 0)}개 상품</span>
                    )}
                    <span className="flex items-center justify-between">
                        <Badge color="gray">총 상품 수 | {orderItems.length}개</Badge>
                        <span className="text-[20px]/[28px] font-600 text-blue-500">{formatPrice(order.order_price)}원</span>
                    </span>
                </span>
            }
        />
    );
};
