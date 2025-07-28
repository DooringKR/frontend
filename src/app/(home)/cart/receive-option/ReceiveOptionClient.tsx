"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Modal from "@/components/Modal/Modal";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";

import ReceiveOptionCard from "./_components/ReceiveOptionCard";

export default function ReceiveOptionClientPage() {
  const router = useRouter();
  const setReceiveMethod = useOrderStore(state => state.setReceiveMethod);

  const [isPickupAddressModalOpen, setIsPickupAddressModalOpen] = useState(false);

  const handleSelect = (method: "DELIVERY" | "PICK_UP") => {
    setReceiveMethod(method);
    if (method === "DELIVERY") {
      router.push("/cart/checkorder");
    } else {
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
        <div className="flex flex-col gap-3 py-5">
          <ReceiveOptionCard
            icon={"/icons/truck.svg"}
            alt={"트럭 아이콘"}
            title={"배송"}
            description={"입력한 주소로 배송해드려요."}
            onClick={() => handleSelect("DELIVERY")}
          />
          <ReceiveOptionCard
            icon={"/icons/parcel.svg"}
            alt={"소포 아이콘"}
            title={"직접 픽업"}
            description={"공장에서 포장한 상품을 직접 픽업하세요."}
            onClick={() => handleSelect("PICK_UP")}
          />
        </div>
        <button
          className="rounded-[10px] bg-gray-100 px-3 py-[9px] font-500"
          onClick={() => setIsPickupAddressModalOpen(true)}
        >
          픽업주소 (도어링 공장)
        </button>
        {isPickupAddressModalOpen && (
          <Modal
            isOpen={isPickupAddressModalOpen}
            onClose={() => setIsPickupAddressModalOpen(false)}
          >
            <div className="mt-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-700 text-gray-900">픽업주소 (도어링 공장)</h1>
                <h2 className="text-sm font-400 text-gray-400">
                  경기도 남양주시 오남읍 양지로139번길 11-14
                </h2>
              </div>
            </div>
            <BottomButton
              type={"2buttons"}
              button1Text="닫기"
              button2Text="주소 복사"
              button1Type="GrayLarge"
              className="p-0 pt-5"
              onButton1Click={() => setIsPickupAddressModalOpen(false)}
              onButton2Click={handleCopyAddress}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
