/** 주문(배송·픽업) 화면이 같이 쓰는 값·도우미 */

import { goBack } from "@/lib/nav/go";

/** 도어링 공장(픽업 주소) — 받는 방법 시트·픽업 화면·픽업 완료 화면이 같은 글을 복사한다 */
export const FACTORY_ADDRESS = "경기도 남양주시 오남읍 양지로139번길 11-14";
export const BANK_ACCOUNT = "IBK기업은행 52307836904011";
export const CS_TEL = "tel:031-528-4002";
export const KAKAO_CHANNEL = "https://pf.kakao.com/_BlAHG";

/* ── 날짜·시각: store 에는 Date(로컬 시각) 그대로, 칸에는 'YYYY-MM-DD'·'HH:MM' ── */

const pad = (n: number) => String(n).padStart(2, "0");
/** store 값(Date, 새로고침 뒤엔 ISO 글자)을 Date 로 */
export const toDate = (v: unknown): Date | null => (v ? new Date(v as string) : null);
export const ymdOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hhmmOf = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
/** 날짜만 바꾸고 시·분은 그대로(없으면 0시) */
export const withYmd = (base: Date | null, ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, base?.getHours() ?? 0, base?.getMinutes() ?? 0);
};
export const withHhmm = (base: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const next = new Date(base);
  next.setHours(h, m, 0, 0);
  return next;
};
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** 원하는 날짜 배송의 기본값 하나 — 내일 0시(예전 첫 화면 기본값). 배송은 내일부터 고를 수 있다 */
export const defaultArrival = () => addDays(new Date(), 1);

/* ── 받는 방법 바꾸기 ── */

/** 배송·픽업 칸. 주문 테이블은 delivery_arrival_time 이 있으면 배송으로 고르므로, 주문 화면에 들어올 때 다른 쪽 칸은 비운다 */
export const DELIVERY_KEYS = [
  "road_address",
  "detail_address",
  "is_today_delivery",
  "delivery_arrival_time",
  "delivery_method",
  "gate_password",
  "delivery_method_direct_input",
] as const;
export const PICKUP_KEYS = ["vehicle_type", "vehicle_type_direct_input", "pickup_time"] as const;

/**
 * 받는 방법 화면은 들어올 때 새 주문으로 비운다(장바구니에서 들어온 경우).
 * 주문 화면의 「변경」으로 돌아온 것이면 한 번 비우지 않는다 — 넣어 둔 주소·요청이 사라지지 않게.
 */
let keepOnce = false;
export const changeReceiveOption = (router: Parameters<typeof goBack>[0]) => {
  keepOnce = true;
  goBack(router, "/order");
};
export const takeKeepOrder = () => {
  const k = keepOnce;
  keepOnce = false;
  return k;
};
