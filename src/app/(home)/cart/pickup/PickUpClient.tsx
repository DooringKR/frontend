"use client";

import { createOrder, createOrderItem, completeOrder } from "@/api/orderApi";
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

import { usePageView } from "@/services/hooks/usePageView";
import { useButtonClick } from "@/services/hooks/useButtonClick";

type AnyCartItem = DoorItem | CabinetItem | AccessoryItem | FinishItem | HardwareItem;

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

export default function PickUpClientPage() {

  usePageView("check_pickup");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems: globalCartItems } = useCartStore();
  const [groupedCartItems, setGroupedCartItems] = useState<Record<string, AnyCartItem[]>>({});
  const { cartId } = useCartStore.getState();
  const { currentItem } = useCurrentOrderStore();
  const { user_phoneNumber } = useUserStore();
  const { recipientPhoneNumber, setRecipientPhoneNumber } = useOrderStore();
  const { pickupInfo } = useOrderStore.getState();

  const { id: userId } = useUserStore.getState();

  useEffect(() => {
    useOrderStore.getState().setReceiveMethod("PICK_UP");
  }, []);

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

  const buttonClick = useButtonClick("go_to_confirm", "check_pickup");
  const handleSubmit = async () => {
    buttonClick();
    setIsLoading(true);
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
      setIsLoading(false);
      return;
    }
    if (!pickupInfo.vehicleType) {
      alert("픽업 차량 종류를 선택해주세요.");
      setIsLoading(false);
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
      const orderId = order.order_id;

      /*
      await Promise.all(
        cartItems.map(item => {
          const itemPayload = {
            order_id: orderId,
            product_type: item.category?.toUpperCase(),
            unit_price: item.price,
            item_count: item.count ?? 1,
            item_options: item,
          };
          console.log("🧾 픽업용 order_item payload:", itemPayload);
          return createOrderItem(itemPayload);
        }),
      );
      
      await completeOrder(orderId);
      */

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

  const isVehicleNotSelected = !pickupInfo.vehicleType || pickupInfo.vehicleType === "선택해주세요";
  const isDisabled = isVehicleNotSelected || isLoading;
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
      <div className="h-[100px]"></div>
      <div id="pickup-order-button">
        <BottomButton
          type={"1button"}
          button1Text={isLoading ? "주문 요청 중..." : "주문 접수하기"}
          className={`fixed bottom-0 w-full max-w-[460px] ${isDisabled ? "pointer-events-none opacity-50" : ""}`}
          onButton1Click={handleSubmit}
        />
      </div>
    </div>
  );
}
