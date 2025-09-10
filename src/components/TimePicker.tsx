"use client";

import { useState } from "react";

interface TimePickerProps {
  initialHour: string;
  initialMinute: string;
  onConfirm: (hour: string, minute: string) => void;
  onClose: () => void;
}

function TimePicker({ initialHour, initialMinute, onConfirm, onClose }: TimePickerProps) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  // 모든 시간대를 보여주되, 오전 9시부터 시작하도록 순서 변경
  const hours = [
    "--",
    ...Array.from({ length: 15 }, (_, i) => String(i + 9).padStart(2, "0")), // 09-23시
    ...Array.from({ length: 9 }, (_, i) => String(i).padStart(2, "0")), // 00-08시
  ];
  const minutes = ["--", ...Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-72 rounded-3xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-700">희망배송시간</h2>
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
        <div className="flex justify-center gap-6 py-4">
          <div className="relative">
            <select
              value={hour}
              onChange={e => setHour(e.target.value)}
              className="appearance-none rounded-xl border border-gray-300 px-4 py-2 pr-12 text-lg"
            >
              {hours.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <img src={"/icons/chevron-down-thick.svg"} alt="아래방향 화살표" />
            </div>
          </div>

          <span className="self-center text-xl">:</span>

          <div className="relative">
            <select
              value={minute}
              onChange={e => setMinute(e.target.value)}
              className="appearance-none rounded-xl border border-gray-300 px-4 py-2 pr-12 text-lg"
            >
              {minutes.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <img src={"/icons/chevron-down-thick.svg"} alt="아래방향 화살표" />
            </div>
          </div>
        </div>

        <button
          className="mt-5 w-full rounded-xl bg-brand-500 py-2 text-white disabled:bg-gray-300 disabled:text-gray-500"
          disabled={hour === "--" || minute === "--"}
          onClick={() => {
            if (hour === "--" || minute === "--") {
              alert("시간을 선택해주세요");
              return;
            }
            onConfirm(hour, minute);
            onClose();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default TimePicker;
