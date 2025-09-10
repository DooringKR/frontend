import { getPricingColorName } from "./colorMapping";

/**
 * 부분장 가격 계산
 */
export function calculateUnitCabinetPrice(
  category: string,
  color: string,
  width: number,
  bodyType: string,
  handleType: string,
  depth: number,

): number {
  //변수 선언
  // const doorPrice = calculateDoorPrice(color);
  // const bodyPrice = calculateBodyPrice(bodyType);
  // const handlePrice = calculateHandlePrice(handleType);
  // console.log(doorPrice, bodyPrice, handlePrice);

  let cabinet_depth_price = 0;
  let cabinet_width_price = 0;
  if (category === "lower") {
    if (1 <= depth && depth <= 400) {
      cabinet_depth_price = 200;
    } else if (400 < depth && depth <= 600) {
      cabinet_depth_price = 260;
    } else if (600 < depth) {
      return 0;
    }
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice = (cabinet_depth_price * width) * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice
  } else if (category === "upper") {
    if (1 <= depth && depth <= 350) {
      cabinet_depth_price = 200;
    } else if (350 < depth) {
      cabinet_depth_price = 260;
    }
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice = (cabinet_depth_price * width) * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice
  } else if (category === "drawer") {
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice = (width * 500) * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice
  } else if (category === "open") {
    const doorColorPrice = calculateDoorPrice(color);
    const margin = 0.2;
    const unitPrice = (width * doorColorPrice) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice
  } else if (category === "flap") {
    if (1 <= width && width <= 600) {
      cabinet_width_price = 250000;
    } else if (600 < width && width <= 1000) {
      cabinet_width_price = 350000;
    } else if (1000 < width) {
      return 0;
    }

    if (1 <= depth && depth <= 650) {
      cabinet_depth_price = 0;
    } else if (650 < depth && depth <= 750) {
      cabinet_depth_price = 60000;
    } else if (750 < depth) {
      return 150000;
    }
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice = (cabinet_depth_price + cabinet_width_price) * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice
  }

  return 0;

}

function caculateDoorColorWeight(color: string): number {
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
    return 0;
  } else if (premiumColors.includes(colorName)) {
    return 0.3;
  } else {
    // 직접 입력
    return 0;
  }
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
    return 400;
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

function calculateBodyWeight(bodyType: string): number {
  switch (bodyType) {
    case "헤링본 PP 15T":
      return 0;
    case "헤링본 PP 18T":
      return 0.1;
    case "파타고니아 크림 LPM 18T":
      return 0.2;
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


