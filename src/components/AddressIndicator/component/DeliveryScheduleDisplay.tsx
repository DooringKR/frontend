import React from "react";

import { Badge } from "@/components/ui/badge";

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
          <Badge color="blue" className="gap-1">
            <CarIcon />
            오늘배송 가능
          </Badge>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">∙</div>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">
            {timeLimit}
          </div>
        </div>
      );
    case "tomorrow":
      return (
        <div className="flex flex-row items-center gap-2">
          <Badge color="blue">내일({getTomorrowDayOfWeek()}) 도착 보장</Badge>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">∙</div>
          <div className="h-[22px] text-[16px] font-500 text-[#3B82F6]">
            {timeLimit}
          </div>
        </div>
      );
    case "other":
      return (
        <div className="flex flex-row flex-wrap gap-2">
          <Badge color="gray">{arrivalDate} 도착 보장</Badge>
          <div className="flex flex-row items-center gap-2">
            <div className="h-[22px] text-[16px] font-500 text-gray-400">∙</div>
            <div className="h-[22px] text-[16px] font-500 text-gray-400">
              {timeLimit}
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
