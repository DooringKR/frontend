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
  /** 상황 추가금액(원) — 첫 장 이름 옆 칩·확인 화면 비용 칸(QA 「선택지별 추가금액 시나리오」 2026-11-15, QA 금액) */
  fee?: number;
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
    fee: 100_000,
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
    fee: 100_000,
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

/**
 * 품목 고르기 장의 「자세히」 설명·실제 사진 여러 장(QA 「가구 선택 단계에서 상세 설명」 2026-11-15).
 * 창고문은 QA 원문, 나머지 넷은 조사 세션 초안(2026-11-15 사용자 「추천 4개로」) — 사진은 회사 촬영본(광주주택·기술 라이브러리·플랩문 교체 사례).
 * 아직 없는 품목: 화장대장(문만인지 장 새로인지 범위 미정)·냉장고장·전체 교체(이름부터)·서랍장·신발장 전체 교체(이름으로 충분).
 */
export const BUTTON_DETAIL: Record<string, { text: string; photos: string[] }> = {
  창고문: { text: "베란다·다용도실 수납장을 깔끔하게 가려주고 습기와 먼지를 막아주는 맞춤형 가구 도어입니다.", photos: ["/img/request/storage.jpg"] },
  "신발장·붙박이장 롱문만 교체": {
    text: "신발장·붙박이장 몸통은 그대로 두고 키 큰 문짝(롱문)만 새로 맞춰 다는 주문입니다. 장은 아직 쓸 만한데 문 색이나 상태만 바꾸고 싶을 때 고릅니다.",
    photos: ["/img/request/longdoor-1.jpg", "/img/request/longdoor-2.jpg", "/img/request/longdoor-3.jpg"],
  },
  "냉장고장 플랩문 교체": {
    text: "냉장고장 위 칸에 달린, 위로 들어 올려 여는 문(플랩문)만 새로 바꾸는 주문입니다. 문이 냉장고에 걸려 잘 열리지 않을 때 고릅니다.",
    photos: ["/img/request/flap-1.jpg", "/img/request/flap-2.jpg", "/img/request/flap-3.jpg"],
  },
  식기세척기장: {
    text: "빌트인 식기세척기가 들어갈 자리를 만들어 주는 하부장입니다. 식기세척기를 새로 들이는데 지금 주방에 넣을 자리가 없을 때 고릅니다.",
    photos: ["/img/request/dish-1.jpg", "/img/request/dish-2.jpg"],
  },
  "식세기 자리에 장 채우기": {
    text: "식기세척기를 빼서 생긴 자리나 처음부터 비어 있던 식세기 자리를 수납장으로 채우는 주문입니다. 식기세척기를 쓰지 않는 집에서 그 칸을 수납으로 쓰고 싶을 때 고릅니다.",
    photos: ["/img/request/dish-fill-1.jpg", "/img/request/dish-fill-2.jpg"],
  },
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

/** DIY(셀프 주문) — 이만큼 덜 낸다(QA 「선택지별 추가금액 시나리오」, 첫 장 칩만 — DIY 는 화면이 따로) */
export const DIY_DISCOUNT = 50_000;

/**
 * 가구 추가 → 풀세트 확인 장(QA 「부분가구 추가 다음 단계에 전체 리모델링 제외 페이지 넣기」 2026-11-15).
 * 가구 추가를 고르고 주방 풀세트를 문의하는 분이 있어서, 풀세트면 개수대연구소 상담 폼(Tally 「개수대연구소 상담 신청하기」)으로 보낸다.
 * 설명 문구는 QA 에 「풀세트란 ~~」만 있어 초안 — 사용자 확인 전.
 */
export const FULLSET = {
  title: "잠깐! 주방 풀세트인가요?",
  description: "상부장·하부장·상판까지 주방 가구를 모두 새로 하는 경우예요. 풀세트는 개수대연구소에서 상담해 드려요",
  formUrl: "https://tally.so/r/w7BRW0",
};

/** 칩 글 — 150000 → 「15만 원」 */
export const manwon = (n: number) => `${n / 10_000}만 원`;

/**
 * 출장비 — 시공기사가 필요할 때만. 공장→현장 편도(분, 주문할 때 네이버 경로 실시간)로 매긴다.
 * 35분 이하 0원, 그 뒤 15분마다 3만 원. 3만 원 = 왕복 이동 증가분 2만 원 × 1.5(기사 집→공장 이동을 공장→현장의 절반으로 어림).
 */
export function travelFeeOf(minutes: number): number {
  if (minutes <= 35) return 0;
  return Math.ceil((minutes - 35) / 15) * 30_000;
}
