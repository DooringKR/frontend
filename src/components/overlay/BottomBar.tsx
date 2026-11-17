"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * 비켜 주는 모양 — on: 보임 / off: 숨음 / back: 화면 속 버튼이 위로 빠져서 아래에서 살짝 올라오며 다시 나옴
 * 고정 자리에서 갈아 끼울 때(on↔off)는 효과 없이 바로 — 같은 자리 같은 버튼이라 그래야 하나가 붙었다 떨어지는 것처럼 보인다.
 * 흐려지게 했더니 스크롤 중엔 두 버튼이 몇 px 어긋난 채 겹쳐 「주문하기」 글자가 두 겹으로 보였다(2026-11-17 연속 프레임).
 */
type Mode = "on" | "off" | "back";
const MODE: Record<Mode, string> = {
  on: "",
  off: "pointer-events-none opacity-0",
  back: "animate-in fade-in slide-in-from-bottom-3 duration-200 ease-out motion-reduce:animate-none",
};

/**
 * 아래 고정 버튼 칸 — 옛 BottomButton(1button·2buttons·textcombo+button)을 버튼 그대로 받는 틀 하나로.
 * 버튼은 ui/Button 을 넣는다(두 개면 나란히, 왼쪽에 글이 필요하면 aside). 위로 흰 그러데이션.
 *
 * yieldTo: 화면 속에 같은 버튼이 있으면 넘긴다. 그 버튼이 스크롤로 올라와 고정 버튼 자리(버튼 윗선)에 닿으면
 * 고정 칸이 숨고, 그 자리 아래로 내려가거나 화면 위로 빠지면 다시 나온다(홈 주문하기 2026-11-17 사용자 「자리 닿을 때」).
 * 두 버튼은 모양·자리가 같아야 하나로 보인다(폭 = 화면 - 좌우 20px).
 */
export default function BottomBar({
  children,
  aside,
  top,
  className,
  id,
  yieldTo,
}: {
  children: React.ReactNode;
  /** 버튼 왼쪽 글(옛 textcombo) */
  aside?: React.ReactNode;
  /** 버튼 위 줄(안내·오류) */
  top?: React.ReactNode;
  className?: string;
  /** 애널리틱스 선택자 등 */
  id?: string;
  /** 화면 속 같은 버튼 — 보이는 동안 고정 칸이 비켜 준다 */
  yieldTo?: HTMLElement | null;
}) {
  const row = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("on");

  // 그리기 전에 한 번 재서 처음부터 겹쳐 있으면 바로 숨긴다(떴다 사라지는 깜빡임 없이). 그 뒤로는 IntersectionObserver.
  useLayoutEffect(() => {
    if (!yieldTo || !row.current) {
      // 화면 속 버튼이 없어지면(상황을 다 풀면) 아래에서 올라오며 다시 나온다
      setMode((m) => (m === "off" ? "back" : m));
      return;
    }
    // 고정 버튼 윗선에서 화면 아래 끝까지 — 주소창이 접혀 화면 높이가 바뀌어도 이 거리는 같다(로그인하면 탭바 63px 포함)
    const below = Math.round(window.innerHeight - row.current.getBoundingClientRect().top);
    const r = yieldTo.getBoundingClientRect();
    if (r.top < window.innerHeight - below && r.bottom > 0) setMode("off");
    const io = new IntersectionObserver(
      ([e]) => {
        const next: Mode = e.isIntersecting ? "off" : e.boundingClientRect.top < 0 ? "back" : "on";
        setMode((m) => ((m === "off") === (next === "off") ? m : next));
      },
      { rootMargin: `0px 0px -${below}px 0px` },
    );
    io.observe(yieldTo);
    return () => io.disconnect();
  }, [yieldTo]);

  return (
    <div
      id={id}
      inert={mode === "off"}
      className={cn("fixed bottom-0 z-30 w-full max-w-[460px]", MODE[mode], className)}
    >
      <div className="h-5 w-full bg-gradient-to-t from-white via-white/60 to-transparent" />
      <div className="bg-white p-5 pt-0">
        {top}
        <div ref={row} className="flex items-center gap-3 [&>*]:flex-1">
          {aside && <div className="min-w-0">{aside}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}
