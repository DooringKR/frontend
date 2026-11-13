"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import BoxedInput from "@/components/Input/BoxedInput";
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

  const ready = !!s.contactName.trim() && s.contactPhone.replace(/\D/g, "").length >= 10 && !!s.callTime.trim();

  return (
    <StepShell
      progress={progressOf(s.situations, path)}
      title="현장 담당자를 알려주세요"
      nextDisabled={!ready}
      onNext={() => router.push(nextOf(s.situations, path))}
    >
      <BoxedInput
        label="담당자 이름"
        value={s.contactName}
        onChange={(e) => s.set({ contactName: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
      <BoxedInput
        label="담당자 연락처"
        type="tel"
        placeholder="010-0000-0000"
        value={s.contactPhone}
        onChange={(e) => s.set({ contactPhone: formatPhoneNumber(e.target.value) })}
        placeholderClassName="placeholder-gray-500"
      />
      <BoxedInput
        label="통화 가능 시간"
        placeholder="예) 평일 오전, 오후 2시 이후"
        value={s.callTime}
        onChange={(e) => s.set({ callTime: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
      <BoxedInput
        label="출입 정보 (선택)"
        placeholder="예) 공동현관 #1234, 현관 5678"
        value={s.accessInfo}
        onChange={(e) => s.set({ accessInfo: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
    </StepShell>
  );
}
