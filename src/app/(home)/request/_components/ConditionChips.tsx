import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 조건 칩 — 이름 옆 짧은 띠. shadcn Badge ghost 모양(바탕·테두리 없이 색 글자만, 2026-11-15 사용자 「칩은 F」).
 * 시간은 회색 + 시계, 비용은 더하면 빨강(추가금·배송비 착불) · 빼면 파랑(할인). 금액 숫자는 적지 않는다(2026-11-23).
 * 상황 고르기(SituationPicker)와 배송 방법 장(install)이 같이 쓴다.
 */
const chip = "inline-flex items-center gap-[3px] px-0.5 text-[12px]/[16px] align-middle";

/** 칩 여러 개를 한 줄에(좁으면 다음 줄) */
export function Chips({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex flex-wrap gap-1 align-middle">{children}</span>;
}

export function TimeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className={cn(chip, "font-500 text-gray-500")}>
      {/* 카드 버튼의 [&_svg]:size-4 를 이기게 ! */}
      <Clock className="!size-3" strokeWidth={2.5} />
      {children}
    </span>
  );
}

export function MoneyChip({ tone = "extra", className, children }: { tone?: "extra" | "discount"; className?: string; children: React.ReactNode }) {
  return <span className={cn(chip, "font-600", tone === "extra" ? "text-red-500" : "text-blue-500", className)}>{children}</span>;
}
