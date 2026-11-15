/**
 * 상황 주문(2026-11-13) — 화면 1 버튼 묶음·화면 2 버튼·비용 규칙.
 * 기획: 노션 「상황 정의 및 주문 범주화」. 유저는 상황을 고르고, 품목은 실무자가 구성한다.
 * 바로키친 어드민 /api/barogagu/intake 와의 관계(2026-11-15 확인):
 *  - 상황 이름은 문의 메모 글(「· 가구 추가: 창고문」)에만 들어간다 — 현장허브 「가구 구성」과 무관하니 바꿔도 된다.
 *  - 버튼 이름은 어드민 대응표(intake.ts FURNITURE)의 열쇠라서 「가구 구성」(주방·신발장·붙박이장(옷장)·화장대·창고문/선반…)으로 바뀐다 — 버튼 이름을 바꾸면 어드민 대응표도 같이.
 */

import type { PictogramName } from "@/components/pictogram/Pictogram";

export type SituationSlug = "partial" | "door" | "cabinet";

export interface Situation {
  slug: SituationSlug;
  /** 화면·DB(SituationOrderPart.situation) 이름 */
  name: "가구 추가" | "문짝 교체 · 설치" | "가구 교체";
  /** 이름 밑 한 줄(QA 「표현 변경」 2026-11-15) */
  subtitle: string;
  /** 화면 2 버튼 — 한 상황 안에서 여러 개 고를 수 있다 */
  buttons: string[];
  pictogram: PictogramName;
}

/**
 * 둘째 묶음(서로 같이 고를 수 있다). 이 차례대로 상황 페이지가 이어진다.
 * 이름·부제·순서는 QA 「표현 변경」(2026-11-15): 문짝 교체 · 설치 → 가구 추가 → 가구 교체. slug 는 그대로(기기에 남은 작성 중 주문이 안 깨지게).
 */
export const SITUATIONS: Situation[] = [
  {
    slug: "door",
    name: "문짝 교체 · 설치",
    subtitle: "가구의 문짝만 교체하거나 새로운 문짝을 주문해보세요",
    buttons: ["신발장·붙박이장 롱문만 교체", "화장대장"],
    pictogram: "door",
  },
  {
    slug: "partial",
    name: "가구 추가",
    subtitle: "전체 리모델링이 아니어도, 부분적으로 맞춤가구를 주문해보세요",
    buttons: ["창고문", "냉장고장", "서랍장", "식기세척기장"],
    pictogram: "partial",
  },
  {
    slug: "cabinet",
    name: "가구 교체",
    subtitle: "기존 가구가 있던 자리에 새로운 가구를 넣어보세요",
    buttons: ["냉장고장 플랩문 교체", "전체 교체", "신발장 전체 교체", "식세기 자리에 장 채우기"],
    pictogram: "cabinet",
  },
];

/** 바로배송(옛 「현장 급한 수습」, QA 「표현 변경」 2026-11-15) — 이름·기한 글은 화면 어디서나 이것만 쓴다 */
export const URGENT_NAME = "바로배송";
export const URGENT_WHEN = "당일 또는 3일 이내";
/** 칩에 들어가는 짧은 기한 — 이름 옆 한 줄(390px 카드 글 칸 217px)에 칩 둘이 들어가게 */
export const URGENT_WHEN_SHORT = "당일~3일";

/** 화면 2 버튼 그림 — 버튼 이름은 어드민과 맞물려 있어 그림은 따로 둔다 */
export const BUTTON_PICTOGRAM: Record<string, PictogramName> = {
  창고문: "storage",
  냉장고장: "fridge",
  서랍장: "drawer",
  식기세척기장: "dish",
  "신발장·붙박이장 롱문만 교체": "longdoor",
  화장대장: "vanity",
  "냉장고장 플랩문 교체": "flap",
  "전체 교체": "whole",
  "신발장 전체 교체": "shoes",
  "식세기 자리에 장 채우기": "fill",
};

/** 품목 고르기 장의 「자세히」 설명·실제 사진 여러 장(QA 「가구 선택 단계에서 상세 설명」 2026-11-15) — 창고문만 시범, 보고 나서 다른 품목도 */
export const BUTTON_DETAIL: Record<string, { text: string; photos: string[] }> = {
  창고문: { text: "베란다·다용도실 수납장을 깔끔하게 가려주고 습기와 먼지를 막아주는 맞춤형 가구 도어입니다.", photos: ["/img/request/storage.jpg"] },
};

/** 첫 장 미리보기의 그림 밑 짧은 이름(2026-11-15 사용자) — 없으면 버튼 이름 그대로 */
export const BUTTON_SHORT: Record<string, string> = {
  "신발장·붙박이장 롱문만 교체": "롱문",
  "냉장고장 플랩문 교체": "플랩문",
  "전체 교체": "전체",
  "신발장 전체 교체": "신발장",
  "식세기 자리에 장 채우기": "식기세척기장",
};

export const situationOf =(slug: string) => SITUATIONS.find((s) => s.slug === slug) ?? null;

/** 바로배송 — 체크하면 이만큼 더한다. 다음 단계 페이지는 없다 */
export const URGENT_FEE = 150_000;

/**
 * 출장비 — 시공기사가 필요할 때만. 공장→현장 편도(분, 주문할 때 네이버 경로 실시간)로 매긴다.
 * 35분 이하 0원, 그 뒤 15분마다 3만 원. 3만 원 = 왕복 이동 증가분 2만 원 × 1.5(기사 집→공장 이동을 공장→현장의 절반으로 어림).
 */
export function travelFeeOf(minutes: number): number {
  if (minutes <= 35) return 0;
  return Math.ceil((minutes - 35) / 15) * 30_000;
}
