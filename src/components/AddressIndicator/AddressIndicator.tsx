import React from "react";

import GradientEffectText from "../GradientEffectText/GradientEffectText";
import AddressIcon from "./icon/AddressIcon";

type DeliverySchedule = "today" | "tomorrow" | "other" | "";

interface AddressIndicatorProps {
  address?: string;
  deliverySchedule: DeliverySchedule;
  //도착보장일 추가 필요, 날짜로 받으면 getDeliveryScheduleText에서 조정
  timeLimit?: string; // 예: "1시간 내", "오후 3시까지"
}

// 배송일정 표시 컴포넌트
const DeliveryScheduleDisplay: React.FC<{ schedule: DeliverySchedule }> = ({ schedule }) => {
  switch (schedule) {
    case "today":
      return (
        <div className="flex flex-row gap-2">
          <div className="rounded bg-red-500 px-2 py-1 text-sm font-medium text-white">
            오늘배송 가능
          </div>
        </div>
      );
    case "tomorrow":
      return (
        <div className="flex flex-row gap-2">
          <div className="rounded bg-orange-500 px-2 py-1 text-sm font-medium text-white">
            내일(수) 도착 보장
          </div>
        </div>
      );
    case "other":
      return (
        <div className="flex flex-row gap-2">
          <div className="rounded bg-gray-500 px-2 py-1 text-sm font-medium text-white">
            12월 25일 도착 보장
          </div>
        </div>
      );
    default:
      return null;
  }
};

const AddressIndicator: React.FC<AddressIndicatorProps> = ({
  address,
  deliverySchedule,
  timeLimit,
}) => {
  return (
    <div className="flex flex-col gap-2 px-5">
      <div className="flex flex-row gap-[6px]">
        <div className="text-[20px] font-600 text-gray-700">
          {address ? address : <GradientEffectText text="주소를 입력해주세요" />}
        </div>
        <div className="flex items-center justify-center">
          <AddressIcon isAddressEntered={!!address} />
        </div>
      </div>
      <DeliveryScheduleDisplay schedule={deliverySchedule} />
      {timeLimit && <div className="text-sm font-medium text-red-600">{timeLimit} 주문</div>}
    </div>
  );
};

export default AddressIndicator;
