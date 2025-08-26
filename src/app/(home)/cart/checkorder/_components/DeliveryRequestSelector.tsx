"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";

export default function DeliveryRequestSelector() {
  const router = useRouter();
  const requestMessage = useOrderStore(state => state.requestMessage);
  const foyerAccessType = useOrderStore(state => state.foyerAccessType);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-2">
          <p className="text-[17px] font-600">배송 시 요청사항</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.push("/cart/checkorder/delivery-request")}
              className="text-left text-[15px] font-500 text-gray-800"
            >
              {requestMessage || "선택해주세요"}
            </button>
            {foyerAccessType.type === "gate" && foyerAccessType.gatePassword?.trim() && (
              <span className="text-[15px] text-gray-800">{foyerAccessType.gatePassword}</span>
            )}
            {foyerAccessType.type === "custom" && foyerAccessType.customRequest?.trim() && (
              <span className="text-[15px] text-gray-800">{foyerAccessType.customRequest}</span>
            )}
          </div>
        </div>
        <button
          className="flex gap-1"
          onClick={() => router.push("/cart/checkorder/delivery-request")}
        >
          <span className="text-[15px] font-500 text-blue-500">요청 선택</span>
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>
    </>
  );
}
