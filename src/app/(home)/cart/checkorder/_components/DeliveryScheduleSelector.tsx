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
    <section className="flex flex-col gap-3 py-5">
      <h2 className="text-xl font-600">배송일정 선택</h2>

      <div
        onClick={() => isTodayDeliveryAvailable && setDeliveryType("today")}
        className={`flex flex-col gap-1 rounded-xl border px-5 py-4 ${deliveryType === "today" ? "border-blue-500" : "border-gray-300"} ${!isTodayDeliveryAvailable ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <div className="flex justify-between">
          {/* <span>바로배송</span> */}
          <span className="text-[17px] font-600">오늘배송</span>
          <span className="text-blue-500">
            {expectedArrivalMinutes !== null ? `약 ${expectedArrivalMinutes}분` : "계산 중..."}
          </span>
        </div>
        <p className="text-base font-400 text-gray-500">
          {/* {isTodayDeliveryAvailable ? "오늘 오후 6시 전으로 배송돼요." : "바로 배송이 불가능해요."} */}
          {isTodayDeliveryAvailable ? "오늘 16:28~17:45 도착예정" : "바로 배송이 불가능해요."}
        </p>
      </div>

      <div
        onClick={() => setDeliveryType("tomorrow")}
        className={`flex flex-col gap-1 rounded-xl border px-5 py-4 ${deliveryType === "tomorrow" ? "border-blue-500" : "border-gray-300"}`}
      >
        <div className="flex justify-between">
          {/* <span>익일배송</span> */}
          <span className="text-[17px] font-600">내일배송</span>
          <span className="text-sm text-blue-500">{tomorrowDayLabel}</span>
        </div>
        <p className="text-base font-400 text-gray-500">내일 원하는 시간에 배송돼요.</p>

        {deliveryType === "tomorrow" && (
          <>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold">희망배송시간</span>
              <span className="text-sm text-blue-500">{tomorrowFullLabel}</span>
            </div>

            <div
              onClick={() => setIsModalOpen(true)}
              className="w-full border-b-2 border-gray-300 bg-white px-4 py-3 text-lg"
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
