"use client";

import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

interface TimePickerSwiperProps {
  initialHour: string;
  initialMinute: string;
  onConfirm: (hour: string, minute: string) => void;
  onClose: () => void;
}

export default function TimePickerSwiper({
  initialHour,
  initialMinute,
  onConfirm,
  onClose,
}: TimePickerSwiperProps) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [selectedHourIndex, setSelectedHourIndex] = useState(parseInt(initialHour));
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(parseInt(initialMinute));

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  // Match BottomSheet behavior: lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div style={{ zIndex: 50, position: "fixed", inset: 0 }}>
      {/* Overlay layer that blocks background interactions (like BottomSheet) */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="h-full w-full max-w-[460px] bg-black bg-opacity-20" />
      </div>
      {/* Modal content above the overlay; clicking inside shouldn't close or propagate */}
      <div
        className="fixed left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4"
        style={{ zIndex: 60 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="mb-4 text-center text-lg font-bold">희망 시간</h2>
        <div className="flex justify-center">
          <Swiper
            direction="vertical"
            slidesPerView={5}
            centeredSlides
            loop
            loopAdditionalSlides={8}
            onSlideChange={swiper => {
              setSelectedHourIndex(swiper.realIndex);
              setHour(hours[swiper.realIndex]);
            }}
            initialSlide={parseInt(initialHour)}
            className="h-40 w-20 text-center"
          >
            {hours.map((h, i) => (
              <SwiperSlide
                key={h}
                className={`flex items-center justify-center text-lg ${
                  i === selectedHourIndex ? "font-bold text-brand-500" : "text-gray-500"
                }`}
              >
                {h}
              </SwiperSlide>
            ))}
          </Swiper>
          <span className="self-center">:</span>
          <Swiper
            direction="vertical"
            slidesPerView={5}
            centeredSlides
            loop
            loopAdditionalSlides={8}
            onSlideChange={swiper => {
              setSelectedMinuteIndex(swiper.realIndex);
              setMinute(minutes[swiper.realIndex]);
            }}
            initialSlide={parseInt(initialMinute)}
            className="h-40 w-20 text-center"
          >
            {minutes.map((m, i) => (
              <SwiperSlide
                key={m}
                className={`flex items-center justify-center text-lg ${
                  i === selectedMinuteIndex ? "font-bold text-brand-500" : "text-gray-500"
                }`}
              >
                {m}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            className="flex-1 rounded-xl border border-gray-300 py-2 text-gray-700"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="flex-1 rounded-xl bg-brand-500 py-2 text-white"
            onClick={() => {
              onConfirm(hour, minute);
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
