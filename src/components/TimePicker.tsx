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

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-72 rounded-3xl bg-white p-5">
        <h2 className="mb-4 text-xl font-700">희망배송시간</h2>
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
          className="mt-5 w-full rounded-xl bg-brand-500 py-2 text-white"
          onClick={() => {
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
