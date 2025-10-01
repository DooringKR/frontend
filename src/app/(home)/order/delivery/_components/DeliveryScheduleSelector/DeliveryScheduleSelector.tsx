"use client";

import { useDeliverySchedule } from "./_hooks/useDeliverySchedule";
import { useDeliveryDate } from "./_hooks/useDeliveryDate";
import TodayDeliveryOption from "./_components/TodayDeliveryOption";
import CustomDateDeliveryOption from "./_components/CustomDateDeliveryOption";

export default function DeliveryScheduleSelector() {
  const { expectedArrivalMinutes, isTodayDeliveryAvailable } = useDeliverySchedule();
  const { formatSelectedDate } = useDeliveryDate();

  return (
    <section className="flex flex-col gap-3 py-5">
      <h2 className="text-xl font-600">배송일정 선택</h2>

      <TodayDeliveryOption
        expectedArrivalMinutes={expectedArrivalMinutes}
        isTodayDeliveryAvailable={isTodayDeliveryAvailable}
      />

      <CustomDateDeliveryOption
        formatSelectedDate={formatSelectedDate}
        isTodayDeliveryAvailable={isTodayDeliveryAvailable}
      />
    </section>
  );
}
