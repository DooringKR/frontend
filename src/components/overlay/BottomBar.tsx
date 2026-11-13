"use client";

import { cn } from "@/lib/utils";

/**
 * 아래 고정 버튼 칸 — 옛 BottomButton(1button·2buttons·textcombo+button)을 버튼 그대로 받는 틀 하나로.
 * 버튼은 ui/Button 을 넣는다(두 개면 나란히, 왼쪽에 글이 필요하면 aside). 위로 흰 그러데이션.
 */
export default function BottomBar({
  children,
  aside,
  top,
  className,
  id,
}: {
  children: React.ReactNode;
  /** 버튼 왼쪽 글(옛 textcombo) */
  aside?: React.ReactNode;
  /** 버튼 위 줄(안내·오류) */
  top?: React.ReactNode;
  className?: string;
  /** 애널리틱스 선택자 등 */
  id?: string;
}) {
  return (
    <div id={id} className={cn("fixed bottom-0 z-30 w-full max-w-[460px]", className)}>
      <div className="h-5 w-full bg-gradient-to-t from-white via-white/60 to-transparent" />
      <div className="bg-white p-5 pt-0">
        {top}
        <div className="flex items-center gap-3 [&>*]:flex-1">
          {aside && <div className="min-w-0">{aside}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}
