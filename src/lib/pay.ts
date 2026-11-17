/**
 * 결제 요청 링크(/pay/[token]) — 바로키친 어드민 GET /api/barogagu/pay 를 서버에서 부른다.
 * 어드민이 부를 때마다 포트원에 결제 상태·금액을 다시 물어 적고 지금 상태를 돌려준다(결제창 결과는 믿지 않는다).
 * 포트원 비밀값·DB 는 어드민에만 있다 — 여기는 전달만 한다(주문 접수 /api/request/submit 와 같은 길).
 */
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "https://dooring-admin.vercel.app";

export interface PayInfo {
  label: string;
  amount: number;
  status: "open" | "paid" | "canceled" | "mismatch";
  paidAt: string | null;
  test: boolean;
  /** 포트원 paymentId — 요청마다 하나로 고정 */
  paymentId: string;
  /** 그 현장에서 마지막으로 보낸 견적서 — 품목 줄과 고객 견적서 합계. 없으면 null */
  quote: { items: { name: string; quantity: number | null; unit: string | null; amount: number }[]; total: number | null } | null;
}

export async function fetchPay(token: string): Promise<{ status: number; body: PayInfo | { error: string } }> {
  try {
    const res = await fetch(`${ADMIN_ORIGIN}/api/barogagu/pay?id=${encodeURIComponent(token)}`, { cache: "no-store" });
    return { status: res.status, body: await res.json() };
  } catch {
    return { status: 502, body: { error: "결제 서버에 연결하지 못했어요." } };
  }
}
