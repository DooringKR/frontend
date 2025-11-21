"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";
import OrderProcessCard from "@/components/OrderProcessCard";

export default function PickUpVehicleSelector() {
  const router = useRouter();
  const order = useOrderStore.getState().order;

  const getDescriptionLine1 = () => {
    return order?.vehicle_type || "선택해주세요";
  };

  const getDescriptionLine2 = () => {
    return order?.vehicle_type_direct_input || undefined;
  };

  const getState = () => {
    return order?.vehicle_type ? 'enabled' : 'errored';
  };

  return (
    <>
      {/* 기존 구현 */}
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

    {/* OrderProcessCard 구현 */}
    <OrderProcessCard
      title="픽업차량 종류"
      descriptionLine1={getDescriptionLine1()}
      descriptionLine2={getDescriptionLine2()}
      trailing="primary"
      trailingText="차량선택"
      showLeadingIcon={false}
      showSamedaydeliverySticker={false}
      showDescriptionLine2={!!getDescriptionLine2()}
      showTrailing={true}
      showBottom={false}
      state={getState()}
      onClick={() => router.push("/order/pickup/vehicle")}
      className="mt-3"
    />
    </>
  );
}
