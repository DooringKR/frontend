"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { doneOf, firstIncompleteIndex, STEPS, type StepKey } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";
import { trackRequest } from "../_lib/track";

/**
 * 단계 줄 — 번호 원 + 잇는 선 + 이름(2026-11-15 사용자 「A로」, 칩처럼 보여서 단계처럼). 위 바(TopNavigator) 바로 밑에 붙는다.
 * shadcn 에 스테퍼가 없어 Button·Tooltip 으로 짰다 — 누르면 화면(경로)이 바뀌는 단계 이동이라 Tabs(같은 화면 패널 바꾸기)보다 뜻이 맞다.
 * 원 안: 끝남 ✓(파랑 채움) · 지금 번호(파랑 테두리 + 옅은 고리) · 아직 번호 · 덜 끝남 !(빨강). 선은 지나온 데까지 파랑.
 * 누르기: 끝난 단계와 첫 미완료 단계만(진한 테두리) — 그 뒤는 끝났어도 막는다(연한 회색, StepShell 이 첫 미완료로 돌려보내니까).
 * 「상황 입력」은 슬라이드 첫 장으로 간다(/request?from=steps). 누르는 칸은 원 + 이름 전체(높이 48px).
 * highlight(막힌 주문하기를 눌렀을 때): 덜 끝난 단계는 빨간 !, 첫 미완료 단계에 Tooltip.
 */
export default function StepRow({
  current,
  highlight = false,
  onPickSituation,
}: {
  current: StepKey | null;
  highlight?: boolean;
  /** 화면 1 안에서 누르면 이동 대신 첫 장으로 */
  onPickSituation?: () => void;
}) {
  const router = useRouter();
  const s = useRequestStore();
  const done = doneOf(s);
  const first = firstIncompleteIndex(s);
  const at = STEPS.findIndex(x => x.key === current);

  return (
    <TooltipProvider>
      <nav aria-label="단계" className="fixed top-[60px] z-40 flex h-[52px] w-full max-w-[460px] items-center bg-white px-4">
        {STEPS.map((x, i) => {
          const red = highlight && !done[x.key];
          const here = i === at;
          const locked = i > first;
          const step = (
            <Button
              variant="ghost"
              disabled={locked}
              aria-current={here ? "step" : undefined}
              onClick={() => {
                trackRequest("Step Jumped", { from: current ?? "confirm", to: x.key });
                if (x.key !== "situation") router.push(x.path);
                else if (onPickSituation) onPickSituation();
                else router.push("/request?from=steps");
              }}
              className={cn(
                // 올림(hover) 바탕은 뺀다 — 휴대폰은 누른 뒤에도 올림 상태가 남아 회색 칸이 붙어 있었다. 누르는 순간만 어둡게
                "h-12 w-16 shrink-0 flex-col gap-1 rounded-[10px] px-0 py-1 hover:bg-transparent active:bg-muted disabled:opacity-100",
                locked && red && "disabled:opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex size-[22px] items-center justify-center rounded-full border-[1.5px] bg-white text-[12px] font-700",
                  red
                    ? "border-destructive bg-red-50 text-destructive"
                    : done[x.key]
                      ? "border-primary bg-primary text-white"
                      : here
                        ? "border-primary text-primary"
                        : locked
                          ? "border-gray-200 text-gray-300"
                          : "border-gray-700 text-gray-700",
                  here && !red && "ring-4 ring-accent",
                )}
              >
                {red ? "!" : done[x.key] ? <Check strokeWidth={3.5} style={{ width: 12, height: 12 }} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[12px] leading-4",
                  red ? "font-700 text-destructive" : here ? "font-700 text-primary" : locked ? "font-500 text-gray-300" : "font-500 text-gray-700",
                )}
              >
                {x.label}
                <span className="sr-only">{done[x.key] ? " 끝남" : red ? " 입력 안 끝남" : ""}</span>
              </span>
            </Button>
          );
          return (
            <Fragment key={x.key}>
              {red && i === first ? (
                <Tooltip open>
                  <TooltipTrigger asChild>{step}</TooltipTrigger>
                  <TooltipContent side="bottom">입력이 안 끝났어요</TooltipContent>
                </Tooltip>
              ) : (
                step
              )}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    // 원 가운데 높이에 맞춤(줄 가운데에서 9px 위 — 2026-11-15 실측: 원 76·선 76)
                    "mt-[-20px] h-0.5 min-w-2 flex-1 rounded-full",
                    i < at || (done[x.key] && done[STEPS[i + 1].key]) ? "bg-primary" : "bg-gray-200",
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
