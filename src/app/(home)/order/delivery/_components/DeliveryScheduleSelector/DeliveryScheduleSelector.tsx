"use client";

import { useEffect } from "react";

import Choose from "@/components/form/Choose";
import { Loading } from "@/components/state/StateViews";
import { useOrderStore } from "@/store/orderStore";
import { formatDeliveryTimeRange, formatRemainingTimeRange } from "@/utils/caculateDeliveryInfo";

import DateTimeRow from "../../../_components/DateTimeRow";
import { addDays, defaultArrival, toDate, ymdOf } from "../../../_lib/order";
import { useDeliverySchedule } from "./_hooks/useDeliverySchedule";

/**
 * 배송일정 — 오늘배송 / 원하는 날짜 배송 중 하나(Choose). 원하는 날짜면 밑에 날짜·시각 칸.
 * 칸을 눌러도 고르기가 다시 불리지 않는다(예전 카드는 안 칸을 누를 때도 카드 onClick 이 불려 시각을 덮었다).
 */
export default function DeliveryScheduleSelector({ invalid }: { invalid?: boolean }) {
  const order = useOrderStore((s) => s.order);
  const updateOrder = useOrderStore((s) => s.updateOrder);
  const { minutes, status, available } = useDeliverySchedule(order?.road_address);
  const arrival = toDate(order?.delivery_arrival_time);
  const today = order?.is_today_delivery === true;

  // 오늘배송을 골랐는데 불가로 바뀌면 원하는 날짜 배송으로(기본값)
  useEffect(() => {
    if ((status === "done" || status === "failed") && !available && today)
      updateOrder({ is_today_delivery: false, delivery_arrival_time: defaultArrival() });
  }, [status, available, today, updateOrder]);

  const todayText =
    status === "loading" ? (
      <Loading variant="inline" label="계산 중" />
    ) : status === "idle" ? (
      "주소를 넣으면 확인해요"
    ) : !available || minutes == null ? (
      "오늘 배송이 불가능해요."
    ) : today ? (
      formatRemainingTimeRange(minutes)
    ) : (
      `오늘 ${formatDeliveryTimeRange(minutes)} 도착 예정`
    );

  return (
    <div className="flex flex-col gap-3">
      <Choose
        aria-label="배송일정"
        value={today ? "today" : order?.is_today_delivery === false ? "custom" : null}
        onChange={(v) =>
          v === "today"
            ? updateOrder({ is_today_delivery: true, delivery_arrival_time: new Date(Date.now() + (minutes ?? 0) * 60_000) })
            : updateOrder({ is_today_delivery: false, delivery_arrival_time: defaultArrival() })
        }
        options={[
          {
            value: "today" as const,
            label: "오늘배송",
            description: todayText,
            disabled: !available,
            // eslint-disable-next-line @next/next/no-img-element
            badge: available ? <img src="/icons/sameday.svg" alt="당일배송" className="inline size-3" /> : undefined,
          },
          { value: "custom" as const, label: "원하는 날짜 배송", description: "원하는 날짜와 시간에 배송돼요." },
        ]}
      />
      {order?.is_today_delivery === false && (
        <DateTimeRow
          label="희망 배송"
          min={ymdOf(addDays(new Date(), 1))}
          invalid={invalid}
          value={arrival}
          onChange={(d) => updateOrder({ delivery_arrival_time: d })}
        />
      )}
    </div>
  );
}
