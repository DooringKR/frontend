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
import { nextPathOf, phoneOk, useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";

/**
 * 수령인 — 이름·연락처(어드민이 현장허브 「수령인 성함·수령인 연락처」로 옮긴다, 2026-11-13), 통화 가능 시간, 출입 정보(선택).
 * 키친 AS 에는 담당자가 없다 — 「담당자」라고 쓰지 말 것. 수령인 연락처는 처음엔 주문자 번호를 넣어 둔다.
 * 출입 정보는 기기에 남기지 않는다(requestStore partialize). 완료 판정은 flow.ts doneOf.recipient 와 같다.
 */
export default function ContactPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const myPhone = useBizClientStore(b => b.bizClient?.phone_number ?? "");

  useEffect(() => {
    if (hydrated && !s.contactPhone && myPhone) s.set({ contactPhone: formatPhoneNumber(myPhone) });
    // 처음 한 번만 채운다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // 통화 가능 시간·출입 정보는 선택(개인정보 처리방침 제5조 선택항목과 같게)
  const req = useRequired({
    name: !!s.contactName.trim(),
    phone: !s.contactPhone.trim() ? false : phoneOk(s.contactPhone) || "전화번호를 확인해 주세요",
  });

  return (
    <StepShell
      step="recipient"
      title="수령인을 알려주세요"
      onNext={() => req.check() && router.push(nextPathOf("recipient"))}
    >
      <Field label="수령인 이름" fieldRef={req.ref("name")}>
        <Input
          aria-invalid={!!req.error("name")}
          value={s.contactName}
          onChange={e => s.set({ contactName: e.target.value })}
        />
      </Field>
      <Field label="수령인 연락처" fieldRef={req.ref("phone")}>
        <PhoneInput
          aria-invalid={!!req.error("phone")}
          value={s.contactPhone}
          onChange={v => s.set({ contactPhone: v })}
        />
      </Field>
      <Field label="통화 가능 시간 (선택)">
        <Input
          placeholder="예) 평일 오전, 오후 2시 이후"
          value={s.callTime}
          onChange={e => s.set({ callTime: e.target.value })}
        />
      </Field>
      <Field label="출입 정보 (선택)">
        <Input
          placeholder="예) 공동현관 #1234, 현관 5678"
          value={s.accessInfo}
          onChange={e => s.set({ accessInfo: e.target.value })}
        />
      </Field>
    </StepShell>
  );
}
