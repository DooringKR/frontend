import { getPricingColorName } from "./colorMapping";

// 마진율 (60%)
const MARGIN = 0.6;

/**
 * 문짝 가격 계산
 */
export function calculateUnitDoorPrice(color: string, width: number, height: number) {
  const originalPrice = calculateOriginalPrice(color);
  const split = calculateSplit(width, height);
  const unitPrice = Math.round((originalPrice * MARGIN) / split);
  console.log(originalPrice, split, unitPrice);

  return unitPrice;
}

/**
 * 색상별 원가 계산
 */
function calculateOriginalPrice(color: string): number {
  const colorName = getPricingColorName(color);
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

  if (premiumColors.includes(colorName)) {
    return 90000;
  }
  // 표준 색상 (70,000원)
  else if (standardColors.includes(colorName)) {
    return 70000;
  } else {
    // 직접 입력은 25,000원으로 처리
    return 70000;
  }
}

/**
 * 분할값 계산
 */
function calculateSplit(width: number, height: number): number {
  // width 범위별 분할값 계산
  if (width >= 1 && width <= 200) {
    return getSplitByHeight(height, [20, 12, 6]);
  } else if (width >= 201 && width <= 400) {
    return getSplitByHeight(height, [10, 6, 3]);
  } else if (width >= 401 && width <= 600) {
    return getSplitByHeight(height, [6, 4, 2]);
  } else if (width >= 601 && width <= 1000) {
    return getSplitByHeight(height, [3, 2, 1]);
  } else if (width >= 1001 && width <= 1220) {
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
  } else if (height >= 601 && height <= 2440) {
    return splits[2];
  } else {
    return splits[2];
  }
}
