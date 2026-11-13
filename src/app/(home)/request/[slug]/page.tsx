"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import ChoiceCard from "../_components/ChoiceCard";
import StepShell from "../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../_lib/flow";
import { emptyPart, useRequestStore } from "../_lib/requestStore";
import { situationOf } from "../_lib/situations";

/** 화면 2 — 화면 1에서 고른 상황 하나의 버튼. 한 상황 안에서 여러 개 고를 수 있다 */
export default function SituationPickPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const situation = situationOf(slug);
  const hydrated = useHydrated();
  const situations = useRequestStore((s) => s.situations);
  const part = useRequestStore((s) => (situation ? s.parts[situation.slug] : undefined)) ?? emptyPart();
  const setPart = useRequestStore((s) => s.setPart);
  const path = `/request/${slug}`;

  useEffect(() => {
    if (hydrated && (!situation || !situations.includes(situation.slug))) router.replace("/request");
  }, [hydrated, situation, situations, router]);
  if (!situation) return null;

  const toggle = (b: string) => {
    const cur = useRequestStore.getState().parts[situation.slug]?.buttons ?? [];
    setPart(situation.slug, { buttons: cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b] });
  };

  return (
    <StepShell
      progress={progressOf(situations, path)}
      title={situation.name}
      nextDisabled={part.buttons.length === 0}
      onNext={() => router.push(nextOf(situations, path))}
    >
      {situation.buttons.map((b) => (
        <ChoiceCard key={b} title={b} checked={part.buttons.includes(b)} onClick={() => toggle(b)} />
      ))}
    </StepShell>
  );
}
