"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export default function RecipientPhoneNumber() {
  const router = useRouter();
  const recipientPhoneNumber = useOrderStore(state => state.recipientPhoneNumber);
  const handleClick = () => {
    router.push("/cart/checkorder/phone");
  };

  return (
    <div className="rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[17px] font-600">받는 분 휴대폰 번호</p>
          <p className="text-[15px] font-400">{formatPhoneNumber(recipientPhoneNumber)}</p>
        </div>
        <button onClick={handleClick}>
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>
    </div>
  );
}
