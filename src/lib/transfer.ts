/**
 * 도어링 입금 계좌와 계좌·금액을 채운 송금 화면 링크(2026-11-18).
 * 키친 AS 대금 계좌 — 바로키친 어드민 고객 견적서·허브 결제 칸(dooring_hub lib/brand.ts)과 같은 값이다. 바뀌면 함께 고친다.
 * (구 바로키친 AS DIY 주문 계좌 `(home)/order/_lib/order.ts` BANK_ACCOUNT 와는 다른 계좌)
 *
 * 링크 형식은 토스·카카오페이가 공식 문서로 낸 것이 아니라 여러 서비스가 쓰는 주소다.
 * 삼성 폰 카카오톡 브라우저에서 둘 다 계좌·금액이 채워진 송금 화면이 열리는 것을 확인했다(토스는 앱 잠금 인증 뒤).
 */
export const TRANSFER_BANK = {
  bank: "IBK기업은행",
  /** 금융결제원 은행 코드 */
  code: "003",
  number: "069-131755-04-045",
  holder: "(주)도어링",
} as const;

const DIGITS = TRANSFER_BANK.number.replace(/\D/g, "");

/** 금액이 없으면(null) 계좌만 채운다 */
const amountPart = (amount: number | null) => (amount ? `&amount=${amount}` : "");

export const kakaopaySendUrl = (amount: number | null) =>
  `https://link.kakaopay.com/t/money/to/bank?bank_code=${TRANSFER_BANK.code}&bank_account_number=${DIGITS}${amountPart(amount)}`;

export const tossSendUrl = (amount: number | null) =>
  `supertoss://send?bankCode=${TRANSFER_BANK.code}&accountNo=${DIGITS}${amountPart(amount)}&origin=qr`;

/** 주소의 ?amount= — 1원 이상 10억 원 이하 정수만 받는다(아니면 금액 없이) */
export function parseAmount(raw: string | undefined): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 && n <= 1_000_000_000 ? n : null;
}
