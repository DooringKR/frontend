/**
 * DIY + 현장 급한 수습 — 화면 1에서 급한 수습은 DIY 와 같이 고를 수 있다(2026-11-12 사용자).
 * DIY 는 예전 품목 주문 흐름(DeliveryOrder·PickUpOrder)을 타므로, 급한 수습을 골랐으면 그 주문의 직원 메모(office_memo)에 남긴다.
 */
import { useRequestStore } from "./requestStore";
import { URGENT_FEE } from "./situations";

const MEMO = `현장 급한 수습 (${URGENT_FEE.toLocaleString("ko-KR")}원, 3일 이내) — 상황 주문 화면에서 DIY 로 주문`;

export function withUrgentMemo<T extends { office_memo?: string }>(order: T): T {
  if (!useRequestStore.getState().urgent) return order;
  return { ...order, office_memo: [order.office_memo, MEMO].filter(Boolean).join("\n") };
}

/** 주문을 넣은 뒤 — 다음 주문에 남지 않게 */
export const clearUrgent = () => useRequestStore.getState().set({ urgent: false });
