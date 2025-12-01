import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState, useCallback } from "react";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";

export function useDeliveryInfo(bizClient: BizClient | null) {
    const [deliverySchedule, setDeliverySchedule] = useState<"today" | "tomorrow" | "other" | "">("");
    const [timeLimit, setTimeLimit] = useState<string | undefined>(undefined);
    const [arrivalDate, setArrivalDate] = useState<string | undefined>(undefined);
    const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

    const checkDelivery = useCallback(async () => {
        if (bizClient && bizClient.road_address) {
            setIsCheckingDelivery(true);
            try {
                const info = await calculateDeliveryInfo(bizClient.road_address);
                console.log('info', info);

                if (info.isToday) {
                    const cutoffMinutes = 18 * 60;
                    const remainingMinutes = cutoffMinutes - info.expectedArrivalMinutes;
                    const hours = Math.floor(remainingMinutes / 60);
                    const minutes = remainingMinutes % 60;
                    const timeLimitMessage =
                        remainingMinutes <= 0
                            ? "주문 마감"
                            : `${hours > 0 ? `${hours}시간 ` : ""}${minutes}분 내 주문 시`;
                    setDeliverySchedule("today");
                    setTimeLimit(timeLimitMessage);
                    setArrivalDate(undefined);
                } else {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);

                    const isTomorrow = info.expectedArrivalMinutes <= (24 + 24) * 60; // 내일 이내 도착이면 tomorrow로 취급

                    if (isTomorrow) {
                        setDeliverySchedule("tomorrow");
                        setTimeLimit("밤 12시 전 주문 시");
                        setArrivalDate(undefined);
                    } else {
                        setDeliverySchedule("other");

                        const futureDate = new Date();
                        futureDate.setMinutes(futureDate.getMinutes() + info.remainingMinutes);
                        const formatted = format(futureDate, "M/dd(E)", { locale: ko }); // 예: 7/18(목)

                        setArrivalDate(formatted);
                        setTimeLimit(`${formatted} 밤 12시 전 주문 시`);
                    }
                }
            } catch (err) {
                console.error("배송 정보 계산 실패", err);
                setDeliverySchedule("other");
                setTimeLimit(undefined);
                setArrivalDate(undefined);
            } finally {
                setIsCheckingDelivery(false);
            }
        } else {
            setDeliverySchedule("");
            setTimeLimit(undefined);
            setArrivalDate(undefined);
        }
    }, [bizClient]);

    return {
        deliverySchedule,
        timeLimit,
        arrivalDate,
        isCheckingDelivery,
        checkDelivery,
    };
}

