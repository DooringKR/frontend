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
  /** 품목 장(2번째) 제목 — 상황마다 묻는 말이 다르다(2026-11-15 사용자) */
  question: string;
  /** 화면 2 버튼(품목) — 한 상황 안에서 여러 개 고를 수 있다. 목록은 노션 QA 「품목정리」 */
  buttons: string[];
  /** 품목 그림 — 같은 이름이라도 상황마다 강조가 다를 수 있어 상황 안에 둔다 */
  pictograms: Record<string, PictogramName>;
  pictogram: PictogramName;
  /** 상황 설명 장에서 「경첩도 필요한가요? (선택)」를 묻는다 */
  asksHinge?: boolean;
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
    question: "어떤 문짝이 필요한가요?",
    // 품목정리의 「주방(상하부장·냉장고장)」 위계는 두 칸으로 펼친다(2026-11-15 사용자 「추천대로」 — 페이지를 늘리지 않는다)
    buttons: ["주방 상하부장", "주방 냉장고장", "베란다 창고문", "붙박이장", "신발장", "화장대장"],
    pictograms: { "주방 상하부장": "kitchenDoor", "주방 냉장고장": "flap", "베란다 창고문": "storage", 붙박이장: "longdoor", 신발장: "shoes", 화장대장: "vanity" },
    pictogram: "door",
    fee: 100_000,
    asksHinge: true,
  },
  {
    slug: "partial",
    name: "가구 추가",
    subtitle: "전체 리모델링이 아니어도, 부분적으로 맞춤가구를 주문해보세요",
    question: "어떤 가구가 필요한가요?",
    buttons: ["붙박이장", "신발장", "냉장고장", "키큰 수납장", "아일랜드장", "베란다 창고장"],
    pictograms: { 붙박이장: "longdoor", 신발장: "shoes", 냉장고장: "fridge", "키큰 수납장": "tall", 아일랜드장: "island", "베란다 창고장": "storage" },
    pictogram: "partial",
    asksHinge: true,
  },
  {
    slug: "cabinet",
    name: "가구 교체",
    subtitle: "기존 가구가 있던 자리에 새로운 가구를 넣어보세요",
    question: "어떤 가구를 교체하실 건가요?",
    buttons: ["식기세척기자리 수납장", "붙박이장 내부 교체", "냉장고자리 수납장"],
    pictograms: { "식기세척기자리 수납장": "fill", "붙박이장 내부 교체": "inner", "냉장고자리 수납장": "fridgeFill" },
    pictogram: "cabinet",
    fee: 100_000,
  },
];

/** 바로배송(옛 「현장 급한 수습」, QA 「표현 변경」 2026-11-15) — 이름·기한 글은 화면 어디서나 이것만 쓴다 */
export const URGENT_NAME = "바로배송";
export const URGENT_WHEN = "당일 또는 3일 이내";
/** 칩에 들어가는 짧은 기한 — 이름 옆 한 줄(390px 카드 글 칸 217px)에 칩 둘이 들어가게 */
export const URGENT_WHEN_SHORT = "당일~3일";

/** 품목 그림 — 상황 안 대응표에서(같은 이름이 여러 상황에 있다), 없으면 상황 그림 */
export const pictogramOf = (slug: SituationSlug, name: string): PictogramName => {
  const x = SITUATIONS.find((s) => s.slug === slug);
  return x?.pictograms[name] ?? x?.pictogram ?? "partial";
};

/**
 * 품목 고르기 장의 「자세히」 설명·실제 사진(QA 「가구 선택 단계에서 상세 설명」) — 운영에서는 뺀다(2026-11-15 사용자 「자세히는 운영에서 제외하자」).
 * 문구·사진은 브랜치 feat/button-detail 에서 확정될 때까지 다듬는다. 비어 있으면 「자세히 ›」 버튼이 안 뜬다.
 */
export const BUTTON_DETAIL: Record<string, { text: string; photos: string[] }> = {};

/** 그림 칸 밑 짧은 이름 — 네 칸 폭(약 73px)에 낱말이 안 들어가는 것만. 나머지는 이름 그대로 띄어쓰기에서 두 줄 */
export const BUTTON_SHORT: Record<string, string> = {
  "식기세척기자리 수납장": "식기세척기장",
};

/** 기기에 남은 작성 중 주문의 옛 품목 이름 — 지금 목록에 없는 것은 버린다(품목정리로 바뀐 뒤 2026-11-15) */
export const validButtons = (slug: SituationSlug, buttons: string[]) =>
  buttons.filter((b) => SITUATIONS.find((s) => s.slug === slug)?.buttons.includes(b));

export const situationOf =(slug: string) => SITUATIONS.find((s) => s.slug === slug) ?? null;

/** 바로배송 — 체크하면 이만큼 더한다. 다음 단계 페이지는 없다 */
export const URGENT_FEE = 150_000;

/** DIY(셀프 주문) — 이만큼 덜 낸다(QA 「선택지별 추가금액 시나리오」, 첫 장 칩만 — DIY 는 화면이 따로) */
export const DIY_DISCOUNT = 50_000;

/**
 * 가구 추가 → 풀세트 확인 장(QA 「부분가구 추가 다음 단계에 전체 리모델링 제외 페이지 넣기」 2026-11-15).
 * 가구 추가를 고르고 주방 풀세트를 문의하는 분이 있어서, 풀세트면 개수대연구소 상담 폼(Tally 「개수대연구소 상담 신청하기」)으로 보낸다.
 * 설명 문구는 QA 에 「풀세트란 ~~」만 있어 내가 쓴 초안을 사용자가 그대로 쓰기로(2026-11-15 「초안대로」).
 */
export const FULLSET = {
  title: "잠깐! 주방 풀세트인가요?",
  description: "상부장·하부장·상판까지 주방 가구를 모두 새로 하는 경우예요. 풀세트는 개수대연구소에서 상담해 드려요",
  formUrl: "https://tally.so/r/w7BRW0",
};

/**
 * 품목 장 맨 아래 — 탑다운으로 정의한 품목에 없는 주문을 받는 칸(QA 「단계별 가구 종류 및 시나리오 수정」 2026-11-15).
 * 품목을 하나라도 고르면 막힌다(사용자 「추천대로」). 누르면 품목 없이 바로 설명 장으로, 그때는 설명 글이 꼭 있어야 한다. 저장할 때 버튼 자리에는 「직접 입력」
 */
export const DIRECT = { label: "AS가 필요한 상황을 직접 입력할게요", button: "직접 입력" };

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
