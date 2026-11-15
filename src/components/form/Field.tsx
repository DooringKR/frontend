"use client";

import { cn } from "@/lib/utils";

/**
 * 입력 칸 한 묶음 — 이름(필수면 빨간 *) · 칸 · 빠진 값 알림. 바로키친 어드민 form/Field 와 같은 규칙.
 * 필수값이 비어도 버튼은 눌리고, 누르면 첫 빈 칸으로 옮겨 가 그 칸 바로 밑에 알림이 뜬다(useRequired).
 */
export default function Field({
  label,
  required,
  error,
  hint,
  fieldRef,
  className,
  children,
}: {
  label?: React.ReactNode;
  required?: boolean;
  error?: string | null;
  /** 칸 밑 안내 한 줄(알림이 뜨면 알림이 먼저 보인다) */
  hint?: React.ReactNode;
  /** useRequired().ref(이름) — 빈 칸으로 옮겨 갈 자리 */
  fieldRef?: (el: HTMLDivElement | null) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div ref={fieldRef} data-invalid={error ? "" : undefined} className={cn("flex flex-col gap-2", className)}>
      {label != null && (
        // 알림은 이름 줄 오른쪽 — 칸 밑에 넣으면 아래 칸이 밀리고 이미 긴 화면이 더 길어졌다(2026-11-15 실측, 사용자 「L3」)
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[14px] font-400 text-gray-600">
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </p>
          {error && (
            <p role="alert" className="shrink-0 text-[14px] font-600 text-destructive">
              {error}
            </p>
          )}
        </div>
      )}
      {children}
      {hint && <FieldHint>{hint}</FieldHint>}
      {error && label == null && (
        <p role="alert" className="text-[14px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** 칸 밑 안내 줄 — 회색(기본)·초록(꼭 지킬 입력 요령, 예: 스끼 빼고 입력) */
export function FieldHint({ tone = "gray", children }: { tone?: "gray" | "green"; children: React.ReactNode }) {
  return <p className={cn("text-[14px]", tone === "green" ? "text-emerald-600" : "text-gray-600")}>{children}</p>;
}
