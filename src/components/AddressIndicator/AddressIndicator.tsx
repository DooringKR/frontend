"use client";

import { useRouter } from "next/navigation";
import React from "react";

import GradientEffectText from "../GradientEffectText/GradientEffectText";
import DeliveryScheduleDisplay from "./component/DeliveryScheduleDisplay";
import AddressIcon from "./icon/AddressIcon";

// discriminated union 타입으로 timeLimit이 필수인 경우와 선택인 경우를 구분
// arrivalDate는 도착 보장일이며, 'other'인 경우에만 사용합니다. api 호출 시 string 변환 후 전달해야 합니다.
export type AddressIndicatorProps = {
  address?: string;
  deliverySchedule: "today" | "tomorrow" | "other" | "";
  timeLimit?: string;
  arrivalDate?: string;
  isLoading?: boolean;
};

const AddressIndicator: React.FC<AddressIndicatorProps> = props => {
  const router = useRouter();
  const { address, deliverySchedule, timeLimit, arrivalDate, isLoading } = props;

  return (
    <div className="flex w-fit flex-col gap-2 px-5">
      <div
        className="flex w-fit cursor-pointer flex-row gap-[6px]"
        onClick={() => {
          router.push("/address-check");
        }}
      >
        <div className="text-[20px] font-600 text-gray-700">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
              <span className="text-gray-500">주소 확인 중...</span>
            </div>
          ) : address ? (
            address
          ) : (
            <GradientEffectText text="주소를 입력해주세요" />
          )}
        </div>
        <div className="flex items-center justify-center">
          <AddressIcon isAddressEntered={!!address} />
        </div>
      </div>
      <DeliveryScheduleDisplay
        schedule={deliverySchedule}
        timeLimit={timeLimit}
        arrivalDate={arrivalDate}
      />
    </div>
  );
};

export default AddressIndicator;
