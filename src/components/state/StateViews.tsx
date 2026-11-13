"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * 불러오기·빈 목록·읽기 실패 — 바로키친 어드민 state/StateViews 와 같은 규칙.
 *  - 읽기 전엔 Loading(page: 화면 가운데 · inline: 그 자리 한 줄) 또는 ListSkeleton(목록 자리).
 *    안 읽힌 것(null)과 빈 것([])을 가른다 — 읽기 전에 「없습니다」를 띄우지 않는다.
 *  - 빈 목록은 EmptyState(가운데 한 줄 + 할 일 버튼 하나).
 *  - 읽기 실패는 ErrorBanner 하나(다시 읽기 버튼).
 */
export function Loading({ variant = "page", label, className }: { variant?: "page" | "inline"; label?: string; className?: string }) {
  if (variant === "inline")
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-[14px] text-gray-500", className)} role="status">
        <Loader2 className="size-4 animate-spin" />
        {label ?? "불러오는 중"}
      </span>
    );
  return (
    <div className={cn("flex min-h-[40vh] flex-col items-center justify-center gap-2 text-[14px] text-gray-500", className)} role="status">
      <Loader2 className="size-6 animate-spin text-gray-400" />
      {label ?? "불러오는 중"}
    </div>
  );
}

export function ListSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} role="status" aria-label="불러오는 중">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-[88px] w-full rounded-[12px] bg-gray-100" />
      ))}
    </div>
  );
}

export function EmptyState({
  text,
  action,
  className,
}: {
  text: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 text-center", className)}>
      <p className="text-[15px] text-gray-500">{text}</p>
      {action && (
        <Button variant="outline" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorBanner({ text, onRetry, className }: { text: string; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn("flex items-center justify-between gap-3 rounded-[12px] bg-red-50 px-4 py-3 text-[14px] text-red-600", className)}>
      <span className="min-w-0">{text}</span>
      {onRetry && (
        <Button variant="ghost" size="sm" className="shrink-0 text-red-600" onClick={onRetry}>
          다시 읽기
        </Button>
      )}
    </div>
  );
}
