import { formatDate, formatPrice, getOrderTypeText } from "../utils/formatters";
import { OrderWithItems } from "../hooks/useOrderHistory";
import { Chip } from "@/components/Chip/Chip";
import { useRouter } from "next/navigation";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { 
    DOOR_CATEGORY_LIST, 
    CABINET_CATEGORY_LIST, 
    ACCESSORY_CATEGORY_LIST, 
    HARDWARE_CATEGORY_LIST,
    FINISH_CATEGORY_LIST 
} from "@/constants/category";
import { getCategoryLabel } from "@/utils/getCategoryLabel";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

interface OrderCardProps {
    orderWithItems: OrderWithItems;
}

// 상품 표시명을 생성하는 함수
function getProductDisplayName(item: any): string {
    const productType = item.product_type?.toLowerCase();
    const itemOptions = item.item_options || {};

    switch (productType) {
        case "door":
            const doorType = itemOptions.door_type?.toLowerCase() || itemOptions.door_category?.toLowerCase();
            return getCategoryLabel(doorType, DOOR_CATEGORY_LIST, "문짝");
        case "cabinet":
            // DetailProductType enum 값들을 체크
            if (item.detail_product_type === DetailProductType.UPPERCABINET) return "상부장";
            if (item.detail_product_type === DetailProductType.LOWERCABINET) return "하부장";
            if (item.detail_product_type === DetailProductType.FLAPCABINET) return "플랩장";
            if (item.detail_product_type === DetailProductType.DRAWERCABINET) return "서랍장";
            if (item.detail_product_type === DetailProductType.OPENCABINET) return "오픈장";
            
            const cabinetType = itemOptions.cabinet_type?.toLowerCase();
            return getCategoryLabel(cabinetType, CABINET_CATEGORY_LIST, "부분장");
        case "accessory":
            const accessoryType = itemOptions.accessory_type?.toLowerCase() || itemOptions.accessory_category?.toLowerCase();
            return getCategoryLabel(accessoryType, ACCESSORY_CATEGORY_LIST, "부속");
        case "finish":
            const finishType = itemOptions.finish_category?.toLowerCase() || itemOptions.finish_type?.toLowerCase();
            return getCategoryLabel(finishType, FINISH_CATEGORY_LIST, "마감재");
        case "hardware":
            // DetailProductType enum 값들을 체크
            if (item.detail_product_type === DetailProductType.HINGE) return "경첩";
            if (item.detail_product_type === DetailProductType.RAIL) return "레일";
            if (item.detail_product_type === DetailProductType.PIECE) return "부속품";
            
            const hardwareType = itemOptions.hardware_type?.toLowerCase();
            return getCategoryLabel(hardwareType, HARDWARE_CATEGORY_LIST, "하드웨어");
        default:
            return "상품";
    }
}

export const OrderCard = ({ orderWithItems }: OrderCardProps) => {
    const router = useRouter();
    const { order, orderItems } = orderWithItems;

    const handleCardClick = () => {
        router.push(`/order-history/${order.id}`);
    };

    return (
        <div
            className="bg-white rounded-[16px] p-5 border border-gray-200 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleCardClick}
        >
            <div className="flex flex-col gap-2">
                {/* 날짜와 주문 타입 */}
                <div className="flex justify-between items-center">
                    <div className="text-[17px]/[24px] font-500 text-gray-500">
                        {order.created_at ? formatDate(order.created_at.toString()) : "날짜 정보 없음"}
                    </div>
                    <Chip 
                        text={order instanceof PickUpOrder ? "직접 픽업" : "배송"} 
                        color={order instanceof PickUpOrder ? "green" : "blue"} 
                    />
                </div>
                
                {/* 픽업 정보 (차량 타입) */}
                {order instanceof PickUpOrder && (
                    <div className="text-[16px]/[24px] font-500 text-gray-700">
                        차량: {order.vehicle_type_direct_input || order.vehicle_type || "미지정"}
                    </div>
                )}
                
                {/* 배송 정보 (주소) */}
                {order instanceof DeliveryOrder && (
                    <div className="text-[16px]/[24px] font-500 text-gray-700">
                        배송지: {order.road_address} {order.detail_address}
                    </div>
                )}
            </div>
            
            <div>
                {/* 첫 번째 상품 정보 */}
                {orderItems.length > 0 && (
                    <div className="flex flex-col gap-1 mb-2">
                        <div className="text-[15px]/[22px] font-400 text-gray-500">
                            주문 아이템 {orderItems.length}개
                        </div>
                        {orderItems.length > 1 && (
                            <div className="text-[13px] text-gray-500">
                                총 {orderItems.reduce((sum, item) => sum + (item.item_count || 0), 0)}개 상품
                            </div>
                        )}
                    </div>
                )}

                {/* 총 금액 */}
                <div className="flex justify-between items-center">
                    <Chip text={`총 상품 수 | ${orderItems.length}개`} color="gray" />
                    <div className="text-[20px]/[28px] font-600 text-blue-500">{formatPrice(order.order_price)}원</div>
                </div>
            </div>
        </div>
    );
}; 