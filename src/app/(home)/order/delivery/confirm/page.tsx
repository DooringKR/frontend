"use client";


import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

export default function OrderConfirmPage() {
    const router = useRouter();
    const [recentOrder, setRecentOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [showDetails, setShowDetails] = useState(true);

    useEffect(() => {
        const recentOrderRaw = localStorage.getItem("recentOrder");
        if (recentOrderRaw) {
            const orderData = JSON.parse(recentOrderRaw);
            console.log("📦 전체 orderData:", orderData);
            console.log("📦 orderData.order:", orderData.order);
            console.log("📦 orderData.cartItems:", orderData.cartItems);
            console.log("📦 orderData.order_id:", orderData.order_id); // 이게 실제 order_id

            setRecentOrder(orderData.order);
            setOrderItems(orderData.cartItems || []);

            // order_id를 recentOrder에 추가
            if (orderData.order_id) {
                setRecentOrder((prev: any) => ({
                    ...prev,
                    order_id: orderData.order_id
                }));
            }
        }
    }, []);

    // orderItems 상태가 변경될 때마다 로깅 (디버깅용)
    useEffect(() => {
        if (orderItems.length > 0) {
            console.log("✅ orderItems 상태 업데이트됨:", orderItems);
        }
    }, [orderItems]);

    const handleCopyAccount = () => {
        navigator.clipboard.writeText("IBK기업은행 52307836904011");
        alert("계좌번호가 복사되었습니다!");
    };
    const goToOrderHistory = () => {
        // console.log("🔍 goToOrderHistory - recentOrder:", recentOrder);
        console.log("🔍 goToOrderHistory - order_id:", recentOrder?.order_id);

        if (!recentOrder?.order_id || recentOrder.order_id === "undefined") {
            alert("주문 ID가 없습니다. 주문 정보를 다시 확인해주세요.");
            return;
        }

        router.replace(`/order-history/${recentOrder.order_id}?from=confirm`);
    };

    const handleGoHome = async () => {
        // 장바구니의 아이템 삭제와 주문 정보 초기화는 이미 PickUpClient에서 처리했으므로
        // localStorage만 초기화
        localStorage.removeItem("recentOrder");
        router.push("/");
    };

    if (!recentOrder) {
        return <p className="p-5">주문 정보가 없습니다.</p>;
    }

    const recipient_phone = recentOrder?.recipient_phone;
    const order_price = recentOrder?.order_price || 0;

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex-1 overflow-y-auto pb-[100px]">
                <div className="flex flex-col px-5 pt-[60px]">
                    <p className="mb-2 text-[23px] font-700 text-gray-900">주문이 잘 접수되었어요</p>
                    <p className="text-[17px] font-400 text-gray-500">남은 단계를 확인해주세요.</p>
                    <div className="flex items-center justify-center py-10">
                        <img src={"/icons/check-mark-green.svg"} alt="체크 아이콘" className="h-24 w-24" />
                    </div>
                    <div className="mb-10 mt-5 flex flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                    1
                                </div>
                                <div>바로가구에서 주문 확인하면</div>
                            </div>
                            <div className="mt-2 flex">
                                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                                <p className="pb-7 font-400 text-gray-500">
                                    {formatPhoneNumber(recipient_phone)}로
                                    <br />
                                    담당자 확인 후 순차적으로 확인 전화드려요
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                    2
                                </div>
                                <div>주문금액을 아래 계좌로 송금하고</div>
                            </div>
                            <div className="mt-2 flex">
                                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                                <div className="flex w-[291px] flex-col gap-5 rounded-xl border border-gray-200 p-4 pb-7 font-400 text-gray-400">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-500">주문금액</span>
                                        <span className="text-xl font-600 text-blue-500">
                                            {order_price.toLocaleString()}원
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <img
                                            src={"/icons/bank.svg"}
                                            alt="IBK기업은행 로고"
                                            className="h-7 w-7 justify-start"
                                        />

                                        <div className="flex flex-col items-start">
                                            <span className="text-[17px] font-500 text-gray-600">52307836904011</span>
                                            <span className="text-sm font-500">IBK기업은행</span>
                                        </div>
                                        <div>
                                            <button
                                                className="cursor-pointer rounded-lg bg-brand-50 px-[10px] py-[5px] text-[15px] font-500 text-brand-500"
                                                onClick={handleCopyAccount}
                                            >
                                                복사
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                    3
                                </div>
                                <div>바로가구에서 입금 확인하면</div>
                            </div>
                            <div className="mt-2 flex">
                                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                                <p className="pb-7 font-400 text-gray-500">
                                    알림톡 보내드리고 곧바로 배송 시작해요
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                    4
                                </div>
                                <div>
                                    퀵 ∙ 용달로 오늘까지 배송해드려요
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                    5
                                </div>
                                <div>
                                    시공 현장 사진, 도면을 카톡 채널 또는<br />문자(010-6409-4542)로 보내주세요
                                </div>
                            </div>
                            <div className="mt-2 flex">
                                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                                <div
                                    className="flex cursor-pointer justify-between py-[10px] w-full"
                                    onClick={() => {
                                        window.open(
                                            "https://pf.kakao.com/_BlAHG",
                                            "_blank",
                                        );
                                    }}
                                >
                                    <div className="flex gap-2 w-full">
                                        <img src={"/icons/kakaoTalk.svg"} alt="카카오톡 아이콘" />
                                        <span className="text-[17px] font-600">카카오톡 채널 바로가기</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 px-5 py-10">
                    <div className="w-full">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex w-full justify-between rounded-xl bg-white p-3"
                        >
                            <span className="font-semibold">주문내역 확인</span>
                            <Image src="/icons/Arrow_Bottom.svg" width={15} height={7.5} alt="토글버튼" />
                        </button>
                        {showDetails && (
                            <div className="mt-2 rounded-xl bg-white p-5 text-sm">
                                <div className="mb-5 flex justify-between">
                                    <span className="text-[17px] font-600">주문 상품</span>
                                </div>

                                <div className="flex flex-col gap-5 border-b border-gray-200 pb-3">
                                    {orderItems.map((item, i) => {
                                        if (!item) return null;

                                        const unitPrice = item.unit_price || 0;
                                        const subtotal = unitPrice * (item.item_count || 0);

                                        return (
                                            <div key={i} className="border-b border-gray-200 pb-3 mb-3">
                                                <p className="font-600 text-gray-800 mb-2">{item.detail_product_type}</p>
                                                <p className="text-gray-600">수량: {item.item_count}개</p>
                                                <p className="text-gray-600">
                                                    단가: {unitPrice === 0 ? '별도 견적' : `${unitPrice.toLocaleString()}원`}
                                                </p>
                                                <p className="text-gray-600 font-600 mt-1">
                                                    소계: {subtotal === 0 ? '별도 견적' : `${subtotal.toLocaleString()}원`}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mb-2 mt-3 border-b border-gray-200 pb-3 text-gray-500">
                                    <p className="mb-1 text-[17px] font-600 text-gray-800">배송일정</p>
                                    <p>
                                        {recentOrder.is_today_delivery === true
                                            ? "당일배송"
                                            : new Date(recentOrder.delivery_arrival_time).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit" })
                                        }
                                    </p>
                                </div>
                                <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
                                    <p className="mb-1 text-[17px] font-600 text-gray-800">배송주소</p>
                                    <p>{recentOrder.road_address}</p>
                                    <p>{recentOrder.detail_address}</p>
                                </div>



                                <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
                                    <p className="mb-1 text-[17px] font-600 text-gray-800">배송기사 요청사항</p>
                                    {recentOrder.delivery_method === DeliveryMethod.OPEN_GATE && (
                                        <>
                                            <p>공동현관으로 올라오세요</p>
                                            {recentOrder.gate_password && (
                                                <p>공동현관 비밀번호: {recentOrder.gate_password}</p>
                                            )}
                                        </>
                                    )}
                                    {recentOrder.delivery_method === DeliveryMethod.CALL && <p>전화주시면 마중 나갈게요</p>}
                                    {recentOrder.delivery_method === DeliveryMethod.LEAVE_DOOR && <p>문 앞에 두면 가져갈게요</p>}
                                    {recentOrder.delivery_method === DeliveryMethod.DIRECT_INPUT && recentOrder.delivery_method_direct_input && (
                                        <>
                                            <p>직접입력</p>
                                            <p>{recentOrder.delivery_method_direct_input}</p>
                                        </>
                                    )}
                                </div>

                                <div className="text-gray-500">
                                    <p className="mb-1 text-[17px] font-600 text-gray-800">받는 분 휴대폰 번호</p>
                                    <p>{formatPhoneNumber(recipient_phone)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="fixed bottom-0 z-50 flex w-full max-w-[460px] gap-3 bg-white p-5">
                    <Button className="flex-1" onClick={handleGoHome}>
                        홈으로
                    </Button>
                    <Button selected className="flex-1" onClick={goToOrderHistory}>
                        주문 자세히 보기
                    </Button>
                </div>
            </div>
        </div>
    );
}
