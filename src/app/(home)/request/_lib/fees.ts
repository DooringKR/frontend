/**
 * 키친 AS 금액 — 노션 단가 라이브러리 한 곳에서 읽는다(2026-11-18 사용자 「금액은 한 곳으로」).
 * 어드민 DB 함수 kitchen_as_prices()(0149)가 「키친 AS」 도메인이 고른 대분류의 단가만 준다(로그인 전에도).
 * 행 이름으로 찾는다 — 상황 이름(문짝 교체 · 설치·가구 교체)·바로배송·DIY(셀프 주문)·출장비. 어드민 견적서도 같은 행을 쓴다.
 * 못 읽으면 금액을 보이지 않는다(틀린 금액보다 빈칸이 낫다) — 그때 주문의 출장비는 비워 두고 어드민이 거리로 다시 매긴다.
 */
import { useEffect } from "react";
import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export const URGENT_PRICE = "바로배송";
export const DIY_PRICE = "DIY(셀프 주문)";
export const TRAVEL_PRICE = "출장비";

/**
 * 출장비 규칙 — 「출장비」 행: 단가 = 무료 시간을 넘긴 뒤 한 칸마다 붙는 금액, 규격 = 「35분 무료 · 15분마다」.
 * 어드민 `lib/barogagu/travelFee.ts` 와 같은 읽기(형식을 바꾸면 두 곳을 같이).
 */
export interface TravelRule {
  freeMinutes: number;
  stepMinutes: number;
  stepFee: number;
}

export function parseTravelRule(spec: string | null | undefined, unitPrice: number | null | undefined): TravelRule | null {
  const m = /(\d+)\s*분\s*무료\D+?(\d+)\s*분\s*마다/.exec(spec ?? "");
  if (!m || unitPrice == null) return null;
  const rule = { freeMinutes: Number(m[1]), stepMinutes: Number(m[2]), stepFee: unitPrice };
  return rule.stepMinutes > 0 ? rule : null;
}

export function travelFeeOf(rule: TravelRule, minutes: number): number {
  if (minutes <= rule.freeMinutes) return 0;
  return Math.ceil((minutes - rule.freeMinutes) / rule.stepMinutes) * rule.stepFee;
}

export interface Fees {
  /** 행 이름 → 단가(원). DIY 할인은 음수 그대로 */
  byName: Record<string, number>;
  travel: TravelRule | null;
}

type FeesState = { fees: Fees | null; load: () => void };

let loading = false;

export const useFeesStore = create<FeesState>()((set, get) => ({
  fees: null,
  load: () => {
    if (get().fees || loading) return;
    loading = true;
    void supabase
      .rpc("kitchen_as_prices")
      .then(({ data, error }) => {
        loading = false;
        if (error || !data) {
          console.error("[fees] 키친 AS 단가를 못 읽음", error);
          return;
        }
        const rows = data as Array<{ name: string; spec: string | null; unit_price: number | null }>;
        const byName: Record<string, number> = {};
        for (const r of rows) if (r.unit_price != null) byName[r.name.trim()] = r.unit_price;
        const t = rows.find((r) => r.name.trim() === TRAVEL_PRICE);
        set({ fees: { byName, travel: t ? parseTravelRule(t.spec, t.unit_price) : null } });
      });
  },
}));

/** 화면에서 — 처음 부르면 읽기 시작하고, 읽기 전·못 읽으면 null */
export function useFees(): Fees | null {
  const fees = useFeesStore((s) => s.fees);
  const load = useFeesStore((s) => s.load);
  useEffect(load, [load]);
  return fees;
}

/** 이름의 단가 — 없거나 0이면 null(칩·비용 줄을 안 보인다) */
export const feeOf = (fees: Fees | null, name: string): number | null => {
  const v = fees?.byName[name];
  return v ? v : null;
};

/**
 * 출장비 — 시공기사가 필요할 때만, 공장→현장 편도(분, 주문할 때 네이버 경로 실시간)로.
 * 규칙을 못 읽거나 분을 모르면 null — 어드민 견적서가 현장 거리로 다시 매긴다.
 */
export const travelFee = (fees: Fees | null, minutes: number | null): number | null =>
  fees?.travel && minutes != null ? travelFeeOf(fees.travel, minutes) : null;

/** 화면 밖(주문 저장·DIY 메모)에서 — 지금 읽혀 있는 값 */
export const currentFees = () => useFeesStore.getState().fees;
