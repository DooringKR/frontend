/**
 * 상황 주문 화면 차례 — 화면 1 → 고른 상황마다 (고르기 → 자세히) → 시공 여부 → 현장 → 연락 → 일정 → 확인.
 * 상황 페이지는 SITUATIONS 차례로 이어진다(고른 차례와 상관없이).
 */
import { useEffect, useState } from "react";

import type { ProgressValue } from "@/components/Progress/ProgressBar";

import { useRequestStore } from "./requestStore";
import { SITUATIONS, type SituationSlug } from "./situations";

export function stepsOf(situations: SituationSlug[]): string[] {
  const picked = SITUATIONS.filter((s) => situations.includes(s.slug));
  return [
    "/request",
    ...picked.flatMap((s) => [`/request/${s.slug}`, `/request/${s.slug}/detail`]),
    "/request/install",
    "/request/site",
    "/request/contact",
    "/request/schedule",
    "/request/confirm",
  ];
}

export function nextOf(situations: SituationSlug[], path: string): string {
  const steps = stepsOf(situations);
  return steps[steps.indexOf(path) + 1] ?? "/request/confirm";
}

/** 진행 막대는 20 단위만 받는다 */
export function progressOf(situations: SituationSlug[], path: string): ProgressValue {
  const steps = stepsOf(situations);
  const at = Math.max(0, steps.indexOf(path)) + 1;
  return (Math.max(1, Math.round((at / steps.length) * 5)) * 20) as ProgressValue;
}

/** 탭에 둔 입력값을 다 읽었는지 — 읽기 전에 「고른 게 없다」고 첫 화면으로 돌려보내지 않게 */
export function useHydrated(): boolean {
  const [done, setDone] = useState(() => useRequestStore.persist.hasHydrated());
  useEffect(() => {
    if (done) return;
    const off = useRequestStore.persist.onFinishHydration(() => setDone(true));
    setDone(useRequestStore.persist.hasHydrated());
    return off;
  }, [done]);
  return done;
}
