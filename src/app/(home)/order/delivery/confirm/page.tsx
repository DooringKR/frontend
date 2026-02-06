"use client";

import { DeliveryMethod, DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import { Chip } from "@/components/Chip/Chip";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";
import { useOrderStore } from "@/store/orderStore";

const sortItemsByNickName = (items: any[]) => {
  return [...items].sort((a, b) => {
    const aNum = Number.parseInt(a?.nick_name ?? "", 10);
    const bNum = Number.parseInt(b?.nick_name ?? "", 10);
    const aValid = Number.isFinite(aNum);
    const bValid = Number.isFinite(bNum);
    if (aValid && bValid) return aNum - bNum;
    if (aValid) return -1;
    if (bValid) return 1;
    return String(a?.id ?? "").localeCompare(String(b?.id ?? ""));
  });
};

export default function OrderConfirmPage() {
  const router = useRouter();
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName('order_delivery_confirm');
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  useEffect(() => {
    const applyOrderData = (orderData: { order_id?: string; order: any; cartItems: any[] }) => {
      const allCartItems = orderData.cartItems || [];
      const setProducts = allCartItems.filter((item: any) => item.detail_product_type === DetailProductType.LONGDOOR);
      const hasSetProducts = setProducts.length > 0;
      const itemsToDisplay = hasSetProducts ? setProducts : allCartItems;

      setRecentOrder({
        ...(orderData.order || {}),
        hasSetProducts,
        order_id: orderData.order_id,
      });
      setOrderItems(sortItemsByNickName(itemsToDisplay));
    };

    // 1) 스토어에 있으면 사용 (push 직전에 저장됨 → 타이밍 이슈 없음)
    const fromStore = useOrderStore.getState().recentOrderForConfirm;
    if (fromStore) {
      useOrderStore.getState().clearRecentOrderForConfirm();
      applyOrderData(fromStore);
      return;
    }

    // 2) 없으면 localStorage
    const recentOrderRaw = localStorage.getItem("recentOrder");
    if (recentOrderRaw) {
      try {
        const orderData = JSON.parse(recentOrderRaw);
        applyOrderData(orderData);
      } catch {
        // ignore
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
  const goToOrderHistory = async () => {
    // console.log("🔍 goToOrderHistory - recentOrder:", recentOrder);
    console.log("🔍 goToOrderHistory - order_id:", recentOrder?.order_id);

    if (!recentOrder?.order_id || recentOrder.order_id === "undefined") {
      alert("주문 ID가 없습니다. 주문 정보를 다시 확인해주세요.");
      return;
    }

    setIsNavigating(true);
    try {
      await router.replace(`/order-history/${recentOrder.order_id}?from=confirm`);
    } catch (error) {
      console.error("페이지 이동 중 오류:", error);
      setIsNavigating(false);
    }
  };

  const handleGoHome = async () => {
    localStorage.removeItem("recentOrder");
    useOrderStore.getState().clearRecentOrderForConfirm();
    router.push("/");
  };

  if (!recentOrder) {
    return <p className="p-5">주문 정보가 없습니다.</p>;
  }

  const recipient_phone = recentOrder?.recipient_phone;
  const order_price = recentOrder?.order_price || 0;
  const hasSetProducts = recentOrder?.hasSetProducts || false;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto pb-[100px]">
        <div className="flex flex-col px-5 pt-[60px]">
          <p className="mb-2 text-[23px] font-700 text-gray-900">주문이 잘 접수되었어요</p>
          <p className="text-[17px] font-400 text-gray-500">남은 단계를 확인해주세요.</p>
          <div className="flex items-center justify-center py-10">
            <img src={"/icons/check-mark-green.svg"} alt="체크 아이콘" className="h-24 w-24" />
          </div>
          {!hasSetProducts && (
            <div className="mb-10 mt-5 flex flex-col gap-2">
              <div>
                <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    1
                  </div>
                  <div>
                    시공 현장 사진, 도면을 카톡 채널 또는
                    <br />
                    문자(010-6409-4542)로 보내주세요
                  </div>
                </div>
                <div className="mt-2 flex">
                  <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                  <div
                    className="flex w-full cursor-pointer justify-between py-[10px]"
                    onClick={() => {
                      window.open("https://pf.kakao.com/_BlAHG", "_blank");
                    }}
                  >
                    <div className="flex w-full gap-2">
                      <img src={"/icons/kakaoTalk.svg"} alt="카카오톡 아이콘" />
                      <span className="text-[17px] font-600">카카오톡 채널 바로가기</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    2
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
                    3
                  </div>
                  <div>주문금액을 아래 계좌로 송금하고</div>
                </div>
                <div className="mt-2 flex">
                  <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                  <div className="flex w-[291px] flex-col gap-5 rounded-xl border border-gray-200 p-4 pb-7 font-400 text-gray-400">
                    <div className="flex flex-col">
                      <span className="text-sm font-500"> 예상 금액 바탕으로 견적서 송부 예정</span>
                      <span className="text-xl font-600 text-red-500">
                        견적서 확인 후 송금해주세요
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
                    5
                  </div>
                  <div>퀵 ∙ 용달로 {recentOrder.is_today_delivery === true
                    ? "오늘"
                    : new Date(recentOrder.delivery_arrival_time).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                    })}까지 배송해드려요</div>
                </div>
              </div>
            </div>
          )}
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
                      <div key={i} className="mb-3 border-b border-gray-200 pb-3">
                        <div className="mb-2 flex items-center gap-2 font-600 text-gray-800">
                          {item.nick_name && (
                            <Chip
                              text={`${item.nick_name}`}
                              color="gray"
                              weight="weak"
                              className="text-[12px]/[16px] px-[6px] py-[1px]"
                            />
                          )}
                          <span>{item.detail_product_type}</span>
                        </div>
                        <p className="text-gray-600">수량: {item.item_count}개</p>
                        <p className="text-gray-600">
                          단가: {unitPrice === 0 ? "별도 견적" : `${unitPrice.toLocaleString()}원`}
                        </p>
                        <p className="mt-1 font-600 text-gray-600">
                          소계: {subtotal === 0 ? "별도 견적" : `${subtotal.toLocaleString()}원`}
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
                      : new Date(recentOrder.delivery_arrival_time).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                      })}
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
                  {recentOrder.delivery_method === DeliveryMethod.CALL && (
                    <p>전화주시면 마중 나갈게요</p>
                  )}
                  {recentOrder.delivery_method === DeliveryMethod.LEAVE_DOOR && (
                    <p>문 앞에 두면 가져갈게요</p>
                  )}
                  {recentOrder.delivery_method === DeliveryMethod.DIRECT_INPUT &&
                    recentOrder.delivery_method_direct_input && (
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
          <Button selected className="flex-1" onClick={goToOrderHistory} disabled={isNavigating}>
            {isNavigating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>이동 중...</span>
              </div>
            ) : (
              "주문 자세히 보기"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
