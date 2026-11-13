/**
 * 상황 주문 단계 줄(2026-11-13 QA) — 상황 입력(화면 1·2·3을 슬라이드 3장으로) / 시공 여부(시공 여부+일정) / 현장 정보 / 수령인.
 * 확인 화면은 단계 줄에 없다. 끝난 단계와 첫 미완료 단계만 누를 수 있고, 그 뒤는 막는다.
 * 완료 판정은 각 화면의 useRequired 규칙과 같아야 한다 — 바꾸면 둘 다.
 */
import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useEffect, useState } from "react";

import { useRequestStore, type ReceiveInput, type RequestState } from "./requestStore";

export type StepKey = "situation" | "install" | "site" | "recipient";

export const STEPS: { key: StepKey; label: string; path: string }[] = [
  { key: "situation", label: "상황 입력", path: "/request" },
  { key: "install", label: "시공 여부", path: "/request/install" },
  { key: "site", label: "현장 정보", path: "/request/site" },
  { key: "recipient", label: "수령인", path: "/request/contact" },
];

export const CONFIRM_PATH = "/request/confirm";

export const phoneOk = (phone: string) => phone.replace(/\D/g, "").length >= 10;

export function receiveDone(r: ReceiveInput | null): boolean {
  if (!r?.date) return false;
  return r.method === "delivery"
    ? !!r.deliveryMethod && (r.deliveryMethod !== DeliveryMethod.DIRECT_INPUT || !!r.deliveryMethodInput?.trim())
    : !!r.vehicle && (r.vehicle !== VehicleType.DIRECT_INPUT || !!r.vehicleInput?.trim());
}

export function doneOf(s: RequestState): Record<StepKey, boolean> {
  return {
    situation: s.situations.length > 0 && s.situations.every((x) => (s.parts[x]?.buttons.length ?? 0) > 0),
    install:
      s.installNeeded === null ? false : s.installNeeded ? s.urgent || !!s.preferredDate : receiveDone(s.receive),
    site:
      !!s.roadAddress &&
      !!s.buildingType &&
      !!s.pyeong.trim() &&
      (!s.installNeeded || (s.parking !== null && s.elevator !== null)),
    recipient: !!s.contactName.trim() && phoneOk(s.contactPhone),
  };
}

/** 첫 미완료 단계 차례(0~3), 다 됐으면 STEPS.length */
export function firstIncompleteIndex(s: RequestState): number {
  const done = doneOf(s);
  const i = STEPS.findIndex((x) => !done[x.key]);
  return i < 0 ? STEPS.length : i;
}

/** 이 탭에서 「이어서 하기」를 이미 물었는지(또는 물을 필요가 없었는지) */
const ASKED_KEY = "situation-request-asked";
export const askedDraft = () => {
  try {
    return sessionStorage.getItem(ASKED_KEY) === "1";
  } catch {
    return true;
  }
};
export const markAskedDraft = () => {
  try {
    sessionStorage.setItem(ASKED_KEY, "1");
  } catch {
    // 못 적으면 다음에 한 번 더 묻는 것뿐
  }
};

/** 다음 단계 화면(마지막 단계 다음은 확인) */
export const nextPathOf = (key: StepKey) => STEPS[STEPS.findIndex((x) => x.key === key) + 1]?.path ?? CONFIRM_PATH;

/**
 * 기기에 둔 입력값을 다 읽었는지 — 읽기 전에 「안 끝났다」고 다른 화면으로 돌려보내지 않게.
 * 화면을 처음 그릴 때(서버 미리 그리기·hydration)는 스토어가 빈 처음 값을 주므로, 그린 뒤(effect)에만 true 가 된다.
 */
export function useHydrated(): boolean {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const p = useRequestStore.persist;
    if (!p) return;
    if (p.hasHydrated()) {
      setDone(true);
      return;
    }
    return p.onFinishHydration(() => setDone(true));
  }, []);
  return done;
}
