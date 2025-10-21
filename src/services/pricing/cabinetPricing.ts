import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CabinetHandleType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import { getPricingColorName } from "./colorMapping";

/**
 * 부분장 가격 계산
 */
export function calculateUnitCabinetPrice(
  category: DetailProductType,
  color: string,
  width: number,
  bodyType: number,
  handleType: CabinetHandleType,
  depth: number,
): number {
  //변수 선언
  // const doorPrice = calculateDoorPrice(color);
  // const bodyPrice = calculateBodyPrice(bodyType);
  // const handlePrice = calculateHandlePrice(handleType);
  // console.log(doorPrice, bodyPrice, handlePrice);

  let cabinet_depth_price = 0;
  let cabinet_width_price = 0;
  if (category === DetailProductType.LOWERCABINET || category === DetailProductType.TALLCABINET) {
    if (depth >= 1 && depth <= 400) {
      // 깊이 급간 A
      if (width >= 1 && width <= 900) {
        // 너비 급간 A
        cabinet_depth_price = 200;
      } else if (width > 900) {
        // 너비 급간 B
        cabinet_depth_price = 250;
      }
    } else if (depth > 400 && depth <= 650) {
      // 깊이 급간 B
      if (width >= 1 && width <= 900) {
        // 너비 급간 A
        cabinet_depth_price = 250;
      } else if (width > 900) {
        // 너비 급간 B
        cabinet_depth_price = 250;
      }
    } else if (650 < depth) {
      return 0;
    }
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice = (cabinet_depth_price * width) * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice;
  } else if (category === DetailProductType.UPPERCABINET) {
    if (1 <= depth && depth <= 350) {
      cabinet_depth_price = 150;
    } else if (350 < depth) {
      cabinet_depth_price = 200;
    }
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice =
      cabinet_depth_price * width * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice;
  } else if (category === DetailProductType.DRAWERCABINET) {
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.2;
    const unitPrice = width * 500 * (1 + doorColorWeight + bodyWeight) * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice;
  } else if (category === DetailProductType.OPENCABINET) {
    const doorColorPrice = calculateDoorPrice(color);
    const margin = 0.0;
    const unitPrice = width * doorColorPrice * (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice;
  } else if (category === DetailProductType.FLAPCABINET) {
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
      cabinet_depth_price = 30000;
    } else if (750 < depth) {
      return 60000;
    }
    const doorColorWeight = caculateDoorColorWeight(color);
    const bodyWeight = calculateBodyWeight(bodyType);
    const margin = 0.0;
    const unitPrice =
      (cabinet_depth_price + cabinet_width_price) *
      (1 + doorColorWeight + bodyWeight) *
      (1 + margin);

    // 만원 단위로 올림 처리 (432,400원 → 440,000원)
    const roundedUnitPrice = Math.ceil(unitPrice / 10000) * 10000;

    return roundedUnitPrice;
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
    return 250;
  } else if (premiumColors.includes(colorName)) {
    return 350;
  } else {
    // 직접 입력
    return 250;
  }
}

/**
 * 바디 소재별 가격 계산
 */
function calculateBodyPrice(bodyType: number): number {
  const material = BODY_MATERIAL_LIST.find(m => m.id === bodyType);
  if (!material) return 0;
  switch (material.name) {
    case "헤링본 PB 15T":
      return 0;
    case "헤링본 PB 18T":
      return 45000;
    case "한솔 파타고니아크림 LPM 18T":
      return 75000;
    case "직접입력":
      return 0;
    default:
      return 0;
  }
}

function calculateBodyWeight(bodyType: number): number {
  const material = BODY_MATERIAL_LIST.find(m => m.id === bodyType);
  if (!material) return 0;
  switch (material.name) {
    case "헤링본 PB 15T":
      return 0;
    case "헤링본 PB 18T":
      return 0.1;
    case "한솔 파타고니아크림 LPM 18T":
      return 0.2;
    case "직접입력":
      return 0;
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
