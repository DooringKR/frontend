import { Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 안내·경고 상자 — 회색(안내)·파랑(알림)·빨강(경고) 세 모양. 바로키친 어드민 Notice 와 같은 자리.
 * 짧은 제목 한 줄 + 설명. 버튼 밑 부연 설명으로 쓰지 않는다.
 */
export default function Notice({
  tone = "gray",
  title,
  children,
  className,
}: {
  tone?: "gray" | "blue" | "red";
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "red" ? TriangleAlert : Info;
  return (
    <div
      role={tone === "red" ? "alert" : undefined}
      className={cn(
        "flex gap-2 rounded-[12px] px-4 py-3 text-[14px]",
        tone === "gray" && "bg-muted text-gray-600",
        tone === "blue" && "bg-brand-50 text-brand-600",
        tone === "red" && "bg-red-50 text-red-600",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5">
        {title && <p className="font-600">{title}</p>}
        {children && <div className={tone === "gray" ? "text-gray-500" : ""}>{children}</div>}
      </div>
    </div>
  );
}
