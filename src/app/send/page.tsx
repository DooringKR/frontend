import type { Metadata } from "next";

import { parseAmount } from "@/lib/transfer";

import SendClient from "./SendClient";

export const metadata: Metadata = { title: "입금 안내", robots: { index: false, follow: false } };

/**
 * 입금 안내 — /send?amount=150000 (2026-11-18 사용자 「직원이 매번 수동으로 보내는 방식, 고객 편의가 중요」).
 * 실무자가 어드민 「입금 요청 문구」를 채널 채팅에 붙여 보내면, 고객이 이 주소를 눌러 송금 앱을 연다.
 * 카톡 채팅에서는 토스 앱 주소(supertoss://)가 눌리지 않아 이 화면의 버튼을 한 번 거친다. 로그인은 없다.
 */
export default async function SendPage({ searchParams }: { searchParams: Promise<{ amount?: string }> }) {
  const { amount } = await searchParams;
  return <SendClient amount={parseAmount(amount)} />;
}
