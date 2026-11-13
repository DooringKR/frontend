"use client";

import { useCallback, useRef, useState } from "react";

export const REQUIRED_MESSAGE = "필수 항목입니다";

/**
 * 필수값 확인 — 바로키친 어드민 form/useRequired 와 같은 규칙(2026-10-30, 바로가구 2026-11-13).
 * 다음·저장 버튼은 늘 눌리고, 누르면 첫 빈 칸으로 옮겨 가 그 칸 밑에 알림을 띄운다. 버튼은 보내는 중에만 막는다.
 *
 * rules 값: true = 됨, false = 비었음(「필수 항목입니다」), 글자 = 틀림(그 글자를 알림으로). 화면 위에서 아래 순서로 적는다.
 * 한 번 누른 뒤에는 칸을 고치는 즉시 알림이 사라진다.
 *
 *   const req = useRequired({ name: !!name.trim(), phone: phone.length >= 10 || "전화번호를 확인해 주세요" });
 *   <Field label="이름" required fieldRef={req.ref("name")} error={req.error("name")}>…</Field>
 *   onNext={() => req.check() && go()}
 */
export function useRequired<K extends string>(rules: Record<K, boolean | string>) {
  const refs = useRef<Partial<Record<K, HTMLElement | null>>>({});
  const [tried, setTried] = useState(false);
  const reset = useCallback(() => setTried(false), []);
  const problem = (k: K): string | undefined => {
    const v: boolean | string = rules[k];
    if (v === true) return undefined;
    return v === false ? REQUIRED_MESSAGE : v;
  };
  return {
    ref: (k: K) => (el: HTMLElement | null) => {
      refs.current[k] = el;
    },
    error: (k: K) => (tried ? problem(k) : undefined),
    /** 다 됐으면 true. 문제가 있으면 첫 문제 칸으로 옮겨 가고 false. */
    check: () => {
      setTried(true);
      const first = (Object.keys(rules) as K[]).find((k) => problem(k) !== undefined);
      if (first == null) return true;
      focusField(refs.current[first]);
      return false;
    },
    reset,
  };
}

/** 칸을 화면 가운데로 올리고 안의 첫 입력(없으면 버튼)에 포커스 */
export function focusField(el: HTMLElement | null | undefined) {
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  const target = el.matches("input, textarea, select, button, a[href]")
    ? el
    : el.querySelector<HTMLElement>(
        "input:not([type=hidden]):not([type=file]):not([disabled]), textarea, select, button:not([disabled]), a[href]",
      );
  target?.focus({ preventScroll: true });
}
