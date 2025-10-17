"use client";

import { useState } from "react";

interface DatePickerProps {
  initialDate: Date | null;
  onConfirm: (date: string) => void;
  onClose: () => void;
}

export default function DatePicker({ initialDate, onConfirm, onClose }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(
    initialDate
      ? `${initialDate.getFullYear()}-${(initialDate.getMonth() + 1).toString().padStart(2, "0")}-${initialDate.getDate().toString().padStart(2, "0")}`
      : ""
  );
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date());

  // 달력 데이터 생성
  const generateCalendarData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 해당 월의 첫째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 첫째 날의 요일 (0: 일요일)
    const firstDayOfWeek = firstDay.getDay();

    // 이전 달의 마지막 날들
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();

    const calendar = [];

    // 이전 달의 날짜들 (빈 칸 채우기)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      calendar.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isSelectable: false,
      });
    }

    // 현재 달의 날짜들
    const today = new Date();
    // 날짜 비교를 위해 시간을 0으로 설정
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isTomorrow =
        date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
      // 날짜만 비교 (시간 제외)
      const isPast = date < todayDateOnly;

      calendar.push({
        date,
        isCurrentMonth: true,
        isSelectable: !isPast,
        isTomorrow,
      });
    }

    // 다음 달의 날짜들 (빈 칸 채우기)
    const remainingCells = 42 - calendar.length; // 6주 * 7일 = 42
    for (let day = 1; day <= remainingCells; day++) {
      calendar.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isSelectable: false,
      });
    }

    return calendar;
  };

  // 월 변경
  const changeMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // 날짜 선택
  const handleDateSelect = (date: Date) => {
    // 로컬 시간대 기준으로 날짜 문자열 생성
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    setSelectedDate(dateString);
  };

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "오늘";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "내일";
    } else {
      return date.getDate().toString();
    }
  };

  const calendarData = generateCalendarData(currentMonth);
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-3xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-700">배송 날짜 선택</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 월 네비게이션 */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => changeMonth("prev")}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h3 className="text-lg font-600">
            {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
          </h3>

          <button
            onClick={() => changeMonth("next")}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="py-2 text-center text-sm font-500 text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="mb-4 grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => {
            // 로컬 시간대 기준으로 날짜 문자열 생성
            const year = day.date.getFullYear();
            const month = (day.date.getMonth() + 1).toString().padStart(2, "0");
            const dayNum = day.date.getDate().toString().padStart(2, "0");
            const dateString = `${year}-${month}-${dayNum}`;
            const isSelected = selectedDate === dateString;
            const isToday = day.date.toDateString() === new Date().toDateString();

            return (
              <button
                key={index}
                onClick={() => day.isSelectable && handleDateSelect(day.date)}
                disabled={!day.isSelectable}
                className={`h-10 w-10 rounded-lg text-sm font-500 transition-colors ${!day.isSelectable
                  ? "cursor-not-allowed text-gray-300"
                  : isSelected
                    ? "bg-brand-500 text-white"
                    : day.isTomorrow
                      ? "text-green-600 hover:bg-green-50"
                      : isToday
                        ? "text-blue-600 hover:bg-blue-50"
                        : "text-gray-800 hover:bg-gray-100"
                  } ${!day.isCurrentMonth ? "opacity-30" : ""} `}
              >
                {formatDate(day.date)}
              </button>
            );
          })}
        </div>

        {/* 선택된 날짜 표시 */}
        {selectedDate && (
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-600">
              선택된 날짜:{" "}
              {new Date(selectedDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="flex-1 rounded-xl border border-gray-300 py-2 text-gray-700"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 rounded-xl bg-brand-500 py-2 text-white disabled:bg-gray-300 disabled:text-gray-500"
            disabled={!selectedDate}
            onClick={() => {
              if (!selectedDate) {
                alert("날짜를 선택해주세요");
                return;
              }
              onConfirm(selectedDate);
              onClose();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
