import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

function getDefaultGeneralDeliveryTime() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
}

export function useDeliverySchedule() {
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);

    const [expectedArrivalMinutes, setExpectedArrivalMinutes] = useState<number | null>(null);
    const [isTodayDeliveryAvailable, setIsTodayDeliveryAvailable] = useState(false);

    // 오늘배송 가능 여부 계산
    useEffect(() => {
        const fetchDeliveryInfo = async () => {
            const { remainingMinutes } = await calculateDeliveryInfo(order.road_address!);

            setExpectedArrivalMinutes(remainingMinutes);
            if (remainingMinutes === null) return;

            const now = new Date();
            const arrivalDate = new Date(now);
            arrivalDate.setMinutes(now.getMinutes() + remainingMinutes);

            const todayDeadline = new Date();
            todayDeadline.setHours(18, 0, 0, 0); // 오늘 18:00:00

            const isTodayAvailable = arrivalDate.getTime() < todayDeadline.getTime() && !order?.order_construct;
            console.log("🚚 예상 도착시간:", arrivalDate.toLocaleTimeString());
            console.log("🚫 오늘배송 가능 여부:", isTodayAvailable);
            setIsTodayDeliveryAvailable(isTodayAvailable);

            // 오늘 배송 불가능하면 자동으로 다른 날 배송으로 전환
            if (!isTodayAvailable && order?.is_today_delivery === true) {
                updateOrder({
                    is_today_delivery: false,
                    is_date_free: true,
                    delivery_arrival_time: getDefaultGeneralDeliveryTime(),
                } as any);
            }
        };
        fetchDeliveryInfo();
    }, [expectedArrivalMinutes, order?.is_today_delivery, order?.order_construct, updateOrder]);

    return {
        expectedArrivalMinutes,
        isTodayDeliveryAvailable,
    };
} 