"use client";

import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * 눌러서 이동하는 줄·카드 — 오른쪽 ›(밖으로 나가면 ↗). 바로키친 어드민 NavRow 와 같은 자리.
 * card = 테두리 있는 카드(화면 1 DIY·수리처럼 선택지 사이에 놓일 때), 기본은 줄.
 */
export default function NavRow({
  label,
  description,
  href,
  onClick,
  disabled,
  card,
  external,
  icon,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  card?: boolean;
  /** 밖으로 나가는 링크 — 새 창, 오른쪽 ↗ */
  external?: boolean;
  /** 왼쪽 아이콘 */
  icon?: React.ReactNode;
  className?: string;
}) {
  const cls = cn(
    "flex w-full items-center justify-between gap-3 text-left transition-colors",
    card ? "rounded-[12px] border px-5 py-4" : "px-5 py-4",
    disabled ? "cursor-not-allowed border-gray-100 bg-muted text-gray-300" : "border-border bg-background hover:bg-muted",
    className,
  );
  const body = (
    <>
      {icon && <span className="shrink-0 text-gray-500">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={cn("text-[17px] font-600", disabled ? "" : "text-gray-800")}>{label}</span>
        {description && <span className={cn("text-[14px]", disabled ? "" : "text-gray-500")}>{description}</span>}
      </span>
      {external ? (
        <ArrowUpRight className={cn("size-5 shrink-0", disabled ? "text-gray-200" : "text-gray-400")} />
      ) : (
        <ChevronRight className={cn("size-5 shrink-0", disabled ? "text-gray-200" : "text-gray-400")} />
      )}
    </>
  );
  if (href && !disabled && external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  if (href && !disabled)
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cls}>
      {body}
    </button>
  );
}
