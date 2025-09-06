import { getPricingColorName } from "./colorMapping";

// 마진율 (60%)
const MARGIN = 0;

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

  // 최종 견적 = (original_price / split ) * { 1 + ( margin + 0.1 ) }
  const unitPrice = (originalPrice / split) * (1 + (MARGIN + 0.1));

  // 백원 단위에서 올림
  const finalPrice = Math.ceil(unitPrice / 100) * 100;

  console.log(originalPrice, split, unitPrice, finalPrice);
  return finalPrice;
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

  // 한솔 LPM이 파타고니아 크림이라고 함
  // 한솔 LPM (45,000원) - 파타고니아크림
  const lpmColors = ["한솔파타고니아크림"];

  // 색상별 가격 결정
  if (standardColors.includes(colorName)) {
    return 130000;
  } else if (premiumColors.includes(colorName)) {
    return 170000;
  } else if (herringbone3TColors.includes(colorName)) {
    return 30000;
  } else if (herringbone15TColors.includes(colorName)) {
    return 54000;
  } else if (herringbone18TColors.includes(colorName)) {
    return 60000;
  } else if (lpmColors.includes(colorName)) {
    return 76000;
  } else {
    return 130000;
  }
}

/**
 * 분할값 계산 (문짝과 동일한 로직)
 */
function calculateSplit(depth: number, height: number): number {
  // depth: 1 - 300
  if (depth >= 1 && depth <= 300) {
    if (height >= 1 && height <= 1100) {
      return 7;
    } else if (height >= 1101 && height <= 1300) {
      return 5;
    } else if (height >= 1301 && height <= 1500) {
      return 4;
    } else if (height >= 1501) {
      return 3;
    }
  }
  // depth: 301 - 400
  else if (depth >= 301 && depth <= 400) {
    if (height >= 1 && height <= 900) {
      return 6;
    } else if (height >= 901 && height <= 1100) {
      return 5;
    } else if (height >= 1101 && height <= 1300) {
      return 4;
    } else if (height >= 1301) {
      return 3;
    }
  }
  // depth: 401 - 500
  else if (depth >= 401 && depth <= 500) {
    if (height >= 1 && height <= 900) {
      return 5;
    } else if (height >= 901 && height <= 1100) {
      return 4;
    } else if (height >= 1101 && height <= 1700) {
      return 3;
    } else if (height >= 1701) {
      return 2;
    }
  }
  // depth: 501 - 600
  else if (depth >= 501 && depth <= 600) {
    if (height >= 1 && height <= 900) {
      return 4;
    } else if (height >= 901 && height <= 1500) {
      return 3;
    } else if (height >= 1501) {
      return 2;
    }
  }
  // depth: 601 - 1220
  else if (depth >= 601 && depth <= 1220) {
    if (height >= 1 && height <= 900) {
      return 2;
    } else if (height >= 901 && height <= 1500) {
      return 1.5;
    } else if (height >= 1501) {
      return 1;
    }
  }

  // 기본값
  return 1;
}
