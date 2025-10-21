"use client";

import { useRouter } from "next/navigation";
import React from "react";

import GradientEffectText from "../GradientEffectText/GradientEffectText";
import DeliveryScheduleDisplay from "./component/DeliveryScheduleDisplay";
import AddressIcon from "./icon/AddressIcon";
import { trackClick } from "@/services/analytics/amplitude";
import { getScreenName } from "@/utils/screenName";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";

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
      <InitAmplitude />
      <div
        className="flex w-fit cursor-pointer flex-row gap-[6px]"
        onClick={() => {
          trackClick({
            object_type: "button",
            object_name: "address",
            current_page: getScreenName(),
            modal_name: null,
          });
          router.push("/address-check");
        }}
      >
        <div className="text-[20px] font-600 text-gray-700">
          {address ? address : <GradientEffectText text="주소를 입력해주세요" />}
        </div>
        <div className="flex items-center justify-center">
          <AddressIcon isAddressEntered={!!address} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-[28px] items-center gap-2 py-[3px]">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
          </div>
          <span className="animate-pulse text-[16px] font-500 text-gray-500">
            배송 정보 계산 중...
          </span>
        </div>
      ) : (
        <DeliveryScheduleDisplay
          schedule={deliverySchedule}
          timeLimit={timeLimit}
          arrivalDate={arrivalDate}
        />
      )}
    </div>
  );
};

export default AddressIndicator;
