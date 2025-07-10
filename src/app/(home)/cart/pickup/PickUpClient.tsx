"use client";

import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import { useOrderStore } from "@/store/orderStore";

import RecipientPhoneNumber from "../checkorder/_components/RecipientPhoneNumber";
import PickUpAddressCard from "./_components/PickUpAddressCard";
import PickUpVehicleSelector from "./_components/PickUpVehicleSelector";

export default function PickUpClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const currentItem = useCurrentOrderStore.getState().currentItem;

    if (searchParams.get("current") === "now") {
      setCartItems([currentItem]);
    } else {
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItems(localCart);
    }
  }, [searchParams]);

  const handleSubmit = () => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.count || 1), 0);

    const {
      recipientPhoneNumber,
      address,
      deliveryDate,
      requestMessage,
      foyerAccessType,
      customerRequest,
      pickupInfo,
    } = useOrderStore.getState();

    const orderData = {
      recipientPhoneNumber,
      address1: address.address1,
      address2: address.address2,
      deliveryDate,
      deliveryRequest: requestMessage,
      foyerAccessType,
      otherRequests: customerRequest,
      pickupInfo,
      receiveMethod: "pickup",
      cartItems,
      totalPrice,
    };
    console.log("💾 저장할 pickup 주문:", orderData);
    localStorage.setItem("recentOrder", JSON.stringify(orderData));
    router.push("/cart/confirm");
  };

  return (
    <div>
      <TopNavigator title="주문하기" />
      <div>
        <ReceiveOptionBar
          icon={"/icons/parcel.svg"}
          alt={"소포 아이콘"}
          title={"직접 픽업"}
          children={<PickUpAddressCard />}
          bottomBarClassName="my-8"
        />
        <div className="flex flex-col gap-3 p-5">
          <h1 className="text-xl font-600">픽업정보 확인</h1>
          <RecipientPhoneNumber />
          <PickUpVehicleSelector />
        </div>
        <div className="px-5">
          <PriceCheckCard page={CHECK_ORDER_PAGE} />
        </div>
      </div>

      <BottomButton
        type={"1button"}
        button1Text="주문 접수하기"
        className="p-5"
        onButton1Click={handleSubmit}
      />
    </div>
  );
}
