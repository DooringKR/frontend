import React from "react";

import CarIcon from "../icon/Car";

// 내일의 요일을 계산하는 함수
const getTomorrowDayOfWeek = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[tomorrow.getDay()];
};

interface DeliveryScheduleDisplayProps {
  schedule: "today" | "tomorrow" | "other" | "";
  timeLimit?: string;
  arrivalDate?: string; // 도착 보장일 (예: "12월 25일")
}

// 배송일정 표시 컴포넌트
const DeliveryScheduleDisplay: React.FC<DeliveryScheduleDisplayProps> = ({
  schedule,
  timeLimit,
  arrivalDate,
}) => {
  switch (schedule) {
    case "today":
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center justify-center gap-1 rounded-[8px] bg-brand-50 px-2 py-[3px]">
            <CarIcon />
            <div className="h-[22px] text-[15px] font-500 text-brand-600">오늘배송 가능</div>
          </div>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">∙</div>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">
            {timeLimit === "배송 정보 계산 중..." ? "배송 가능 여부를 확인 중입니다..." : timeLimit}
          </div>
        </div>
      );
    case "tomorrow":
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="h-[28px] rounded-[8px] bg-brand-50 px-2 py-[3px] text-[15px] font-500 text-brand-600">
            내일({getTomorrowDayOfWeek()}) 도착 보장
          </div>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">∙</div>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">
            {timeLimit === "배송 정보 계산 중..." ? "배송 가능 여부를 확인 중입니다..." : timeLimit}
          </div>
        </div>
      );
    case "other":
      return (
        <div className="sm:flex-col flex flex-row flex-wrap gap-2">
          <div className="rounded-[8px] bg-gray-50 px-2 py-1 text-[15px]/[22px] font-500 text-gray-500">
            {arrivalDate} 도착 보장
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="h-[22px] text-[16px] font-500 text-gray-400">∙</div>
            <div className="h-[22px] text-[16px] font-500 text-gray-400">
              {timeLimit === "배송 정보 계산 중..."
                ? "배송 가능 여부를 확인 중입니다..."
                : timeLimit}
            </div>
          </div>
        </div>
      );
    case "":
      return (
        <div className="h-[28px] py-[3px] text-[16px] font-500 text-gray-400">
          오늘배송 되는지 알 수 있어요
        </div>
      );
    default:
      return null;
  }
};

export default DeliveryScheduleDisplay;
