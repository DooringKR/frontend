"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";

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
  const req = useRequired({ buttons: part.buttons.length > 0 || "하나 이상 골라 주세요" });

  useEffect(() => {
    if (hydrated && (!situation || !situations.includes(situation.slug))) router.replace("/request");
  }, [hydrated, situation, situations, router]);
  if (!situation) return null;

  return (
    <StepShell
      progress={progressOf(situations, path)}
      title={situation.name}
      onNext={() => req.check() && router.push(nextOf(situations, path))}
    >
      <Field fieldRef={req.ref("buttons")} error={req.error("buttons")}>
        <Choose
          multiple
          aria-label={situation.name}
          value={part.buttons}
          onChange={(v) => setPart(situation.slug, { buttons: v })}
          options={situation.buttons.map((b) => ({ value: b, label: b }))}
        />
      </Field>
    </StepShell>
  );
}
