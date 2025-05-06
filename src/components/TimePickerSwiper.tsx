"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="w-72 rounded-xl bg-white p-4">
        <h2 className="mb-4 text-center text-lg font-bold">희망배송시간</h2>
        <div className="flex justify-center">
          <Swiper
            direction="vertical"
            slidesPerView={5}
            centeredSlides
            onSlideChange={(swiper) => setHour(hours[swiper.realIndex])}
            initialSlide={parseInt(initialHour)}
            className="h-40 w-20 text-center"
          >
            {hours.map((h) => (
              <SwiperSlide key={h} className="flex items-center justify-center text-lg">
                {h}
              </SwiperSlide>
            ))}
          </Swiper>
          <span className="self-center">:</span>
          <Swiper
            direction="vertical"
            slidesPerView={5}
            centeredSlides
            onSlideChange={(swiper) => setMinute(minutes[swiper.realIndex])}
            initialSlide={parseInt(initialMinute)}
            className="h-40 w-20 text-center"
          >
            {minutes.map((m) => (
              <SwiperSlide key={m} className="flex items-center justify-center text-lg">
                {m}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <button
          className="mt-4 w-full rounded bg-green-500 py-2 text-white"
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
