"use client";

import { usePickupDate } from "./_hooks/usePickupDate";
import PickupDateTimeSelector from "./_components/PickupDateTimeSelector";
import { useOrderStore } from "@/store/orderStore";
import { useEffect } from "react";
import OrderProcessCard from "@/components/OrderProcessCard";

export default function PickupScheduleSelector({ hasValidationFailed, isLoading }: { hasValidationFailed?: boolean; isLoading?: boolean }) {
    const { formatSelectedDate } = usePickupDate();
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);
    const pickupScheduleMode = (order as any)?.pickup_schedule_mode as "GENERAL" | "RESERVED" | undefined;

    const getConstructMinPickupTime = () => {
        const min = new Date();
        min.setHours(min.getHours() + 24);
        min.setSeconds(0, 0);
        return min;
    };

    const getGeneralPickupTime = () => {
        const base = new Date();
        if (order?.order_construct) {
            return getConstructMinPickupTime();
        }
        base.setMinutes(base.getMinutes() + 120);
        base.setSeconds(0, 0);
        return base;
    };

    // 초기 픽업 날짜 설정 (현재 시간으로)
    useEffect(() => {
        if (!order?.pickup_time) {
            updateOrder({ pickup_time: getGeneralPickupTime(), pickup_schedule_mode: "GENERAL", is_date_free: true } as any);
        }
    }, [order?.pickup_time]);

    const getGeneralState = () => {
        if (isLoading) return 'disabled';
        return pickupScheduleMode === "GENERAL" ? 'activated' : 'enabled';
    };

    const getReservedState = () => {
        if (isLoading) return 'disabled';
        if (pickupScheduleMode === "RESERVED") {
            if (!order?.pickup_time && hasValidationFailed) return 'errored';
            return 'activated';
        }
        return 'enabled';
    };

    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-xl font-600">픽업일정 선택</h2>
            <OrderProcessCard
                title="일반 픽업"
                descriptionLine1={order?.order_construct ? "시공 주문은 내일부터 순차 픽업 가능해요." : "가장 빠른 일정으로 픽업 준비해요."}
                trailing="primary"
                trailingText=""
                showLeadingIcon={false}
                showSamedaydeliverySticker={!order?.order_construct}
                showDescriptionLine2={false}
                showTrailing={false}
                showBottom={false}
                state={getGeneralState()}
                onClick={() => {
                    if (isLoading) return;
                    updateOrder({
                        pickup_schedule_mode: "GENERAL",
                        is_date_free: true,
                        pickup_time: getGeneralPickupTime(),
                    } as any);
                }}
                className="mt-3"
            />

            <OrderProcessCard
                title="예약 픽업"
                descriptionLine1={
                    pickupScheduleMode === "RESERVED" && order?.pickup_time
                        ? `${formatSelectedDate(order.pickup_time)} 예약 시간 픽업`
                        : "원하는 날짜와 시간으로 예약할 수 있어요"
                }
                trailing="primary"
                trailingText=""
                showLeadingIcon={false}
                showSamedaydeliverySticker={false}
                showDescriptionLine2={false}
                showTrailing={false}
                showBottom={pickupScheduleMode === "RESERVED"}
                state={getReservedState()}
                onClick={() => {
                    if (isLoading) return;
                    if (pickupScheduleMode !== "RESERVED") {
                        const defaultReserved = order?.order_construct
                            ? getConstructMinPickupTime()
                            : (() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                tomorrow.setHours(10, 0, 0, 0);
                                return tomorrow;
                            })();
                        updateOrder({ pickup_schedule_mode: "RESERVED", is_date_free: false, pickup_time: defaultReserved } as any);
                    }
                }}
                bottomLabel=""
                bottomContent={
                    <PickupDateTimeSelector
                        formatSelectedDate={formatSelectedDate}
                    />
                }
                className="mt-3"
            />
        </section>
    );
}
