"use client";

import { useEffect, useState } from "react";

import DatePicker from "@/components/DatePicker";
import Modal from "@/components/Modal/Modal";
import TimePickerSimple from "@/components/TimePicker";

import { useOrderStore } from "@/store/orderStore";
import { formatDeliveryTimeRange, formatRemainingTimeRange } from "@/utils/caculateDeliveryInfo";

interface DeliveryScheduleSelectorProps {
  expectedArrivalMinutes: number | null;
}

export default function DeliveryScheduleSelector({
  expectedArrivalMinutes,
}: DeliveryScheduleSelectorProps) {
  const is_today_delivery = useOrderStore(state => state.order?.is_today_delivery);
  const delivery_arrival_time = useOrderStore(state => state.order?.delivery_arrival_time);
  const updateOrder = useOrderStore(state => state.updateOrder);

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTodayDeliveryAvailable, setIsTodayDeliveryAvailable] = useState(true);

  // delivery_arrival_time을 Date 객체로 변환하는 헬퍼 함수
  const getDeliveryDate = () => {
    if (!delivery_arrival_time) return null;
    if (delivery_arrival_time instanceof Date) return delivery_arrival_time;
    return new Date(delivery_arrival_time);
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

  // 오늘배송 가능 여부 계산
  useEffect(() => {
    if (expectedArrivalMinutes === null) return;

    const now = new Date();
    const arrivalDate = new Date(now);
    arrivalDate.setMinutes(now.getMinutes() + expectedArrivalMinutes);

    const todayDeadline = new Date();
    todayDeadline.setHours(18, 0, 0, 0); // 오늘 18:00:00

    const isTodayAvailable = arrivalDate.getTime() < todayDeadline.getTime();
    console.log("🚚 예상 도착시간:", arrivalDate.toLocaleTimeString());
    console.log("🚫 오늘배송 가능 여부:", isTodayAvailable);
    setIsTodayDeliveryAvailable(isTodayAvailable);

    // 오늘 배송 불가능하면 자동으로 다른 날 배송으로 전환
    if (!isTodayAvailable && is_today_delivery === true) {
      updateOrder({ is_today_delivery: false, delivery_arrival_time: null });
    }
  }, [expectedArrivalMinutes, is_today_delivery, updateOrder]);

  const deliveryDate = getDeliveryDate();

  return (
    <section className="flex flex-col gap-3 py-5">
      <h2 className="text-xl font-600">배송일정 선택</h2>

      <div
        onClick={() => {
          if (!isTodayDeliveryAvailable) return; // 오늘배송 불가 시 클릭 막기

          // 예상 도착 시간 계산
          const now = new Date();
          const arrivalDate = new Date(now);
          arrivalDate.setMinutes(now.getMinutes() + (expectedArrivalMinutes || 0));

          updateOrder({ is_today_delivery: true, delivery_arrival_time: arrivalDate });
        }}
        className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-5 py-4 ${is_today_delivery === true ? "border-2 border-gray-800" : "border-gray-300"} ${!isTodayDeliveryAvailable ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <div className="flex justify-between">
          <span className="text-[17px] font-600">오늘배송</span>
          {is_today_delivery !== true && (
            <span className="text-blue-500">
              {expectedArrivalMinutes !== null
                ? `${expectedArrivalMinutes}~${expectedArrivalMinutes + 10}분 후 도착`
                : "계산 중..."}
            </span>
          )}
        </div>
        <p
          className={`text-base font-400 ${isTodayDeliveryAvailable && expectedArrivalMinutes !== null && is_today_delivery === true
            ? "text-gray-800"
            : "text-gray-500"
            }`}
        >
          {isTodayDeliveryAvailable && expectedArrivalMinutes !== null
            ? is_today_delivery === true
              ? formatRemainingTimeRange(expectedArrivalMinutes)
              : `오늘 ${formatDeliveryTimeRange(expectedArrivalMinutes)} 도착 예정`
            : "오늘 배송이 불가능해요."}
        </p>
      </div>

      <div
        onClick={() => {
          updateOrder({ is_today_delivery: false });
        }}
        className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-5 py-4 ${is_today_delivery === false ? "border-2 border-gray-800" : "border-gray-300"}`}
      >
        <div className="flex justify-between">
          <span className="text-[17px] font-600">원하는 날짜 배송</span>
          {is_today_delivery === false ? (
            ""
          ) : (
            <span className="text-sm text-blue-500">날짜 선택</span>
          )}
        </div>
        {is_today_delivery === false ? (
          <span className="text-[15px] font-500">
            {deliveryDate
              ? formatSelectedDate(deliveryDate.toISOString().split("T")[0])
              : "날짜를 선택해주세요"}{" "}
            원하는 시간 도착
          </span>
        ) : (
          <p className="text-base font-400 text-gray-500">원하는 날짜와 시간에 배송돼요.</p>
        )}

        {is_today_delivery === false && (
          <div className="flex flex-col gap-2">
            <div className="mt-3 flex items-center">
              <span className="text-sm font-400 text-gray-800">
                {deliveryDate ? formatSelectedDate(deliveryDate.toISOString().split("T")[0]) : "날짜 미선택"}{" "}
                <span className="text-sm font-400 text-gray-600">희망배송시간</span>
              </span>
            </div>

            <div
              onClick={() => setIsDateModalOpen(true)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg"
            >
              {deliveryDate
                ? formatSelectedDate(deliveryDate.toISOString().split("T")[0])
                : "날짜를 선택해주세요"}
            </div>

            <div
              onClick={() => setIsTimeModalOpen(true)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg"
            >
              {deliveryDate
                ? deliveryDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                : "-- : --"}
            </div>

            <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
              <DatePicker
                initialDate={deliveryDate ? deliveryDate.toISOString().split("T")[0] : (isTodayDeliveryAvailable ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])}
                onConfirm={date => {
                  // 날짜만 선택된 경우 시간은 00:00:00으로 설정
                  const dateTimeString = `${date}T00:00:00`;
                  updateOrder({ delivery_arrival_time: new Date(dateTimeString) });
                  setIsDateModalOpen(false);
                }}
                onClose={() => setIsDateModalOpen(false)}
              />
            </Modal>
            <Modal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)}>
              <TimePickerSimple
                initialHour={deliveryDate ? deliveryDate.getHours().toString().padStart(2, "0") : ""}
                initialMinute={deliveryDate ? deliveryDate.getMinutes().toString().padStart(2, "0") : ""}
                onConfirm={(h, m) => {
                  if (!deliveryDate) return;
                  const newDate = new Date(deliveryDate);
                  newDate.setHours(parseInt(h));
                  newDate.setMinutes(parseInt(m));
                  updateOrder({ delivery_arrival_time: newDate });
                  setIsTimeModalOpen(false);
                }}
                onClose={() => setIsTimeModalOpen(false)}
              />
            </Modal>
          </div>
        )}
      </div>
    </section>
  );
}
