"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 수량 바꾸기 — − 수 + 한 줄. trashable 이면 1에서 −가 휴지통(지우기)이 된다.
 * 지우기 확인은 쓰는 쪽이 ConfirmSheet 로 묻는다(되돌릴 수 없는 일).
 */
export default function QuantitySelector({
  trashable,
  quantity,
  onDecrease,
  onIncrease,
  onTrash,
  disabled = false,
  max,
}: {
  trashable: boolean;
  quantity: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  onTrash?: () => void;
  disabled?: boolean;
  /** 이보다 많이는 못 늘린다(롱문 등) */
  max?: number;
}) {
  const trash = trashable && quantity === 1 && !!onTrash;
  const cell = "grid h-10 place-content-center border-y border-input bg-background px-2 text-gray-700 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <div className="flex items-center" role="group" aria-label="수량">
      <button
        type="button"
        className={cn(cell, "rounded-l-[10px] border-l")}
        disabled={disabled || (!trash && quantity <= 0)}
        onClick={trash ? onTrash : onDecrease}
        aria-label={trash ? "빼기" : "수량 감소"}
      >
        {trash ? <Trash2 className="size-5 text-gray-500" /> : <Minus className="size-5" />}
      </button>
      <span className="grid h-10 w-8 place-content-center border-y border-input text-[16px] font-500 text-gray-700" aria-live="polite">
        {quantity}
      </span>
      <button type="button" className={cn(cell, "rounded-r-[10px] border-r")} disabled={disabled || (max != null && quantity >= max)} onClick={onIncrease} aria-label="수량 증가">
        <Plus className="size-5" />
      </button>
    </div>
  );
}
