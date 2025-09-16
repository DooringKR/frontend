"use client";

import { completeOrder, createOrder, createOrderItem } from "@/api/orderApi";
import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import useAddressStore from "@/store/addressStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import useUserStore from "@/store/userStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

import DeliveryAddressCard from "./_components/DeliveryAddressCard";
import DeliveryRequestSelector from "./_components/DeliveryRequestSelector";
import DeliveryScheduleSelector from "./_components/DeliveryScheduleSelector";
import RecipientPhoneNumber from "./_components/RecipientPhoneNumber";

import { usePageView } from "@/services/hooks/usePageView";
import { useButtonClick } from "@/services/hooks/useButtonClick";


const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

function CheckOrderClientPage() {
  usePageView("CheckOrder");
  const { currentItem } = useCurrentOrderStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    address,
    setAddress,
    recipientPhoneNumber,
    setRecipientPhoneNumber,
    foyerAccessType,
    setFoyerAccessType,
    requestMessage,
    setRequestMessage,
    customerRequest,
    setCustomerRequest,
  } = useOrderStore();

  const { address1: savedAddress1, address2: savedAddress2 } = useAddressStore();
  const { user_phoneNumber } = useUserStore();

  const [expectedArrivalMinutes, setExpectedArrivalMinutes] = useState<number | null>(null);
  // const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const [isTodayAvailable, setIsTodayAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cartId = useCartStore(state => state.cartId);
  const cartItems = useCartStore(state => state.cartItems);
  const userId = useUserStore.getState().id;
  const receiveMethod = useOrderStore(state => state.receiveMethod);
  const deliveryDate = useOrderStore(state => state.deliveryDate);
  const deliveryType = useOrderStore(state => state.deliveryType);

  const hour = useOrderStore(state => state.deliveryHour);

  const minute = useOrderStore(state => state.deliveryMinute);

  useEffect(() => {
    useOrderStore.getState().setReceiveMethod("DELIVERY");
  }, []);

  useEffect(() => {
    const store = useOrderStore.getState();

    // 항상 배송 방식은 DELIVERY로 고정
    store.setReceiveMethod("DELIVERY");

    // 오늘 배송이 불가능하면 강제로 custom으로 설정
    if (
      !isTodayAvailable &&
      store.deliveryType === "today" &&
      store.userSelectedDeliveryType !== "today"
    ) {
      store.setDeliveryType("custom");
      store.setDeliveryHour("--");
      store.setDeliveryMinute("--");
      store.setSelectedDeliveryDate(null);
    }
  }, [isTodayAvailable]);

  useEffect(() => {
    // 기본 주소 세팅
    if (!address.address1 && !address.address2 && savedAddress1 && savedAddress2) {
      setAddress({ address1: savedAddress1, address2: savedAddress2 });
    }

    // 전화번호 세팅
    if (!recipientPhoneNumber && user_phoneNumber) {
      setRecipientPhoneNumber(user_phoneNumber);
    }

    const fetchDeliveryTime = async () => {
      if (address.address1) {
        const { remainingMinutes, isToday, arrivalTimeFormatted } = await calculateDeliveryInfo(
          address.address1,
        );

        setExpectedArrivalMinutes(remainingMinutes);
        setIsTodayAvailable(isToday);

        if (isToday) {
          setDeliveryMessage(`당일배송 가능 ${arrivalTimeFormatted}`);
          setDeliveryMessageColor("bg-[#cbdcfb] text-[#215cff]");
        } else {
          setDeliveryMessage(`내일 배송되는 주소에요`);
          setDeliveryMessageColor("bg-gray-500 text-[#bf6a02]");
        }
      }
    };

    fetchDeliveryTime();
  }, [
    currentItem,
    searchParams,
    address,
    recipientPhoneNumber,
    savedAddress1,
    savedAddress2,
    user_phoneNumber,
  ]);

  useEffect(() => {
    console.log("💡 Zustand의 cartItems:", cartItems);
    console.log("💾 localStorage.cartItems:", localStorage.getItem("cartItems"));
  }, []);

  const buildOrderOptions = () => {
    const delivery: Record<string, any> = {
      recipient_road_address: address.address1,
      recipient_detail_address: address.address2,
      delivery_type: deliveryType === "today" && isTodayAvailable ? "TODAY" : "CUSTOM",
    };

    // 주문 직전에 상태 기반으로 새로 계산
    if (delivery.delivery_type === "CUSTOM") {
      const store = useOrderStore.getState();
      const hour = store.deliveryHour;
      const minute = store.deliveryMinute;
      const selectedDate = store.selectedDeliveryDate;

      if (hour !== "--" && minute !== "--" && selectedDate) {
        // 선택된 날짜와 시간으로 배송 시간 설정
        const [year, month, day] = selectedDate.split("-").map(Number);
        const deliveryDateTime = new Date(year, month - 1, day, Number(hour), Number(minute), 0, 0);
        delivery.detail_delivery_time = deliveryDateTime.toISOString();
      }
    }
    delivery.delivery_request = requestMessage;

    if (requestMessage === "OPEN_GATE") {
      delivery.gate_password = foyerAccessType.gatePassword;
    }

    if (requestMessage === "DIRECT_INPUT") {
      delivery.delivery_request_direct_input = customerRequest;
    }

    return { delivery };
  };

  const buttonClick = useButtonClick("CheckOrder", "ToConfirm");
  const handleOrderSubmit = async () => {
    buttonClick();
    setIsLoading(true);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.count || 1), 0);

    if (!userId || !cartId) {
      alert("주문을 위한 사용자 또는 장바구니 정보가 부족합니다.");
      return;
    }

    const payload = {
      user_id: userId,
      cart_id: cartId,
      order_type: "DELIVERY" as const,
      recipient_phone: recipientPhoneNumber.replace(/[^0-9]/g, ""),
      order_price: totalPrice,
      order_options: buildOrderOptions(),
    };

    try {
      const order = await createOrder(payload);
      const orderId = order.order_id;
      console.log("오더아이디", orderId);

      /*

      // 장바구니 항목을 기반으로 order_item 생성
      const createdOrderItems = await Promise.all(
        cartItems.map(item => {
          console.log("🧾 category 확인:", item.category);
          console.log("내부에서 오더아이디", orderId);
          const itemPayload = {
            order_id: orderId,
            product_type: item.category?.toUpperCase(),
            unit_price: item.price,
            item_count: item.count ?? 1,
            item_options: item,
          };

          console.log("🧾 order_item 요청 payload:", itemPayload);
          return createOrderItem(itemPayload);
        }),
      );

      */

      // await completeOrder(orderId);

      console.log("🚚 order_item 요청 payload:", payload);
      localStorage.setItem("recentOrder", JSON.stringify(order));
      router.push("/cart/confirm");
    } catch (error) {
      console.error("❌ 주문 생성 실패:", error);
      alert("주문 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.count ?? 1), 0);

  const selectedDeliveryDate = useOrderStore(state => state.selectedDeliveryDate);

  const isRequestInvalid =
    !requestMessage ||
    (requestMessage === "OPEN_GATE" && !foyerAccessType.gatePassword?.trim()) ||
    (requestMessage === "DIRECT_INPUT" && !customerRequest?.trim()) ||
    (deliveryType === "custom" && (hour === "--" || minute === "--" || !selectedDeliveryDate));
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <TopNavigator title="주문하기" />
      <ReceiveOptionBar
        icon={"/icons/truck.svg"}
        alt={"트럭 아이콘"}
        title={"배송"}
        bottomBarClassName="mt-4 mb-8"
      />
      <div className="flex-grow px-5">
        <div className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">주소 확인</h2>
          <DeliveryAddressCard address={address} setAddress={setAddress} />
        </div>

        <DeliveryScheduleSelector expectedArrivalMinutes={expectedArrivalMinutes} />

        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">배송정보 확인</h2>
          <RecipientPhoneNumber />
          <DeliveryRequestSelector />
        </section>

        <PriceSummaryCard
          getTotalPrice={getTotalPrice}
          categoryMap={CATEGORY_MAP}
          page={CHECK_ORDER_PAGE}
        />
      </div>
      <div className="h-[100px]"></div>
      <div id="delivery-order-button" className="fixed bottom-0 w-full max-w-[460px] p-5">
        <Button
          selected={true}
          onClick={handleOrderSubmit}
          className="w-full"
          disabled={isRequestInvalid || isLoading}
        >
          {isLoading ? "주문 요청 중..." : "주문 접수하기"}
        </Button>
      </div>
    </div>
  );
}

export default CheckOrderClientPage;
