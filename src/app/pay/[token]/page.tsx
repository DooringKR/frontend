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
