import { getPricingColorName } from "./colorMapping";

// 마진율 (60%)
const MARGIN = 0.6;

/**
 * 마감재 단위 가격 계산
 */
export function calculateUnitFinishPrice(
  color: string,
  baseDepth: number,
  additionalDepth: number,
  baseHeight: number,
  additionalHeight: number,
) {
  const originalPrice = calculateOriginalPrice(color);
  const totalDepth = baseDepth + additionalDepth;
  const totalHeight = baseHeight + additionalHeight;
  const split = calculateSplit(totalDepth, totalHeight);
  const unitPrice = Math.round((originalPrice * MARGIN) / split);
  console.log(originalPrice, split, unitPrice);
  return unitPrice;
}

/**
 * 색상별 원가 계산
 */
function calculateOriginalPrice(color: string): number {
  const colorName = getPricingColorName(color);

  // 표준 색상 (70,000원)
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

  // 프리미엄 색상 (90,000원)
  const premiumColors = [
    "한솔테네시월넛",
    "한솔베이내츄럴오크",
    "한솔내츄럴크랙오크",
    "한솔칼프브라운우드",
    "한솔콘크리트샌드",
    "한솔콘크리트화이트",
  ];

  // 헤링본 3T 우라 (25,000원)
  const herringbone3TColors = ["헤링본 3T 우라"];

  // 헤링본 15T, 헤링본 미백색 (27,000원)
  const herringbone15TColors = ["헤링본 15T", "헤링본 미백색"];

  // 헤링본 18T (30,000원)
  const herringbone18TColors = ["헤링본 18T"];

  // 한솔 LPM이 파타고니아 크림인지 확실하지 않아서 확인 필요함
  // 한솔 LPM (45,000원) - 파타고니아크림
  const lpmColors = ["한솔파타고니아크림"];

  // 색상별 가격 결정
  if (standardColors.includes(colorName)) {
    return 70000;
  } else if (premiumColors.includes(colorName)) {
    return 90000;
  } else if (herringbone3TColors.includes(colorName)) {
    return 25000;
  } else if (herringbone15TColors.includes(colorName)) {
    return 27000;
  } else if (herringbone18TColors.includes(colorName)) {
    return 30000;
  } else if (lpmColors.includes(colorName)) {
    return 45000;
  } else {
    // 직접 입력은 25,000원으로 처리
    return 25000;
  }
}

/**
 * 분할값 계산 (문짝과 동일한 로직)
 */
function calculateSplit(depth: number, height: number): number {
  // width 범위별 분할값 계산
  if (depth >= 1 && depth <= 200) {
    return getSplitByHeight(height, [20, 12, 6]);
  } else if (depth >= 201 && depth <= 400) {
    return getSplitByHeight(height, [10, 6, 3]);
  } else if (depth >= 401 && depth <= 600) {
    return getSplitByHeight(height, [6, 4, 2]);
  } else if (depth >= 601 && depth <= 1000) {
    return getSplitByHeight(height, [3, 2, 1]);
  } else if (depth >= 1001 && depth <= 1200) {
    return 1;
  } else {
    // 기본값
    return 1;
  }
}

/**
 * 높이에 따른 분할값 반환
 */
function getSplitByHeight(height: number, splits: [number, number, number]): number {
  if (height >= 1 && height <= 400) {
    return splits[0];
  } else if (height >= 401 && height <= 600) {
    return splits[1];
  } else if (height >= 801 && height <= 2440) {
    return splits[2];
  } else {
    // 601-800 범위는 명시되지 않았으므로 기본값 사용
    return splits[1]; // 401-600과 동일하게 처리
  }
}
