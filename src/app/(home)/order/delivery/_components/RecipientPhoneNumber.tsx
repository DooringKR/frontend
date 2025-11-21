"use client";

import { useRouter } from "next/navigation";

import useBizClient from "@/store/bizClientStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useOrderStore } from "@/store/orderStore";
import OrderProcessCard from "@/components/OrderProcessCard";

export default function RecipientPhoneNumber() {
  const router = useRouter();
  //보여주는 순서 => 주문 정보에 있는 번호 -> 비즈클라이언트에 있는 번호 -> 빈 번호
  const recipientPhoneNumber = useOrderStore.getState().order?.recipient_phone || useBizClient.getState().getPhoneNumber() || "";
  const handleClick = () => {
    router.push("/order/delivery/phone");
  };

  return (
    <>
      {/* 기존 구현 */}
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

      {/* OrderProcessCard 구현 */}
      <OrderProcessCard
        title="받는 분 휴대폰 번호"
        descriptionLine1={formatPhoneNumber(recipientPhoneNumber) || "휴대폰 번호를 입력해주세요"}
        trailing="secondary"
        showLeadingIcon={false}
        showSamedaydeliverySticker={false}
        showDescriptionLine2={false}
        showTrailing={true}
        showBottom={false}
        state="enabled"
        onClick={handleClick}
        className="mt-3"
      />
    </>
  );
}
