"use client";

import DateField from "@/components/form/DateField";
import TimeField from "@/components/form/TimeField";

import { hhmmOf, withHhmm, withYmd, ymdOf } from "../_lib/order";

/**
 * 날짜·시각 한 줄 — 배송(원하는 날짜 배송)·픽업이 같이 쓴다. store 값(Date)과 칸 글자를 바꾼다.
 * 날짜를 바꿔도 고른 시각은 그대로 둔다(예전 배송은 날짜를 고르면 0시로 덮었다). 시각은 날짜를 고른 뒤에.
 */
export default function DateTimeRow({
  value,
  onChange,
  min,
  label,
  invalid,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  /** 고를 수 있는 첫날 'YYYY-MM-DD' */
  min: string;
  /** 시트 제목 앞말(「희망 배송」 → 「희망 배송 날짜」·「희망 배송 시간」) */
  label: string;
  invalid?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <DateField
        className="flex-1"
        aria-invalid={invalid}
        title={`${label} 날짜`}
        placeholder="날짜"
        min={min}
        value={value ? ymdOf(value) : ""}
        onChange={(ymd) => onChange(withYmd(value, ymd))}
      />
      <TimeField
        className="flex-1"
        title={`${label} 시간`}
        disabled={!value}
        value={value ? hhmmOf(value) : ""}
        onChange={(hhmm) => value && onChange(withHhmm(value, hhmm))}
      />
    </div>
  );
}
