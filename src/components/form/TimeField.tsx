"use client";

import { Clock } from "lucide-react";
import { useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import Sheet from "@/components/overlay/Sheet";
import { Button } from "@/components/ui/button";
import { inputBox } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

function Wheel({ items, start, onPick }: { items: string[]; start: number; onPick: (i: number) => void }) {
  const [at, setAt] = useState(start);
  return (
    <Swiper
      direction="vertical"
      slidesPerView={5}
      centeredSlides
      loop
      loopAdditionalSlides={8}
      initialSlide={start}
      onSlideChange={(s) => {
        setAt(s.realIndex);
        onPick(s.realIndex);
      }}
      className="h-40 w-20 text-center"
    >
      {items.map((v, i) => (
        <SwiperSlide key={v} className={cn("flex items-center justify-center text-[18px]", i === at ? "font-700 text-primary" : "text-gray-500")}>
          {v}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

/**
 * 시각 칸 — 칸을 누르면 시트에 시·분 휠, 「확인」으로 넣는다. 날짜 칸(DateField)과 같은 모양·자리.
 * 값은 'HH:MM'(비었으면 '').
 */
export default function TimeField({
  value,
  onChange,
  title = "희망 시간",
  placeholder = "시간",
  disabled,
  className,
  "aria-invalid": invalid,
}: {
  value: string;
  onChange: (hhmm: string) => void;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [h0, m0] = (value || "09:00").split(":").map(Number);
  const [h, setH] = useState(h0);
  const [m, setM] = useState(m0);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-invalid={invalid}
        onClick={() => {
          setH(h0);
          setM(m0);
          setOpen(true);
        }}
        className={cn(inputBox, "items-center justify-between gap-2 text-left", className)}
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>{value || placeholder}</span>
        <Clock className="size-5 shrink-0 text-gray-400" />
      </button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        bodyClassName="flex items-center justify-center gap-2 px-5"
        footer={
          <Button
            className="w-full"
            onClick={() => {
              onChange(`${HOURS[h]}:${MINUTES[m]}`);
              setOpen(false);
            }}
          >
            확인
          </Button>
        }
      >
        {open && (
          <>
            <Wheel items={HOURS} start={h0} onPick={setH} />
            <span className="text-[18px] text-gray-500">:</span>
            <Wheel items={MINUTES} start={m0} onPick={setM} />
          </>
        )}
      </Sheet>
    </>
  );
}
