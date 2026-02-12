import { getPricingColorName } from "./colorMapping";

/** 롱문 시공 선택 시 추가 비용 (원) */
export const LONG_DOOR_CONSTRUCT_PRICE = 300_000;

type LongDoorWidthTier = 0 | 1 | 2;
type LongDoorColorTier = "film" | "special" | "signature" | "other";

function getWidthTier(width: number): LongDoorWidthTier {
  // 기획 기준: 300~450 / 450~600 / 600~
  // 경계값 처리는 다음과 같이 적용
  // - 300 <= w < 450 : 1구간
  // - 450 <= w < 600 : 2구간
  // - 600 <= w       : 3구간
  // - 300 미만은 1구간으로 처리
  if (width >= 600) return 2;
  if (width >= 450) return 1;
  return 0;
}

function getColorTier(color: string): LongDoorColorTier {
  const normalized = getPricingColorName(color);

  // 필름 부착용 합판
  if (normalized.includes("필름 부착용 합판")) return "film";

  /**
   * doorPricing.ts 기준 매핑
   * - standard(표준) 원가 → 롱문 스페셜 단가
   * - premium(프리미엄) 원가 → 롱문 시그니처 단가
   */
  const premiumColors = [
    "한솔테네시월넛",
    "한솔베이내츄럴오크",
    "한솔내츄럴크랙오크",
    "한솔칼프브라운우드",
    "한솔콘크리트샌드",
    "한솔콘크리트화이트",
  ];
  if (premiumColors.includes(normalized)) return "signature";

  const standardColors = [
    "한솔크림화이트",
    "한솔퍼펙트화이트",
    "한솔새틴베이지",
    "한솔코튼블루",
    "한솔도브화이트",
    "한솔포그그레이",
    "한솔샌드그레이",
    "동화밀크화이트",
    "동화카본그레이",
  ];
  if (standardColors.includes(normalized)) return "special";

  // 정해진(리스트에 있는) 컬러가 아니라면 시그니처 단가 적용
  return "signature";
}

function getUnitPriceByTier(colorTier: LongDoorColorTier, widthTier: LongDoorWidthTier): number {
  // 금액 단위: 원 (만원 단가 * 10,000)
  // 1) 필름 부착: 9 / 11 / 13 (만원)
  // 2) 스페셜: 12 / 14 / 16 (만원)
  // 3) 시그니처: 16 / 18 / 20 (만원)
  // 4) 기타: 16 / 18 / 20 (만원)
  const table: Record<LongDoorColorTier, [number, number, number]> = {
    film: [9, 11, 13],
    special: [12, 14, 16],
    signature: [16, 18, 20],
    other: [16, 18, 20],
  };
  return table[colorTier][widthTier] * 10000;
}

/**
 * 롱문 전용 문짝 단가 계산
 * - 세로 길이는 무시
 * - 가로 길이 급간 + 색상 tier(필름/스페셜/기타)에 따라 문짝 1개 단가를 반환
 */
export function calculateLongDoorUnitPrice(color: string, width: number): number {
  const wTier = getWidthTier(width);
  const cTier = getColorTier(color);
  return getUnitPriceByTier(cTier, wTier);
}

/**
 * 롱문 전용 문짝 단가 계산 (옵션 포함)
 * - 세로 길이는 무시
 * - 가로 길이 급간 + 색상 tier에 따른 기본 단가
 * - 경첩도 같이 받을래요(addOnHinge) 선택 시 문짝 1개당 1만원 추가
 */
export function calculateLongDoorUnitPriceWithOptions(params: {
  color: string;
  width: number;
  addOnHinge?: boolean;
}): number {
  const base = calculateLongDoorUnitPrice(params.color, params.width);
  return params.addOnHinge ? base + 10000 : base;
}

