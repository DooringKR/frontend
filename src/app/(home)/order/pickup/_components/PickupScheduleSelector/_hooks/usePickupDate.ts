import { useOrderStore } from "@/store/orderStore";

export function usePickupDate() {
    const order = useOrderStore(state => state.order);

    // pickup_time을 Date 객체로 변환하는 헬퍼 함수
    const getPickupDate = () => {
        if (!order?.pickup_time) return null;
        if (order?.pickup_time instanceof Date) return order?.pickup_time;
        return new Date(order?.pickup_time);
    };

    // 날짜 포맷팅 함수 - Date 객체를 직접 받아서 처리
    const formatSelectedDate = (date: Date) => {
        if (!date || isNaN(date.getTime())) {
            return "날짜를 선택해주세요";
        }

        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
        const weekDay = weekDays[date.getDay()];

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // 날짜 비교를 위해 시간을 0으로 설정
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);

        if (compareDate.getTime() === today.getTime()) {
            return `오늘 (${month}/${day} ${weekDay})`;
        } else if (compareDate.getTime() === tomorrow.getTime()) {
            return `내일 (${month}/${day} ${weekDay})`;
        } else {
            return `${month}/${day} (${weekDay})`;
        }
    };

    return {
        pickupDate: getPickupDate(),
        formatSelectedDate,
    };
}

