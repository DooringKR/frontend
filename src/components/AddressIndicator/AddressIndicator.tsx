"use client";

import Link from "next/link";
import React from "react";

import { Loading } from "@/components/state/StateViews";

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
  const { address, deliverySchedule, timeLimit, arrivalDate, isLoading } = props;

  return (
    <div className="flex w-fit flex-col gap-2 px-5">
      <InitAmplitude />
      <Link
        href="/address-check"
        className="flex w-fit flex-row gap-[6px]"
        onClick={() => {
          trackClick({
            object_type: "button",
            object_name: "address",
            current_page: getScreenName(),
            modal_name: null,
          });
        }}
      >
        <div className="text-[20px] font-600 text-gray-700">
          {address ? address : <GradientEffectText text="주소를 입력해주세요" />}
        </div>
        <div className="flex items-center justify-center">
          <AddressIcon isAddressEntered={!!address} />
        </div>
      </Link>
      {isLoading ? (
        <Loading variant="inline" label="배송 정보 계산 중" className="h-[28px]" />
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
