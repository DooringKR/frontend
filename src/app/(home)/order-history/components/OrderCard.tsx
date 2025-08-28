import { formatDate, formatPrice, getOrderTypeText } from "../utils/formatters";
import { Order } from "../hooks/useOrderHistory";
import { Chip } from "@/components/Chip/Chip";
import { useRouter } from "next/navigation";
// import { getCategoryLabel } from "@/utils/getCategoryLabel";
// import { DOOR_CATEGORY_LIST, CABINET_CATEGORY_LIST, ACCESSORY_CATEGORY_LIST } from "@/constants/category";

interface OrderCardProps {
    order: Order;
}

// // 상품 표시명을 생성하는 함수
// function getProductDisplayName(item: any): string {
//     const productType = item.product_type?.toLowerCase();
//     const itemOptions = item.item_options || {};

//     switch (productType) {
//         case "door":
//             const doorType = itemOptions.door_type?.toLowerCase();
//             return getCategoryLabel(doorType, DOOR_CATEGORY_LIST, "문짝");
//         case "cabinet":
//             const cabinetType = itemOptions.cabinet_type?.toLowerCase();
//             return getCategoryLabel(cabinetType, CABINET_CATEGORY_LIST, "부분장");
//         case "accessory":
//             const accessoryType = itemOptions.accessory_type?.toLowerCase();
//             return getCategoryLabel(accessoryType, ACCESSORY_CATEGORY_LIST, "부속");
//         case "finish":
//             return "마감재";
//         case "hardware":
//             return "하드웨어";
//         default:
//             return "상품";
//     }
// }

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

                {/* 첫 번째 상품 정보 */}
                {/* {order.firstItem && (
                    <div className="flex flex-col gap-1 mb-2">
                        <div className="text-[15px]/[22px] font-400 text-gray-500">
                            {getProductDisplayName(order.firstItem)} | {order.firstItem.item_count}개
                        </div>
                        {order.itemCount > 1 && (
                            <div className="text-[13px] text-gray-500">
                                외 {order.itemCount - 1}개 상품
                            </div>
                        )}
                    </div>
                )} */}

                {/* 총 금액 */}
                <div className="flex justify-between items-center">
                    <Chip text={`총 상품 수 | ${order.order_items.length}개`} color="gray" />
                    <div className="text-[20px]/[28px] font-600 text-blue-500">{formatPrice(order.order_price)}원</div>
                </div>
            </div>
        </div>
    );
}; 