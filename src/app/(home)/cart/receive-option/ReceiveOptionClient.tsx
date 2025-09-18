"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";

import ReceiveOptionCard from "./_components/ReceiveOptionCard";

import { usePageView } from "@/services/hooks/usePageView";
import { useButtonClick } from "@/services/hooks/useButtonClick";

export default function ReceiveOptionClientPage() {

  usePageView("receive_option");
  const router = useRouter();
  const setReceiveMethod = useOrderStore(state => state.setReceiveMethod);

  const [isPickupAddressModalOpen, setIsPickupAddressModalOpen] = useState(false);

  const handleDeliveryClick = useButtonClick("go_to_delivery", "receive_option");
  const handlePickUpClick = useButtonClick("go_to_pickup", "receive_option");

  const handleSelect = (method: "DELIVERY" | "PICK_UP") => {
    setReceiveMethod(method);
    if (method === "DELIVERY") {
      handleDeliveryClick();
      router.push("/cart/checkorder");
    } else {
      handlePickUpClick();
      router.push("/cart/pickup");
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("경기도 남양주시 오남읍 양지로139번길 11-14");
    alert("주소가 복사되었습니다!");
    setIsPickupAddressModalOpen(false);
  };

  return (
    <div>
      <TopNavigator />
      <div className="p-5">
        <h1 className="text-[23px] font-700">
          상품 받는 방법을
          <br />
          선택해주세요
        </h1>
        <div className="flex w-full flex-col gap-3 py-5">
          <div id="receive-option-delivery-card" className="w-full">
            <ReceiveOptionCard
              icon={"/icons/truck.svg"}
              alt={"트럭 아이콘"}
              title={"배송"}
              description={"입력한 주소로 배송해드려요."}
              onClick={() => handleSelect("DELIVERY")}
            />
          </div>
          <div id="receive-option-pickup-card" className="w-full">
            <ReceiveOptionCard
              icon={"/icons/parcel.svg"}
              alt={"소포 아이콘"}
              title={"직접 픽업"}
              description={"공장에서 포장한 상품을 직접 픽업하세요."}
              onClick={() => handleSelect("PICK_UP")}
            />
          </div>

        </div>
        <button
          className="rounded-[10px] bg-gray-100 px-3 py-[9px] font-500"
          onClick={() => setIsPickupAddressModalOpen(true)}
        >
          픽업주소 (도어링 공장)
        </button>
        {isPickupAddressModalOpen && (
          <BottomSheet
            isOpen={isPickupAddressModalOpen}
            title="픽업주소 (도어링 공장)"
            onClose={() => setIsPickupAddressModalOpen(false)}
            children={
              <div>
                <h2 className="text-sm font-400 text-gray-400">
                  경기도 남양주시 오남읍 양지로139번길 11-14
                </h2>

                <BottomButton
                  type={"2buttons"}
                  button1Text="닫기"
                  button2Text="주소 복사"
                  button1Type="GrayLarge"
                  className="px-0"
                  onButton1Click={() => setIsPickupAddressModalOpen(false)}
                  onButton2Click={handleCopyAddress}
                />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
