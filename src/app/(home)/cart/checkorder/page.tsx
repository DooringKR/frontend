"use client";

import { createOrder } from "@/api/orderApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

import CustomerRequest from "./_components/CostomerRequest";
import DeliveryAddressCard from "./_components/DeliveryAddressCard";
import DeliveryScheduleSelector from "./_components/DeliveryScheduleSelector";
import RecipientPhoneNumber from "./_components/RecipientPhoneNumber";

function CheckOrder() {
  if (typeof window === "undefined") return null;
  const { currentItem } = useCurrentOrderStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expectedArrivalMinutes, setExpectedArrivalMinutes] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [address, setAddress] = useState({ address1: "", address2: "" });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const [requestMessage, setRequestMessage] = useState("");
  const [customerRequest, setCustomerRequest] = useState("");
  const [foyerAccessType, setFoyerAccessType] = useState<{
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  }>({
    type: "call",
    gatePassword: null,
  });

  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const userRaw = localStorage.getItem("userData");
    const selectedAddress = saved.state?.address1 || "주소 없음";

    if (saved.state) setAddress(saved.state);
    if (userRaw) {
      const user = JSON.parse(userRaw).state;
      setPhoneNumber(user?.user_phoneNumber || "");
      setRecipientPhoneNumber(user?.user_phoneNumber || "");
    }

    if (searchParams.get("current") === "now") {
      setCartItems([currentItem]);
    } else {
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItems(localCart);
    }

    const fetchDeliveryTime = async () => {
      if (selectedAddress !== "주소 없음") {
        const { expectedArrivalMinutes } = await DeliverTime(selectedAddress);
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const remainingMinutes = expectedArrivalMinutes - currentMinutes;

        setExpectedArrivalMinutes(remainingMinutes);

        const cutoff = 18 * 60;
        const hours = Math.floor(expectedArrivalMinutes / 60)
          .toString()
          .padStart(2, "0");
        const minutes = (expectedArrivalMinutes % 60).toString().padStart(2, "0");

        if (expectedArrivalMinutes <= cutoff) {
          setDeliveryMessage(`당일배송 가능 ${hours}:${minutes}`);
          setDeliveryMessageColor("bg-[#cbdcfb] text-[#215cff]");
        } else {
          setDeliveryMessage(`내일 배송되는 주소에요`);
          setDeliveryMessageColor("bg-gray-500 text-[#bf6a02]");
        }
      }
    };

    fetchDeliveryTime();
  }, [currentItem, searchParams]);

  const handleOrderSubmit = async () => {
    const userRaw = JSON.parse(localStorage.getItem("userData") || "{}");
    const user = userRaw.state || {};

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    const payload = {
      user: {
        id: user.user_id || 0,
        userType: user.userType || "company",
        phoneNumber: phoneNumber,
      },
      recipientPhoneNumber: recipientPhoneNumber,
      address1: address.address1,
      address2: address.address2,
      foyerAccessType: foyerAccessType,
      deliveryDate: deliveryDate,
      deliveryRequest: requestMessage,
      otherRequests: customerRequest,
      cartItems: cartItems,
      totalPrice: totalPrice,
    };

    try {
      await createOrder(payload);
      const currentParam = searchParams.get("current");
      if (currentParam !== "now") {
        localStorage.removeItem("cartItems");
      }

      localStorage.removeItem("address-storage");
      useCurrentOrderStore.getState().clearCurrentItem();
      localStorage.setItem("recentOrder", JSON.stringify(payload));
      router.push("/cart/confirm");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-5 pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">주문하기</h1>

      <div className={`mb-4 p-2 text-center font-medium ${deliveryMessageColor}`}>
        {deliveryMessage}
      </div>

      <DeliveryScheduleSelector
        expectedArrivalMinutes={expectedArrivalMinutes}
        setDeliveryDate={setDeliveryDate}
      />

      <section className="mb-4">
        <h2 className="mb-2 font-medium">배송 정보를 확인해주세요</h2>
        <DeliveryAddressCard
          foyerAccessType={foyerAccessType}
          setFoyerAccessType={setFoyerAccessType}
          address={address}
          requestMessage={requestMessage}
          setRequestMessage={setRequestMessage}
          setAddress={setAddress}
        />
        <RecipientPhoneNumber
          recipientPhoneNumber={recipientPhoneNumber}
          setRecipientPhoneNumber={setRecipientPhoneNumber}
        />
        <CustomerRequest
          customerRequest={customerRequest}
          setCustomerRequest={setCustomerRequest}
        />
      </section>

      <Button selected={true} onClick={handleOrderSubmit}>
        주문하기
      </Button>
    </div>
  );
}

export default CheckOrder;
