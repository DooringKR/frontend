/**
 * DIY + 바로배송(옛 현장 급한 수습) — 화면 1에서 바로배송은 DIY 와 같이 고를 수 있다(2026-11-12 사용자).
 * DIY 는 예전 품목 주문 흐름(DeliveryOrder·PickUpOrder)을 타므로, 바로배송을 골랐으면 그 주문의 직원 메모(office_memo)에 남긴다.
 */
import { useRequestStore } from "./requestStore";
import { currentFees, feeOf, URGENT_PRICE } from "./fees";
import { URGENT_NAME, URGENT_WHEN } from "./situations";

export function withUrgentMemo<T extends { office_memo?: string }>(order: T): T {
  if (!useRequestStore.getState().urgent) return order;
  // 금액은 노션 「바로배송」 행 — 못 읽었으면 금액 없이 남긴다
  const fee = feeOf(currentFees(), URGENT_PRICE);
  const memo = `${URGENT_NAME} (${fee ? `${fee.toLocaleString("ko-KR")}원, ` : ""}${URGENT_WHEN}) — 상황 주문 화면에서 DIY 로 주문`;
  return { ...order, office_memo: [order.office_memo, memo].filter(Boolean).join("\n") };
}

/** 주문을 넣은 뒤 — 다음 주문에 남지 않게 */
export const clearUrgent = () => useRequestStore.getState().set({ urgent: false });
