"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { ko } from "react-day-picker/locale";

import Sheet from "@/components/overlay/Sheet";
import { Calendar } from "@/components/ui/calendar";
import { inputBox } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const toYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
/** 2026-11-27 → 11월 27일 (금) */
export const dateLabel = (ymd: string) => {
  const d = fromYmd(ymd);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEK[d.getDay()]})`;
};

/**
 * 날짜 칸 — 기기 기본 날짜 칸 대신 늘 같은 달력(shadcn Calendar)을 시트로. 바로키친 어드민 DateTimeField 와 같은 규칙.
 * 값은 'YYYY-MM-DD'. min·max 밖은 못 고른다. 고르면 시트가 닫힌다.
 */
export default function DateField({
  value,
  onChange,
  min,
  max,
  title = "날짜 고르기",
  placeholder = "날짜를 골라 주세요",
  className,
  "aria-invalid": invalid,
}: {
  value: string;
  onChange: (ymd: string) => void;
  min?: string;
  max?: string;
  title?: string;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const disabled = [...(min ? [{ before: fromYmd(min) }] : []), ...(max ? [{ after: fromYmd(max) }] : [])];
  return (
    <>
      <button
        type="button"
        aria-invalid={invalid}
        onClick={() => setOpen(true)}
        className={cn(inputBox, "items-center justify-between gap-2 text-left", className)}
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>{value ? dateLabel(value) : placeholder}</span>
        <CalendarDays className="size-5 shrink-0 text-gray-400" />
      </button>
      <Sheet open={open} onOpenChange={setOpen} title={title} bodyClassName="flex justify-center px-2">
        <Calendar
          mode="single"
          locale={ko}
          selected={value ? fromYmd(value) : undefined}
          defaultMonth={value ? fromYmd(value) : min ? fromYmd(min) : undefined}
          disabled={disabled}
          // 고른 날을 다시 눌러도 비우지 않고 닫는다(예전엔 고른 것이 풀리며 시트가 남았다)
          required
          onSelect={(d) => {
            if (d) onChange(toYmd(d));
            setOpen(false);
          }}
          className="[--cell-size:2.75rem]"
        />
      </Sheet>
    </>
  );
}
