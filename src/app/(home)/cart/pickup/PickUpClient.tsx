"use client";

import { createOrder } from "@/api/orderApi";
import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import {
  AccessoryItem,
  CabinetItem,
  DoorItem,
  FinishItem,
  HardwareItem,
} from "@/types/newItemTypes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import useUserStore from "@/store/userStore";

import RecipientPhoneNumber from "../checkorder/_components/RecipientPhoneNumber";
import PickUpAddressCard from "./_components/PickUpAddressCard";
import PickUpVehicleSelector from "./_components/PickUpVehicleSelector";

type AnyCartItem = DoorItem | CabinetItem | AccessoryItem | FinishItem | HardwareItem;

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

export default function PickUpClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { cartItems: globalCartItems } = useCartStore();
  const [groupedCartItems, setGroupedCartItems] = useState<Record<string, AnyCartItem[]>>({});
  const { cartId } = useCartStore.getState();
  const { currentItem } = useCurrentOrderStore();
  const { user_phoneNumber } = useUserStore();
  const { recipientPhoneNumber, setRecipientPhoneNumber } = useOrderStore();

  const { id: userId } = useUserStore.getState();

  useEffect(() => {
    if (!recipientPhoneNumber && user_phoneNumber) {
      setRecipientPhoneNumber(user_phoneNumber);
    }
  }, [recipientPhoneNumber, user_phoneNumber]);
  useEffect(() => {
    if (searchParams.get("current") === "now") {
      setCartItems([currentItem]);
    } else {
      setCartItems(globalCartItems);
    }
  }, [searchParams, globalCartItems]);

  useEffect(() => {
    const grouped: Record<string, AnyCartItem[]> = {};
    cartItems.forEach(item => {
      if (!item || !item.category) return;
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    setGroupedCartItems(grouped);
  }, [cartItems]);

  //   const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.count || 1), 0);

  //   const {
  //     recipientPhoneNumber,
  //     address,
  //     deliveryDate,
  //     requestMessage,
  //     foyerAccessType,
  //     customerRequest,
  //     pickupInfo,
  //   } = useOrderStore.getState();

  //   const orderData = {
  //     recipientPhoneNumber,
  //     address1: address.address1,
  //     address2: address.address2,
  //     deliveryDate,
  //     deliveryRequest: requestMessage,
  //     foyerAccessType,
  //     otherRequests: customerRequest,
  //     pickupInfo,
  //     receiveMethod: "pickup",
  //     cartItems,
  //     totalPrice,
  //   };
  //   console.log("💾 저장할 pickup 주문:", orderData);
  //   localStorage.setItem("recentOrder", JSON.stringify(orderData));
  //   router.push("/cart/confirm");
  // };

  const handleSubmit = async () => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.count || 1), 0);

    const {
      recipientPhoneNumber,
      address,
      requestMessage,
      foyerAccessType,
      customerRequest,
      pickupInfo,
    } = useOrderStore.getState();

    if (!userId || !cartId) {
      alert("주문에 필요한 정보가 부족합니다.");
      return;
    }

    const payload = {
      user_id: userId,
      cart_id: cartId,
      order_type: "PICK_UP" as const,
      recipient_phone: recipientPhoneNumber.replace(/[^0-9]/g, ""),
      order_price: totalPrice,
      order_options: {
        pickup: {
          pickup_address1: address.address1,
          pickup_address2: address.address2,
          pickup_vehicle_type: pickupInfo.vehicleType,
          pickup_custom_note: pickupInfo.customVehicleNote,
        },
        foyer_access_type: foyerAccessType,
        other_requests: customerRequest,
      },
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

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.count ?? 1), 0);

  const sanitizedCartGroups = Object.fromEntries(
    Object.entries(groupedCartItems).map(([key, items]) => [key, items.filter(Boolean)]),
  );

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
          <PriceSummaryCard
            getTotalPrice={getTotalPrice}
            categoryMap={CATEGORY_MAP}
            page={CHECK_ORDER_PAGE}
          />
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
