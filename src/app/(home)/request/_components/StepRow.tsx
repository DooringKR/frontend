"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { doneOf, firstIncompleteIndex, STEPS, type StepKey } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";

/**
 * 단계 줄 — 진행 막대 대신 늘 보이는 단계 4칸(2026-11-13 QA). 위 바(TopNavigator) 바로 밑에 붙는다.
 * 첫 미완료 단계와 그 앞(끝난 단계)만 누를 수 있다 — 그 뒤는 끝났어도 막는다(StepShell 이 첫 미완료로 돌려보내니까). 「상황 입력」은 슬라이드 첫 장으로 간다(/request?from=steps → 화면 1이 안내 토스트).
 * highlight(확인 화면에서 막힌 주문하기를 눌렀을 때): 덜 끝난 단계는 빨간 Badge, 첫 미완료 단계에 Tooltip.
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

  return (
    <TooltipProvider>
      <nav aria-label="단계" className="fixed top-[60px] z-40 flex h-[52px] w-full max-w-[460px] items-center gap-1.5 bg-white px-5">
        {STEPS.map((x, i) => {
          const red = highlight && !done[x.key];
          const here = x.key === current;
          const chip = (
            <Button
              key={x.key}
              variant="ghost"
              size="sm"
              disabled={i > first}
              aria-current={here ? "step" : undefined}
              onClick={() =>
                x.key !== "situation" ? router.push(x.path) : onPickSituation ? onPickSituation() : router.push("/request?from=steps")
              }
              className="h-auto p-0 hover:bg-transparent disabled:opacity-40"
            >
              <Badge
                color={red ? "red" : here || done[x.key] ? "blue" : "gray"}
                weight={here && !red ? "strong" : "weak"}
                className="gap-1 whitespace-nowrap"
              >
                {done[x.key] && <Check className="size-3.5" />}
                {x.label}
              </Badge>
            </Button>
          );
          return red && i === first ? (
            <Tooltip key={x.key} open>
              <TooltipTrigger asChild>{chip}</TooltipTrigger>
              <TooltipContent side="bottom">입력이 안 끝났어요</TooltipContent>
            </Tooltip>
          ) : (
            chip
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
