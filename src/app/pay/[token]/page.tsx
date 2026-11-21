import type { Metadata } from "next";

import { EmptyState, ErrorBanner } from "@/components/state/StateViews";
import { fetchPay, type PayInfo } from "@/lib/pay";

import PayClient from "./PayClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * 결제 요청 링크 — 관리자가 바로키친 어드민 /payments 에서 만든 링크로 로그인 없이 연다(2026-11-16).
 * 서버에서 읽을 때마다 어드민이 포트원에 다시 물어 맞춘다 — 모바일 결제창은 이 주소로 돌아오고(redirectUrl),
 * 실패·취소면 포트원이 code·message 를 붙인다.
 *
 * 상태(2026-11-17 보류): NHN KCP 가 이 방식(관리자가 금액을 정해 보내는 링크)을 개인결제창으로 보고 이용 불가라고 답해
 * KCP 상품추가 심사를 멈췄다. 운영 env 의 채널 키는 포트원 테스트 채널이라 여기서 결제해도 실제 돈은 들어오지 않는다.
 * 당분간 대금은 알림톡 「송금 요청」(계좌 송금)으로 받는다. 이유·다시 열 때 할 일은 dooring-admin PR 「KCP 카드 결제 심사 보류 기록」.
 */
export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ code?: string; message?: string }>;
}) {
  const [{ token }, sp] = await Promise.all([params, searchParams]);
  const { status, body } = await fetchPay(token);
  if (status === 404) return <EmptyState text="없는 결제 링크예요" className="min-h-screen" />;
  if ("error" in body)
    return (
      <div className="p-5">
        <ErrorBanner text={body.error} />
      </div>
    );
  return <PayClient token={token} initial={body as PayInfo} redirectError={sp.code ? sp.message || "결제가 되지 않았어요." : null} />;
}
