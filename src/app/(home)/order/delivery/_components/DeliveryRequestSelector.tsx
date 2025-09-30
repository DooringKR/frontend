"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";
import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

export default function DeliveryRequestSelector() {
  const router = useRouter();
  const delivery_method = useOrderStore(state => state.order?.delivery_method);
  const delivery_method_direct_input = useOrderStore(state => state.order?.delivery_method_direct_input);
  const gate_password = useOrderStore(state => state.order?.gate_password);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-2">
          <p className="text-[17px] font-600">배송 시 요청사항</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.push("/order/delivery/receive-request")}
              className="text-left text-[15px] font-500 text-gray-800"
            >
              {delivery_method || "선택해주세요"}
            </button>
            {delivery_method === DeliveryMethod.OPEN_GATE && gate_password?.trim() && (
              <span className="text-[15px] text-gray-800">{gate_password}</span>
            )}
            {delivery_method === DeliveryMethod.DIRECT_INPUT && delivery_method_direct_input?.trim() && (
              <span className="text-[15px] text-gray-800">{delivery_method_direct_input}</span>
            )}
          </div>
        </div>
        <button
          className="flex gap-1"
          onClick={() => router.push("/order/delivery/receive-request")}
        >
          <span className="text-[15px] font-500 text-blue-500">요청 선택</span>
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>
    </>
  );
}
