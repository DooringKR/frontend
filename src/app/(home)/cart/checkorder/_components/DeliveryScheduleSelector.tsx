"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/Modal/Modal";
import TimePickerSwiper from "@/components/TimePickerSwiper";

interface DeliveryScheduleSelectorProps {
  expectedArrivalMinutes: number | null;
  setDeliveryDate: (date: string) => void;
}

export default function DeliveryScheduleSelector({
  expectedArrivalMinutes,
  setDeliveryDate,
}: DeliveryScheduleSelectorProps) {
  const [deliveryType, setDeliveryType] = useState<"today" | "tomorrow">("today");
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tomorrowDayLabel, setTomorrowDayLabel] = useState("");
  const [tomorrowFullLabel, setTomorrowFullLabel] = useState("");
  const [isTodayDeliveryAvailable, setIsTodayDeliveryAvailable] = useState(true);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowMonth = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
    const tomorrowDate = tomorrow.getDate().toString().padStart(2, "0");
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const tomorrowDay = weekDays[tomorrow.getDay()];
    setTomorrowDayLabel(`내일(${tomorrowDay}) 도착`);
    setTomorrowFullLabel(`${tomorrowMonth}/${tomorrowDate} (${tomorrowDay})`);
  }, []);

  useEffect(() => {
    if (expectedArrivalMinutes === null) return;

    const deliveryDateObj = new Date();

    if (deliveryType === "tomorrow") {
      deliveryDateObj.setDate(deliveryDateObj.getDate() + 1);
      deliveryDateObj.setHours(parseInt(hour));
      deliveryDateObj.setMinutes(parseInt(minute));
      deliveryDateObj.setSeconds(0);
    } else {
      deliveryDateObj.setMinutes(deliveryDateObj.getMinutes() + expectedArrivalMinutes);
    }

    const kstString = deliveryDateObj
      .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
      .replace(" ", "T");
    setDeliveryDate(kstString);
  }, [deliveryType, hour, minute, expectedArrivalMinutes, setDeliveryDate]);

  useEffect(() => {
    if (expectedArrivalMinutes === null) return;

    const now = new Date();
    const arrivalDate = new Date(now);
    arrivalDate.setMinutes(now.getMinutes() + expectedArrivalMinutes);

    if (arrivalDate.getHours() >= 18) {
      setIsTodayDeliveryAvailable(false);
      setDeliveryType("tomorrow");
    } else {
      setIsTodayDeliveryAvailable(true);
    }
  }, [expectedArrivalMinutes]);

  return (
    <section className="mb-4">
      <h2 className="mb-2 font-medium">배송일정 선택</h2>

      <div
  onClick={() => isTodayDeliveryAvailable && setDeliveryType("today")}
  className={`border p-3 ${deliveryType === "today" ? "border-blue-500" : "border-gray-300"} ${!isTodayDeliveryAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
>
  <div className="flex justify-between">
    <span>바로배송</span>
    <span className="text-blue-500">
      {expectedArrivalMinutes !== null ? `약 ${expectedArrivalMinutes}분` : "계산 중..."}
    </span>
  </div>
  <p>
    {isTodayDeliveryAvailable
      ? "오늘 오후 6시 전으로 배송돼요."
      : "바로 배송이 불가능해요."}
  </p>
</div>


      <div
        onClick={() => setDeliveryType("tomorrow")}
        className={`mt-2 border p-3 ${deliveryType === "tomorrow" ? "border-blue-500" : "border-gray-300"}`}
      >
        <div className="flex justify-between">
          <span>익일배송</span>
          <span className="text-sm text-blue-500">{tomorrowDayLabel}</span>
        </div>

        {deliveryType === "tomorrow" && (
          <>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">희망배송시간</span>
              <span className="text-sm text-blue-500">{tomorrowFullLabel}</span>
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg shadow-inner"
            >
              {hour}:{minute}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <TimePickerSwiper
                initialHour={hour}
                initialMinute={minute}
                onConfirm={(h, m) => {
                  setHour(h);
                  setMinute(m);
                  setIsModalOpen(false);
                }}
                onClose={() => setIsModalOpen(false)}
              />
            </Modal>
          </>
        )}
      </div>
    </section>
  );
}
