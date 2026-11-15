/**
 * 상황 주문 이벤트(2026-11-15) — 이름은 「Request + 대상 + 과거형」, 속성은 snake_case.
 * 모든 이벤트에 지금 주문 상태(급한 수습·고른 상황·시공 여부·로그인)를 붙여 퍼널을 나눠 볼 수 있게 한다.
 * 보내는 곳: StepShell(Step Viewed·Next Clicked·Order Clicked), StepRow(Step Jumped),
 * 상황 입력 화면(Draft Answered·Photo Uploaded·Branch Chosen), 확인 화면(Submitted).
 */
import { track } from "@/services/analytics/amplitude";
import useBizClientStore from "@/store/bizClientStore";

import { useRequestStore } from "./requestStore";

export function trackRequest(name: string, props: Record<string, unknown> = {}) {
  const s = useRequestStore.getState();
  track(`Request ${name}`, {
    urgent: s.urgent,
    situations: s.situations,
    install_needed: s.installNeeded,
    logged_in: !!useBizClientStore.getState().bizClient,
    ...props,
  });
}
