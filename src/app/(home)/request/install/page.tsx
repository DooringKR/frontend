"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ChoiceCard from "../_components/ChoiceCard";
import StepShell from "../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";

/** 시공 여부 — 구 바로가구 품목 화면의 「시공도 필요해요 / 필요 없어요」를 주문 단위로 한 번 */
export default function InstallPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const situations = useRequestStore((s) => s.situations);
  const installNeeded = useRequestStore((s) => s.installNeeded);
  const set = useRequestStore((s) => s.set);
  const path = "/request/install";

  useEffect(() => {
    if (hydrated && situations.length === 0) router.replace("/request");
  }, [hydrated, situations.length, router]);

  return (
    <StepShell
      progress={progressOf(situations, path)}
      title="시공도 필요하세요?"
      nextDisabled={installNeeded === null}
      onNext={() => router.push(nextOf(situations, path))}
    >
      <ChoiceCard title="시공도 필요해요" checked={installNeeded === true} onClick={() => set({ installNeeded: true })} />
      <ChoiceCard
        title="필요 없어요"
        checked={installNeeded === false}
        onClick={() => set({ installNeeded: false, travelMinutes: null })}
      />
    </StepShell>
  );
}
