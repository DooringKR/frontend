import { getPricingColorName } from "./colorMapping";

/**
 * 부분장 가격 계산
 */
export function calculateUnitCabinetPrice(
  color: string,
  width: number,
  bodyType: string,
  handleType: string,
): number {
  //변수 선언
  const doorPrice = calculateDoorPrice(color);
  const bodyPrice = calculateBodyPrice(bodyType);
  const handlePrice = calculateHandlePrice(handleType);
  // console.log(doorPrice, bodyPrice, handlePrice);

  // 단위 가격 계산
  const unitPrice = doorPrice * width + bodyPrice + handlePrice;

  // 단위 가격 반환
  return unitPrice;
}

/**
 * 부분장 도어 색상별 가격 계산 (원/mm)
 */
function calculateDoorPrice(color: string): number {
  const colorName = getPricingColorName(color);

  // 표준 색상 (300원/mm)
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

  // 프리미엄 색상 (390원/mm)
  const premiumColors = [
    "한솔테네시월넛",
    "한솔베이내츄럴오크",
    "한솔내츄럴크랙오크",
    "한솔칼프브라운우드",
    "한솔콘크리트샌드",
    "한솔콘크리트화이트",
  ];

  // 색상별 가격 결정
  if (standardColors.includes(colorName)) {
    return 300;
  } else if (premiumColors.includes(colorName)) {
    return 390;
  } else {
    // 직접 입력
    return 300;
  }
}

/**
 * 바디 소재별 가격 계산
 */
function calculateBodyPrice(bodyType: string): number {
  switch (bodyType) {
    case "헤링본 PP 15T":
      return 0;
    case "헤링본 PP 18T":
      return 45000;
    case "파타고니아 크림 LPM 18T":
      return 75000;
    // 직접 입력
    default:
      return 0;
  }
}

/**
 * 손잡이 가격 계산
 */
function calculateHandlePrice(handleType: string): number {
  switch (handleType) {
    case "겉손잡이":
      return 30000;
    default:
      return 0;
  }
}
