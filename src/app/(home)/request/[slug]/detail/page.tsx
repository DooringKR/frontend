"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BoxedInput from "@/components/Input/BoxedInput";
import ImageUploadInput from "@/components/Input/ImageUploadInput";

import StepShell from "../../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../../_lib/flow";
import { emptyPart, photoStore, useRequestStore } from "../../_lib/requestStore";
import { situationOf } from "../../_lib/situations";

/**
 * 상황 자세히 — 사진(선택), 대략적인 양, 메모.
 * 치수는 받지 않는다 — 실무자가 방문 실측하거나 전화로 실측을 지시해 받는다.
 */
export default function SituationDetailPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const situation = situationOf(slug);
  const hydrated = useHydrated();
  const situations = useRequestStore((s) => s.situations);
  const part = useRequestStore((s) => (situation ? s.parts[situation.slug] : undefined)) ?? emptyPart();
  const setPart = useRequestStore((s) => s.setPart);
  const [photos, setPhotos] = useState<File[]>(() => (situation ? photoStore.get(situation.slug) ?? [] : []));
  const path = `/request/${slug}/detail`;

  useEffect(() => {
    if (hydrated && (!situation || !situations.includes(situation.slug) || part.buttons.length === 0)) router.replace("/request");
  }, [hydrated, situation, situations, part.buttons.length, router]);
  if (!situation) return null;

  return (
    <StepShell
      progress={progressOf(situations, path)}
      title={situation.name}
      subtitle={part.buttons.join(", ")}
      onNext={() => router.push(nextOf(situations, path))}
    >
      <ImageUploadInput
        label="현장 사진"
        placeholder="사진을 첨부해주세요"
        value={photos}
        maxFiles={5}
        onChange={(files) => {
          setPhotos(files);
          photoStore.set(situation.slug, files);
        }}
      />
      <BoxedInput
        label="대략적인 양"
        placeholder="예) 문짝 2장, 하부장 1m"
        value={part.amountNote}
        onChange={(e) => setPart(situation.slug, { amountNote: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
      <BoxedInput
        label="메모"
        value={part.memo}
        onChange={(e) => setPart(situation.slug, { memo: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
    </StepShell>
  );
}
