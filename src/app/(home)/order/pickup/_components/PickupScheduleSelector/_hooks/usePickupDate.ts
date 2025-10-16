import { useOrderStore } from "@/store/orderStore";

export function usePickupDate() {
    const order = useOrderStore(state => state.order);

    // pickup_time을 Date 객체로 변환하는 헬퍼 함수
    const getPickupDate = () => {
        if (!order?.pickup_time) return null;
        if (order?.pickup_time instanceof Date) return order?.pickup_time;
        return new Date(order?.pickup_time);
    };

    // 날짜 포맷팅 함수
    const formatSelectedDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
        const weekDay = weekDays[date.getDay()];

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (dateString === today.toISOString().split("T")[0]) {
            return `오늘 (${month}/${day} ${weekDay})`;
        } else if (dateString === tomorrow.toISOString().split("T")[0]) {
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

