"use client";

import { usePickupDate } from "./_hooks/usePickupDate";
import PickupDateTimeSelector from "./_components/PickupDateTimeSelector";
import { useOrderStore } from "@/store/orderStore";
import { useEffect } from "react";

export default function PickupScheduleSelector() {
    const { formatSelectedDate } = usePickupDate();
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);

    // 초기 픽업 날짜 설정 (내일로)
    useEffect(() => {
        if (!order?.pickup_time) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            updateOrder({ pickup_time: tomorrow });
        }
    }, []);

    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-xl font-600">픽업일정 선택</h2>

            <div className="flex cursor-pointer flex-col gap-1 rounded-xl border-2 border-gray-800 px-5 py-4">
                <div className="flex justify-between">
                    <span className="text-[17px] font-600">원하는 날짜 픽업</span>
                </div>
                <span className="text-[15px] font-500">
                    {order?.pickup_time
                        ? formatSelectedDate(order?.pickup_time.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }))
                        : "날짜를 선택해주세요"}
                    {" "}
                    원하는 시간 픽업
                </span>

                <PickupDateTimeSelector formatSelectedDate={formatSelectedDate} />
            </div>
        </section>
    );
}

