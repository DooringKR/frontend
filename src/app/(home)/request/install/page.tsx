"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";

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
  const req = useRequired({ install: installNeeded !== null });

  useEffect(() => {
    if (hydrated && situations.length === 0) router.replace("/request");
  }, [hydrated, situations.length, router]);

  return (
    <StepShell
      progress={progressOf(situations, path)}
      title="시공도 필요하세요?"
      onNext={() => req.check() && router.push(nextOf(situations, path))}
    >
      <Field fieldRef={req.ref("install")} error={req.error("install")}>
        <Choose
          aria-label="시공 여부"
          value={installNeeded === null ? null : installNeeded ? "yes" : "no"}
          onChange={(v) => set(v === "yes" ? { installNeeded: true } : { installNeeded: false, travelMinutes: null })}
          options={[
            { value: "yes", label: "시공도 필요해요" },
            { value: "no", label: "필요 없어요" },
          ]}
        />
      </Field>
    </StepShell>
  );
}
