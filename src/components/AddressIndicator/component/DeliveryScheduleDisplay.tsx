import React from "react";
import CarIcon from "../icon/Car";

// 내일의 요일을 계산하는 함수
const getTomorrowDayOfWeek = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
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
    arrivalDate
}) => {
    switch (schedule) {
        case "today":
            return (
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-row items-center justify-center py-[3px] px-2 gap-1 bg-brand-50 rounded-[8px]">
                        <CarIcon />
                        <div className="text-brand-600 text-[15px] font-500 h-[22px]">오늘배송 가능</div>
                    </div>
                    <div className="text-[#3B82F6] text-[16px] font-500 h-[22px]">
                        ∙
                    </div>
                    <div className="text-[#3B82F6] text-[16px] font-500 h-[22px]">
                        {timeLimit}
                    </div>
                </div>
            );
        case "tomorrow":
            return (
                <div className="flex flex-row gap-2 items-center">
                    <div className="py-[3px] px-2 text-brand-600 text-[15px] font-500 h-[28px] bg-brand-50 rounded-[8px]">
                        내일({getTomorrowDayOfWeek()}) 도착 보장
                    </div>
                    <div className="text-[#3B82F6] text-[16px] font-500 h-[22px]">
                        ∙
                    </div>
                    <div className="text-[#3B82F6] text-[16px] font-500 h-[22px]">
                        {timeLimit}
                    </div>
                </div>
            );
        case "other":
            return (
                <div className="flex flex-col gap-2">
                    <div className="text-gray-500 px-2 py-1 text-[15px] font-500">
                        {arrivalDate} 도착 보장
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="text-gray-400 h-[22px] font-500 text-[16px]">∙</div>
                        <div className="text-gray-400 h-[22px] font-500 text-[16px]">
                            {timeLimit}
                        </div>
                    </div>

                </div>
            );
        case "":
            return (
                <div className="py-[3px] text-gray-400 h-[28px] font-500 text-[16px]">오늘배송 되는지 알 수 있어요</div>
            );
        default:
            return null;
    }
};

export default DeliveryScheduleDisplay; 