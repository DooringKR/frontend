"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Field from "@/components/form/Field";
import PhoneInput from "@/components/form/PhoneInput";
import { useRequired } from "@/components/form/useRequired";
import { Input } from "@/components/ui/input";
import useBizClientStore from "@/store/bizClientStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

import StepShell from "../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";

/**
 * 연락 — 현장 담당자 이름·연락처(현장허브 「담당자 성함·담당자 연락처」), 통화 가능 시간, 출입 정보(선택).
 * 담당자 연락처는 처음엔 주문자 번호를 넣어 둔다 — 주문자가 곧 담당자인 경우가 많다.
 */
export default function ContactPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const myPhone = useBizClientStore((b) => b.bizClient?.phone_number ?? "");
  const path = "/request/contact";

  useEffect(() => {
    if (!hydrated) return;
    if (s.situations.length === 0 || !s.roadAddress) router.replace("/request");
    else if (!s.contactPhone && myPhone) s.set({ contactPhone: formatPhoneNumber(myPhone) });
    // 처음 한 번만 채운다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // 통화 가능 시간·출입 정보는 선택(개인정보 처리방침 제5조 선택항목과 같게)
  const req = useRequired({
    name: !!s.contactName.trim(),
    phone: !s.contactPhone.trim() ? false : s.contactPhone.replace(/\D/g, "").length >= 10 || "전화번호를 확인해 주세요",
  });

  return (
    <StepShell
      progress={progressOf(s.situations, path)}
      title="현장 담당자를 알려주세요"
      onNext={() => req.check() && router.push(nextOf(s.situations, path))}
    >
      <Field label="담당자 이름" required fieldRef={req.ref("name")} error={req.error("name")}>
        <Input aria-invalid={!!req.error("name")} value={s.contactName} onChange={(e) => s.set({ contactName: e.target.value })} />
      </Field>
      <Field label="담당자 연락처" required fieldRef={req.ref("phone")} error={req.error("phone")}>
        <PhoneInput aria-invalid={!!req.error("phone")} value={s.contactPhone} onChange={(v) => s.set({ contactPhone: v })} />
      </Field>
      <Field label="통화 가능 시간 (선택)">
        <Input placeholder="예) 평일 오전, 오후 2시 이후" value={s.callTime} onChange={(e) => s.set({ callTime: e.target.value })} />
      </Field>
      <Field label="출입 정보 (선택)">
        <Input placeholder="예) 공동현관 #1234, 현관 5678" value={s.accessInfo} onChange={(e) => s.set({ accessInfo: e.target.value })} />
      </Field>
    </StepShell>
  );
}
