import React from "react";

import GradientEffectText from "../GradientEffectText/GradientEffectText";
import AddressIcon from "./icon/AddressIcon";
import DeliveryScheduleDisplay from "./component/DeliveryScheduleDisplay";

// discriminated union 타입으로 timeLimit이 필수인 경우와 선택인 경우를 구분
// arrivalDate는 도착 보장일이며, 'other'인 경우에만 사용합니다. api 호출 시 string 변환 후 전달해야 합니다.
type AddressIndicatorProps =
  | {
    address: string;
    deliverySchedule: "today" | "tomorrow";
    timeLimit: string; // today, tomorrow인 경우 필수
    arrivalDate?: string; // 도착 보장일
  }
  | {
    address: string;
    deliverySchedule: "other";
    timeLimit?: string; // other, 빈 문자열인 경우 선택
    arrivalDate?: string; // 도착 보장일
  }
  | {
    //주소 입력 안 한 경우
    address?: string;
    deliverySchedule: "";
    timeLimit?: string; // other, 빈 문자열인 경우 선택
    arrivalDate?: string; // 도착 보장일
  }
  ;

const AddressIndicator: React.FC<AddressIndicatorProps> = (props) => {
  const { address, deliverySchedule, timeLimit, arrivalDate } = props;

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
      <DeliveryScheduleDisplay
        schedule={deliverySchedule}
        timeLimit={timeLimit}
        arrivalDate={arrivalDate}
      />
    </div>
  );
};

export default AddressIndicator;
