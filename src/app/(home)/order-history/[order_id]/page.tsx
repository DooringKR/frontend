"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Header from "@/components/Header/Header";
import { Chip } from "@/components/Chip/Chip";
import { formatDate, formatPrice, getOrderTypeText } from "../utils/formatters";

interface OrderItem {
    order_item_id: number;
    product_type: string;
    unit_price: number;
    item_count: number;
    item_options: any;
}

interface OrderDetail {
    order_id: string;
    cart_id: number;
    order_type: "DELIVERY" | "PICK_UP";
    recipient_phone: string;
    order_price: number;
    order_options: any;
    created_at: string;
    order_items: OrderItem[];
}


import TopNavigator from "@/components/TopNavigator/TopNavigator";
import PickUpIcon from "public/icons/pick-up";
import MapIcon from "public/icons/map";
import formatLocation from "@/utils/formatLocation";
import { CABINET_CATEGORY_LIST, DOOR_CATEGORY_LIST, FINISH_CATEGORY_LIST } from "@/constants/category";
import { getCategoryLabel } from "@/utils/getCategoryLabel";
import { CABINET_ABSORBER_TYPE_NAME, CABINET_BODY_TYPE_NAME, CABINET_FINISH_TYPE_NAME, CABINET_HANDLE_TYPE_NAME, CABINET_ITEMS_NAME } from "@/constants/modelList";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = params.order_id as string;

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                // 단일 주문 조회
                const response = await fetch(`/api/order/${orderId}`);

                if (!response.ok) {
                    throw new Error("주문 정보를 불러오는데 실패했습니다.");
                }

                const data = await response.json();
                const foundOrder = data;
                console.log(foundOrder);

                if (!foundOrder) {
                    setError("주문을 찾을 수 없습니다.");
                    return;
                }

                setOrder(foundOrder);
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
            <div className="flex flex-col pb-[60px]">
                {/* 주문 방식 & 가격 */}
                <div className="flex flex-col px-5 pt-5 pb-[60px] gap-2">
                    <div className="flex gap-2">
                        {order.order_type === "PICK_UP" ? <PickUpIcon /> : <MapIcon />}
                        {order.order_type === "PICK_UP" ?
                            <div className="text-[17px]/[24px] font-500 text-gray-500">픽업 주문</div> :
                            <div className="text-[17px]/[24px] font-500 text-gray-500">
                                {order.order_options.delivery.recipient_road_address}, {order.order_options.delivery.recipient_detail_address}
                            </div>}
                    </div>
                    <div className="text-[26px]/[36px] font-700 text-gray-900">
                        {formatPrice(order.order_price)}원
                    </div>
                </div>
                <div className="mx-5 h-[1px] bg-gray-200"></div>
                {/* 주문 일시 */}
                <div className="px-5 py-4 gap-1">
                    <div className="text-[17px]/[24px] font-600 text-gray-800">주문 일시</div>
                    <div className="text-[15px]/[22px] font-400 text-gray-500">{formatDate(order.created_at, true)}</div>
                </div>
                <div className="mx-5 h-[1px] bg-gray-200"></div>
                {/* 주문 상품 */}
                <div className="flex flex-col px-5 py-4 gap-4">
                    <div className="text-[17px]/[24px] font-600 text-gray-800">주문 상품</div>
                    <div className="space-y-5">
                        {order.order_items.map((item: OrderItem) => {
                            const itemOptions = item.item_options as any;
                            const renderItemDetails = () => {
                                switch (item.product_type.toLowerCase()) {
                                    case "door":
                                        return (
                                            <>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">종류 : {getCategoryLabel(itemOptions.door_type.toLowerCase(), DOOR_CATEGORY_LIST, "일반문") || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">색상 : {itemOptions.door_color || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">가로 길이 : {itemOptions.door_width ? itemOptions.door_width.toLocaleString() : "-"}mm</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">세로 길이 : {itemOptions.door_height ? itemOptions.door_height.toLocaleString() : "-"}mm</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">경첩 개수 : {itemOptions.hinge_count || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">경첩 방향 : {itemOptions.hinge_direction === "left" ? "좌경" : "우경"}</p>
                                                {itemOptions.door_request && <p className="text-[15px]/[22px] font-400 text-gray-600">추가 요청: {itemOptions.door_request}</p>}
                                                {itemOptions.door_location && <p className="text-[15px]/[22px] font-400 text-gray-600">용도 ∙ 장소: {formatLocation(itemOptions.door_location)}</p>}
                                                {itemOptions.addOn_hinge !== undefined && itemOptions.addOn_hinge !== null && (
                                                    <p className="text-[15px]/[22px] font-400 text-gray-600">경첩 추가 선택 : {itemOptions.addOn_hinge ? "경첩도 받기" : "필요 없어요"}</p>
                                                )}
                                            </>
                                        );

                                    case "finish":
                                        return (
                                            <>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">색상 : {itemOptions.finish_color || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">엣지 면 수 : {itemOptions.finish_edge_count || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">깊이 : {itemOptions.finish_base_depth ? itemOptions.finish_base_depth.toLocaleString() : "-"}mm</p>
                                                {itemOptions.finish_additional_depth !== undefined && itemOptions.finish_additional_depth !== null && itemOptions.finish_additional_depth > 0 && <p className="text-[15px]/[22px] font-400 text-gray-600">⤷ 깊이 키움 : {itemOptions.finish_additional_depth.toLocaleString()}mm</p>}
                                                {itemOptions.finish_additional_depth !== undefined && itemOptions.finish_additional_depth !== null && itemOptions.finish_additional_depth > 0 && <p className="text-[15px]/[22px] font-400 text-gray-600">⤷ 합산 깊이 : {(itemOptions.finish_base_depth + itemOptions.finish_additional_depth).toLocaleString()}mm</p>}
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">높이 : {itemOptions.finish_base_height ? itemOptions.finish_base_height.toLocaleString() : "-"}mm</p>
                                                {itemOptions.finish_additional_height !== undefined && itemOptions.finish_additional_height !== null && itemOptions.finish_additional_height > 0 && <p className="text-[15px]/[22px] font-400 text-gray-600">⤷ 높이 키움 : {itemOptions.finish_additional_height.toLocaleString()}mm</p>}
                                                {itemOptions.finish_additional_height !== undefined && itemOptions.finish_additional_height !== null && itemOptions.finish_additional_height > 0 && <p className="text-[15px]/[22px] font-400 text-gray-600">⤷ 합산 높이 : {(itemOptions.finish_base_height + itemOptions.finish_additional_height).toLocaleString()}mm</p>}
                                                {itemOptions.finish_request && <p className="text-[15px]/[22px] font-400 text-gray-600">요청 사항 : {itemOptions.finish_request}</p>}
                                                {itemOptions.finish_location && <p className="text-[15px]/[22px] font-400 text-gray-600">용도 ∙ 장소: {formatLocation(itemOptions.finish_location)}</p>}
                                            </>
                                        );

                                    case "hardware":
                                        return (
                                            <>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">종류: {itemOptions.hardware_type || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">제조사 : {itemOptions.hardware_madeby || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">모델명 : {itemOptions.hardware_size || "-"}</p>
                                                {itemOptions.hardware_request && <p className="text-[15px]/[22px] font-400 text-gray-600">요청 사항 : {itemOptions.hardware_request}</p>}
                                            </>
                                        );

                                    case "cabinet":
                                        return (
                                            <>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">종류 : {getCategoryLabel(itemOptions.cabinet_type, CABINET_CATEGORY_LIST, "부분장") || "-"}</p>
                                                {itemOptions.handle_type && <p className="text-[15px]/[22px] font-400 text-gray-600">손잡이 종류: {CABINET_HANDLE_TYPE_NAME[itemOptions.handle_type as keyof typeof CABINET_HANDLE_TYPE_NAME] || "-"}</p>}
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">색상: {itemOptions.cabinet_color || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">너비: {itemOptions.cabinet_width ? itemOptions.cabinet_width.toLocaleString() : "-"}mm</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">깊이: {itemOptions.cabinet_depth ? itemOptions.cabinet_depth.toLocaleString() : "-"}mm</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">높이: {itemOptions.cabinet_height ? itemOptions.cabinet_height.toLocaleString() : "-"}mm</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">소재: {itemOptions.body_type ? CABINET_BODY_TYPE_NAME[itemOptions.body_type as keyof typeof CABINET_BODY_TYPE_NAME] : "기타"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">마감 방식: {itemOptions.finish_type ? CABINET_FINISH_TYPE_NAME[itemOptions.finish_type as keyof typeof CABINET_FINISH_TYPE_NAME] : "기타"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">소재: {itemOptions.absorber_type ? CABINET_ABSORBER_TYPE_NAME[itemOptions.absorber_type as keyof typeof CABINET_ABSORBER_TYPE_NAME] : "기타"}</p>
                                                {itemOptions.drawer_type && <p className="text-[15px]/[22px] font-400 text-gray-600">서랍 종류: {itemOptions.drawer_type || "-"}</p>}
                                                {itemOptions.rail_type && <p className="text-[15px]/[22px] font-400 text-gray-600">레일 종류: {itemOptions.rail_type || "-"}</p>}
                                                {itemOptions.cabinet_location && <p className="text-[15px]/[22px] font-400 text-gray-600">용도 ∙ 장소: {formatLocation(itemOptions.cabinet_location)}</p>}
                                                {itemOptions.addOn_construction !== undefined && itemOptions.addOn_construction !== null && (
                                                    <p className="text-[15px]/[22px] font-400 text-gray-600">시공 필요 여부 : {itemOptions.addOn_construction ? "시공도 필요해요" : "필요 없어요"}</p>
                                                )}
                                                {itemOptions.leg_type && <p className="text-[15px]/[22px] font-400 text-gray-600">다리발: {itemOptions.leg_type || "-"}</p>}
                                                {itemOptions.cabinet_request && <p className="text-[15px]/[22px] font-400 text-gray-600">기타 요청 사항: {itemOptions.cabinet_request}</p>}
                                            </>
                                        );

                                    case "accessory":
                                        return (
                                            <>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">종류: {itemOptions.accessory_type || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">제조사: {itemOptions.accessory_madeby || "-"}</p>
                                                <p className="text-[15px]/[22px] font-400 text-gray-600">모델명 : {itemOptions.accessory_model || "-"}</p>
                                                {itemOptions.accessory_request && <p className="text-[15px]/[22px] font-400 text-gray-600">요청 사항 : {itemOptions.accessory_request}</p>}
                                            </>
                                        );

                                    default:
                                        return null;
                                }
                            };

                            return (
                                <div
                                    key={item.order_item_id}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="text-[17px]/[24px] font-600 text-gray-900 mb-1">
                                                {item.product_type.toLowerCase() === "door" ? "문짝" :
                                                    item.product_type.toLowerCase() === "finish" ? `${FINISH_CATEGORY_LIST.find(item => item.slug === itemOptions.finish_category.toLowerCase())?.header ?? ""} (마감재)` :
                                                        item.product_type.toLowerCase() === "cabinet" ? "부분장" :
                                                            item.product_type.toLowerCase() === "accessory" ? "부속" :
                                                                item.product_type.toLowerCase() === "hardware" ? "하드웨어" :
                                                                    "직접 주문"}
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
                                    <div className="border-t border-gray-100 pt-3">
                                        {renderItemDetails()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* 수령 방법 */}
                <div></div>
                {/* 배송인 경우: 배송 정보 */}
                {order.order_type === "DELIVERY" &&
                    <div>

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