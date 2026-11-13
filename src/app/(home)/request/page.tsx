"use client";

import { useRouter } from "next/navigation";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import NavRow from "@/components/nav/NavRow";
import { Separator } from "@/components/ui/separator";

import StepShell from "./_components/StepShell";
import { nextOf, progressOf } from "./_lib/flow";
import { useRequestStore } from "./_lib/requestStore";
import { SITUATIONS, type SituationSlug } from "./_lib/situations";

/**
 * 화면 1 — 구분선으로 나눈 세 묶음(2026-11-12 사용자).
 *  - 현장 급한 수습: 강조. 고르면 15만 원만 더하고 다음 페이지는 없다. 어느 묶음과도 같이 고른다.
 *  - 부분가구 추가 · 문짝 교체 또는 설치 · 장 일부 또는 전체 교체: 서로 같이 고른다. 고른 것마다 다음 단계 페이지가 생긴다.
 *  - DIY · 자재 필요없는 수리: 다른 묶음과도, 서로도 같이 못 고른다(급한 수습만 같이). 누르면 바로 다음 화면.
 */
export default function RequestStartPage() {
  const router = useRouter();
  const urgent = useRequestStore((s) => s.urgent);
  const situations = useRequestStore((s) => s.situations);
  const set = useRequestStore((s) => s.set);
  const picked = situations.length > 0;
  const req = useRequired({ situations: picked || "상황을 하나 이상 골라 주세요" });

  return (
    <StepShell
      progress={progressOf(situations, "/request")}
      title="어떤 상황인가요?"
      onNext={() => req.check() && router.push(nextOf(situations, "/request"))}
    >
      <Choose
        multiple
        aria-label="현장 급한 수습"
        value={urgent ? ["urgent"] : []}
        onChange={(v) => set({ urgent: v.includes("urgent") })}
        options={[
          {
            value: "urgent",
            label: "현장 급한 수습",
            emphasized: true,
            description: (
              <>
                3일 이내 · 15만 원 추가
                <br />
                현장에 부족한 자재·가구 추가
                <br />
                현장 가구 사이즈나 사양이 안 맞을 때
              </>
            ),
          },
        ]}
      />
      <Separator className="bg-gray-100" />
      <Field fieldRef={req.ref("situations")} error={req.error("situations")}>
        <Choose<SituationSlug>
          multiple
          aria-label="상황"
          value={situations}
          onChange={(v) => set({ situations: v })}
          options={SITUATIONS.map((s) => ({ value: s.slug, label: s.name }))}
        />
      </Field>
      <Separator className="bg-gray-100" />
      <NavRow card label="DIY(셀프 주문)" disabled={picked} onClick={() => router.push("/diy")} />
      <NavRow card label="자재 필요없는 수리" disabled={picked} onClick={() => router.push("/request/not-served")} />
    </StepShell>
  );
}
