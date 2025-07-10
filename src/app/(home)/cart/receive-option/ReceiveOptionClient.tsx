"use client";

import { useRouter } from "next/navigation";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";

import ReceiveOptionCard from "./_components/ReceiveOptionCard";

export default function ReceiveOptionClientPage() {
  const router = useRouter();
  const setReceiveMethod = useOrderStore(state => state.setReceiveMethod);

  const handleSelect = (method: "delivery" | "pickup") => {
    setReceiveMethod(method);
    if (method === "delivery") {
      router.push("/cart/checkorder");
    } else {
      router.push("/cart/pickup");
    }
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
            onClick={() => handleSelect("delivery")}
          />
          <ReceiveOptionCard
            icon={"/icons/parcel.svg"}
            alt={"소포 아이콘"}
            title={"직접 픽업"}
            description={"공장에서 포장한 상품을 직접 픽업하세요."}
            onClick={() => handleSelect("pickup")}
          />
        </div>
        <span className="rounded-[10px] bg-gray-100 px-3 py-[9px] font-500">
          픽업주소 (도어링 공장)
        </span>
      </div>
    </div>
  );
}
