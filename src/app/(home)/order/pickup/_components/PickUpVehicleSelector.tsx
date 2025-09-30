"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";

export default function PickUpVehicleSelector() {
  const router = useRouter();
  const order = useOrderStore.getState().order;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex flex-col gap-1">
        <p className="text-[17px] font-600">픽업차량 종류</p>
        <p className="text-[15px] font-500 text-gray-800">
          {order?.vehicle_type || "선택해주세요"}
        </p>
        {order?.vehicle_type_direct_input && (
          <p className="text-[15px] font-400">{order.vehicle_type_direct_input}</p>
        )}
      </div>
      <button className="flex gap-1" onClick={() => router.push("/order/pickup/vehicle")}>
        <span className="text-[15px] font-500 text-blue-500">차량선택</span>
        <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
      </button>
    </div>
  );
}
