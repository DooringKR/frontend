/**
 * 상황 주문(2026-11-13) — 화면 1 버튼 묶음·화면 2 버튼·비용 규칙.
 * 기획: 노션 「상황 정의 및 주문 범주화」. 유저는 상황을 고르고, 품목은 실무자가 구성한다.
 * 버튼 이름은 바로키친 어드민 /api/barogagu/intake 가 현장허브 「가구 구성」으로 옮길 때 그대로 쓴다 — 바꾸면 어드민도 같이.
 */

export type SituationSlug = "partial" | "door" | "cabinet";

export interface Situation {
  slug: SituationSlug;
  /** 화면·DB(SituationOrderPart.situation) 이름 */
  name: "부분가구 추가" | "문짝 교체 또는 설치" | "장 일부 또는 전체 교체";
  /** 화면 2 버튼 — 한 상황 안에서 여러 개 고를 수 있다 */
  buttons: string[];
}

/** 둘째 묶음(서로 같이 고를 수 있다). 이 차례대로 상황 페이지가 이어진다 */
export const SITUATIONS: Situation[] = [
  { slug: "partial", name: "부분가구 추가", buttons: ["창고문", "냉장고장", "서랍장", "식기세척기장"] },
  { slug: "door", name: "문짝 교체 또는 설치", buttons: ["신발장·붙박이장 롱문만 교체", "화장대장"] },
  {
    slug: "cabinet",
    name: "장 일부 또는 전체 교체",
    buttons: ["냉장고장 플랩문 교체", "전체 교체", "신발장 전체 교체", "식세기 자리에 장 채우기"],
  },
];

export const situationOf = (slug: string) => SITUATIONS.find((s) => s.slug === slug) ?? null;

/** 급한 수습 — 체크하면 이만큼 더한다. 다음 단계 페이지는 없다 */
export const URGENT_FEE = 150_000;

/**
 * 출장비 — 시공기사가 필요할 때만. 공장→현장 편도(분, 주문할 때 네이버 경로 실시간)로 매긴다.
 * 35분 이하 0원, 그 뒤 15분마다 3만 원. 3만 원 = 왕복 이동 증가분 2만 원 × 1.5(기사 집→공장 이동을 공장→현장의 절반으로 어림).
 */
export function travelFeeOf(minutes: number): number {
  if (minutes <= 35) return 0;
  return Math.ceil((minutes - 35) / 15) * 30_000;
}
