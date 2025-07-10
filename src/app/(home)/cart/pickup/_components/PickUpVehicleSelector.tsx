"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";

export default function PickUpVehicleSelector() {
  const router = useRouter();

  const pickupInfo = useOrderStore(state => state.pickupInfo);

  const selectedVehicle =
    pickupInfo.vehicleType === "custom"
      ? pickupInfo.customVehicleNote || "직접 입력"
      : pickupInfo.vehicleType || "선택해주세요";

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex flex-col gap-1">
        <p className="text-[17px] font-600">픽업차량 종류</p>
        {/* <div className="text-[15px] font-500 text-gray-800">{selectedVehicle}</div> */}
        <p className="text-[15px] font-500 text-gray-800">
          {pickupInfo.vehicleType || "선택해주세요"}
        </p>
        {pickupInfo.vehicleType === "직접 입력" && pickupInfo.customVehicleNote && (
          <p className="text-[15px] font-400">{pickupInfo.customVehicleNote}</p>
        )}
      </div>
      <button className="flex gap-1" onClick={() => router.push("/cart/pickup/vehicle")}>
        <span className="text-[15px] font-500 text-blue-500">차량선택</span>
        <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
      </button>
    </div>
  );
}
