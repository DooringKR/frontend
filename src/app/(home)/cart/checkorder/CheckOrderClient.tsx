"use client";

import { createOrder } from "@/api/orderApi";
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

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

function CheckOrderClientPage() {
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
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { cartItems: globalCartItems } = useCartStore();
  const { cartId } = useCartStore.getState();
  const { id: userId } = useUserStore.getState();

  useEffect(() => {
    // 기본 주소 세팅
    if (!address.address1 && !address.address2 && savedAddress1 && savedAddress2) {
      setAddress({ address1: savedAddress1, address2: savedAddress2 });
    }

    // 전화번호 세팅
    if (!recipientPhoneNumber && user_phoneNumber) {
      setRecipientPhoneNumber(user_phoneNumber);
    }

    // 장바구니 세팅
    if (searchParams.get("current") === "now") {
      setCartItems([currentItem]);
    } else {
      setCartItems(globalCartItems);
    }

    const fetchDeliveryTime = async () => {
      if (address.address1) {
        const { remainingMinutes, isToday, arrivalTimeFormatted } = await calculateDeliveryInfo(
          address.address1,
        );

        setExpectedArrivalMinutes(remainingMinutes);

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
    console.log("✅ 실제 cartItems 값:", cartItems);
  }, [cartItems]);

  const buildOrderOptions = () => {
    const delivery: Record<string, any> = {
      recipient_road_address: address.address1,
      recipient_detail_address: address.address2,
      delivery_type: expectedArrivalMinutes !== null ? "TODAY" : "TOMORROW",
    };

    if (expectedArrivalMinutes === null) {
      // 오늘 배송 불가 → 내일 도착 시간 필요
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0); // 예: 내일 오후 2시 예상
      delivery.tomorrow_delivery_time = tomorrow.toISOString();
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

  const handleOrderSubmit = async () => {
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
      localStorage.setItem("recentOrder", JSON.stringify(order));
      router.push("/cart/confirm");
    } catch (error) {
      console.error("❌ 주문 생성 실패:", error);
      alert("주문 생성에 실패했습니다.");
    }
  };

  const groupedCartItems = cartItems.reduce((acc: Record<string, any[]>, item) => {
    if (!item || !item.category) return acc;
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.count ?? 1), 0);

  const sanitizedCartGroups = Object.fromEntries(
    Object.entries(groupedCartItems).map(([key, items]) => [key, items.filter(Boolean)]),
  );

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

        <DeliveryScheduleSelector
          expectedArrivalMinutes={expectedArrivalMinutes}
          setDeliveryDate={setDeliveryDate}
        />

        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">배송정보 확인</h2>
          <RecipientPhoneNumber />
          <DeliveryRequestSelector />
        </section>

        <PriceSummaryCard
          cartGroups={sanitizedCartGroups}
          getTotalPrice={getTotalPrice}
          categoryMap={CATEGORY_MAP}
          page={CHECK_ORDER_PAGE}
        />
      </div>

      <div className="w-full px-5 pb-5 pt-3">
        <Button selected={true} onClick={handleOrderSubmit} className="w-full">
          주문 접수하기
        </Button>
      </div>
    </div>
  );
}

export default CheckOrderClientPage;
