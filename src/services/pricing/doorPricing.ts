import { getPricingColorName } from "./colorMapping";

// 마진율 (0%)
const MARGIN = 0;

/**
 * 문짝 가격 계산
 */
export function calculateUnitDoorPrice(color: string, width: number, height: number) {
  const originalPrice = calculateOriginalPrice(color);
  const split = calculateSplit(width, height);

  // 최종 견적 = (original_price / split ) * { 1 + ( margin + 0.1 ) }
  const unitPrice = (originalPrice / split) * (1 + (MARGIN + 0.1)) * 1.2; // 추가 마진, 0911 추가

  // 백원 단위에서 올림
  // const finalPrice = Math.ceil(unitPrice / 100) * 100;

  // 천원 단위에서 올림 (0911 추가)
  const finalPrice = Math.ceil(unitPrice / 1000) * 1000;

  return finalPrice;
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
    return 170000;
  }
  // 표준 색상
  else if (standardColors.includes(colorName)) {
    return 130000;
  } else {
    return 130000;
  }
}

/**
 * 분할값 계산
 */
function calculateSplit(width: number, height: number): number {
  // door_width: 1 - 300
  if (width >= 1 && width <= 300) {
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
  // door_width: 301 - 400
  else if (width >= 301 && width <= 400) {
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
  // door_width: 401 - 500
  else if (width >= 401 && width <= 500) {
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
  // door_width: 501 - 600
  else if (width >= 501 && width <= 600) {
    if (height >= 1 && height <= 900) {
      return 4;
    } else if (height >= 901 && height <= 1500) {
      return 3;
    } else if (height >= 1501) {
      return 2;
    }
  }
  // door_width: 601 - 1220
  else if (width >= 601 && width <= 1220) {
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
