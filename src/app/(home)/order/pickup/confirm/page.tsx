"use client";

import { deleteCartItem } from "@/api/cartApi";
import {
    ACCESSORY_CATEGORY_LIST,
    CABINET_CATEGORY_LIST,
    DOOR_CATEGORY_LIST,
    FINISH_CATEGORY_LIST,
    HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
import {
    AccessoryItem,
    CabinetItem,
    DoorItem,
    FinishItem,
    HardwareItem,
} from "@/types/newItemTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { useOrderStore } from "@/store/orderStore";
import { formatBoringDirection } from "@/utils/formatBoring";
import formatColor from "@/utils/formatColor";
import formatLocation from "@/utils/formatLocation";
import { getCategoryLabel } from "@/utils/getCategoryLabel";

import PickUpAddressCard from "./_components/PickUpAddressCard";
import OrderConfirmCard from "./_components/OrderConfirmCard";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

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

            setRecentOrder(orderData.order);
            setOrderItems(orderData.cartItems || []);
            // setState는 비동기이므로 여기서 orderItems를 로깅하면 이전 상태값이 나옴
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
        router.push("/order-history");
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
                                    10분 안에 확인 전화드려요
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
                                    알림톡 보내드리고 곧바로 제작 시작해요
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                    4
                                </div>
                                <div>아래 주소에서 픽업할 수 있어요</div>
                            </div>
                            <div className="mt-2 flex">
                                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                                <PickUpAddressCard page="pickup" />
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
                                    <p className="mb-1 text-[17px] font-600 text-gray-800">픽업 정보</p>
                                    <p>픽업 예정</p>
                                </div>

                                <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
                                    <p className="mb-1 text-[17px] font-600 text-gray-800">픽업 차량 정보</p>
                                    <p>{recentOrder?.vehicle_type === "직접 입력"
                                        ? recentOrder?.vehicle_type_direct_input : recentOrder?.vehicle_type || ""}</p>
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
