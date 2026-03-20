import { CABINET_COLOR_LIST, DOOR_COLOR_LIST, FINISH_COLOR_LIST, LONG_DOOR_COLOR_LIST, OPEN_CABINET_BODY_MATERIAL_LIST } from "dooring-core-domain/dist/constants/color";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";

import { BASE_MARGIN_DEFAULT, ROUNDING_UNIT_WON } from "./cabinet/constants";
import {
  calculateAbsorberSurcharge,
  calculateBodyMarginAddition,
  calculateDoorColorWeight,
  calculateDoorPricePerMm,
  calculateHandleSurcharge,
  calculateRailSurcharge,
} from "./cabinet/rules";
import { DOOR_MARGIN, DOOR_ROUNDING_UNIT_WON } from "./door/constants";
import { calculateDoorOriginalPrice, calculateDoorSplit } from "./door/rules";
import { FINISH_MARGIN, FINISH_ROUNDING_UNIT_WON } from "./finish/constants";
import { calculateFinishOriginalPrice, calculateFinishSplit, calculateGallePrice } from "./finish/rules";
import { LONG_DOOR_CONSTRUCT_PRICE, LONG_DOOR_HINGE_SURCHARGE_PER_ONE } from "./longdoor/constants";
import { getLongDoorColorTier, getLongDoorUnitPriceByTier, getLongDoorWidthTier } from "./longdoor/rules";
import { calculateDoorHingeSurcharge, getKnownHingeCount } from "./priceAdjustments";

export interface PriceTraceStep {
  label: string;
  value: string;
  isFinal?: boolean;
}

function won(n: number): string {
  return `${Math.round(n).toLocaleString()}원`;
}

function roundToUnit(value: number, unit: number): number {
  return Math.ceil(value / unit) * unit;
}

function getDoorTrace(detail: any): PriceTraceStep[] {
  const colorName =
    DOOR_COLOR_LIST.find((c) => c.id === detail.door_color)?.name ||
    detail.door_color_direct_input ||
    String(detail.door_color ?? "");
  const width = detail.door_width ?? 0;
  const height = detail.door_height ?? 0;
  const isPairDoor = detail.is_pair_door ?? false;
  const addOnHinge = detail.addOn_hinge ?? false;
  const hinge = detail.hinge;

  const originalPrice = calculateDoorOriginalPrice(colorName);
  const split = calculateDoorSplit(width, height);
  const splitPrice = originalPrice / split;
  const priceWithMargin = splitPrice * (1 + DOOR_MARGIN);
  const basePrice = roundToUnit(priceWithMargin, DOOR_ROUNDING_UNIT_WON);
  const doorPrice = isPairDoor ? basePrice * 2 : basePrice;
  const hingeSurcharge = calculateDoorHingeSurcharge({ addOnHinge, hinge, isPairDoor });

  const steps: PriceTraceStep[] = [
    { label: "색상", value: colorName },
    { label: "원가", value: won(originalPrice) },
    { label: "크기", value: `가로 ${width}mm × 높이 ${height}mm` },
    { label: "분할 수", value: `${split}` },
    { label: "분할 후 단가", value: won(splitPrice) },
    { label: `마진 ${DOOR_MARGIN * 100}% 적용`, value: won(priceWithMargin) },
    { label: "반올림", value: won(basePrice) },
  ];
  if (isPairDoor) steps.push({ label: "양문 ×2", value: won(doorPrice) });
  if (hingeSurcharge > 0) steps.push({ label: "힌지 추가금", value: `+${won(hingeSurcharge)}` });
  steps.push({ label: "최종 단가", value: won(doorPrice + hingeSurcharge), isFinal: true });
  return steps;
}

function getFinishTrace(detail: any): PriceTraceStep[] {
  const colorName =
    FINISH_COLOR_LIST.find((c) => c.id === detail.finish_color)?.name ||
    detail.finish_color_direct_input ||
    String(detail.finish_color ?? "");
  const baseDepth = detail.finish_base_depth ?? 0;
  const additionalDepth = detail.finish_additional_depth ?? 0;
  const baseHeight = detail.finish_base_height ?? 0;
  const additionalHeight = detail.finish_additional_height ?? 0;
  const finishType = detail.finish_type as FinishType;
  const totalDepth = baseDepth + additionalDepth;
  const totalHeight = baseHeight + additionalHeight;

  if (finishType === FinishType.GALLE) {
    const price = calculateGallePrice(totalDepth, totalHeight);
    return [
      { label: "마감재 종류", value: "GALLE (고정가)" },
      { label: "최장 변", value: `${Math.max(totalDepth, totalHeight)}mm` },
      { label: "최종 단가", value: won(price), isFinal: true },
    ];
  }

  const originalPrice = calculateFinishOriginalPrice(colorName);
  const split = calculateFinishSplit(totalDepth, totalHeight, finishType);
  const splitPrice = originalPrice / split;
  const priceWithMargin = splitPrice * (1 + FINISH_MARGIN);
  const finalPrice = roundToUnit(priceWithMargin, FINISH_ROUNDING_UNIT_WON);
  return [
    { label: "색상", value: colorName },
    { label: "원가", value: won(originalPrice) },
    { label: "총 깊이", value: `${totalDepth}mm (기본 ${baseDepth} + 추가 ${additionalDepth})` },
    { label: "총 높이", value: `${totalHeight}mm (기본 ${baseHeight} + 추가 ${additionalHeight})` },
    { label: "분할 수", value: `${split}` },
    { label: "분할 후 단가", value: won(splitPrice) },
    { label: `마진 ${FINISH_MARGIN * 100}% 적용`, value: won(priceWithMargin) },
    { label: "최종 단가", value: won(finalPrice), isFinal: true },
  ];
}

function getCabinetTrace(cartItem: CartItem, detail: any): PriceTraceStep[] {
  const category = cartItem.detail_product_type;
  const isOpen = category === DetailProductType.OPENCABINET;

  const colorName = isOpen
    ? OPEN_CABINET_BODY_MATERIAL_LIST.find((c) => c.id === detail.cabinet_color)?.name ||
      OPEN_CABINET_BODY_MATERIAL_LIST.find((c) => c.id === detail.cabinet_body_material)?.name ||
      detail.cabinet_color_direct_input ||
      String(detail.cabinet_color ?? "")
    : CABINET_COLOR_LIST.find((c) => c.id === detail.cabinet_color)?.name ||
      detail.cabinet_color_direct_input ||
      String(detail.cabinet_color ?? "");

  const width = detail.cabinet_width ?? 0;
  const depth = detail.cabinet_depth ?? 0;
  const bodyType = detail.cabinet_body_material ?? 0;
  const handleType = detail.handle_type;
  const bodyMaterialDirectInput = detail.cabinet_body_material_direct_input;

  const colorWeight = calculateDoorColorWeight(colorName);
  const bodyMarginAddition = calculateBodyMarginAddition(bodyType, bodyMaterialDirectInput);
  const handleSurcharge = calculateHandleSurcharge(category, handleType);
  const railSurcharge = calculateRailSurcharge(
    detail.rail_type,
    detail.rail_type_direct_input,
    detail.drawer_type,
  );
  const absorberSurcharge = calculateAbsorberSurcharge(
    width,
    detail.absorber_type,
    detail.absorber_type_direct_input,
  );
  const totalOptionSurcharge = handleSurcharge + railSurcharge + absorberSurcharge;

  const steps: PriceTraceStep[] = [
    { label: "색상", value: colorName },
    { label: "가로 × 깊이", value: `${width}mm × ${depth}mm` },
  ];

  if (isOpen) {
    const pricePerMm = calculateDoorPricePerMm(colorName);
    const raw = width * pricePerMm * (1 + bodyMarginAddition);
    const final = roundToUnit(raw + totalOptionSurcharge, ROUNDING_UNIT_WON);
    steps.push(
      { label: "단가/mm", value: won(pricePerMm) },
      { label: `몸통 마진 ${(bodyMarginAddition * 100).toFixed(0)}%`, value: `×(1 + ${bodyMarginAddition.toFixed(2)})` },
      { label: "기본 단가", value: won(raw) },
    );
    if (totalOptionSurcharge > 0) steps.push({ label: "옵션 추가금", value: `+${won(totalOptionSurcharge)}` });
    steps.push({ label: "최종 단가", value: won(final), isFinal: true });
    return steps;
  }

  if (category === DetailProductType.LOWERCABINET || category === DetailProductType.TALLCABINET) {
    let cabinetDepthPrice = 0;
    if (depth >= 1 && depth <= 400) cabinetDepthPrice = width <= 900 ? 200 : 250;
    else if (depth > 400 && depth <= 650) cabinetDepthPrice = 250;
    else return [{ label: "오류", value: "깊이 범위 초과 → 0원", isFinal: true }];

    const margin = BASE_MARGIN_DEFAULT + bodyMarginAddition;
    const raw = cabinetDepthPrice * width * (1 + colorWeight) * (1 + margin);
    const rounded = roundToUnit(raw + totalOptionSurcharge, ROUNDING_UNIT_WON);
    const final = category === DetailProductType.TALLCABINET ? rounded * 2 : rounded;
    steps.push(
      { label: "기본 단가/mm", value: won(cabinetDepthPrice) },
      { label: "색상 가중치", value: `+${(colorWeight * 100).toFixed(0)}%` },
      { label: `마진 (기본 ${BASE_MARGIN_DEFAULT * 100}% + 몸통 ${(bodyMarginAddition * 100).toFixed(0)}%)`, value: `×(1 + ${margin.toFixed(2)})` },
      { label: "기본 단가", value: won(raw) },
    );
    if (totalOptionSurcharge > 0) steps.push({ label: "옵션 추가금", value: `+${won(totalOptionSurcharge)}` });
    steps.push({ label: "반올림", value: won(rounded) });
    if (category === DetailProductType.TALLCABINET) steps.push({ label: "키큰장 ×2", value: won(final) });
    steps.push({ label: "최종 단가", value: won(final), isFinal: true });
    return steps;
  }

  if (category === DetailProductType.UPPERCABINET) {
    const cabinetDepthPrice = depth <= 350 ? 150 : 200;
    const margin = BASE_MARGIN_DEFAULT + bodyMarginAddition;
    const raw = cabinetDepthPrice * width * (1 + colorWeight) * (1 + margin);
    const final = roundToUnit(raw + totalOptionSurcharge, ROUNDING_UNIT_WON);
    steps.push(
      { label: "기본 단가/mm", value: won(cabinetDepthPrice) },
      { label: "색상 가중치", value: `+${(colorWeight * 100).toFixed(0)}%` },
      { label: `마진 ${(margin * 100).toFixed(0)}%`, value: `×(1 + ${margin.toFixed(2)})` },
      { label: "기본 단가", value: won(raw) },
    );
    if (totalOptionSurcharge > 0) steps.push({ label: "옵션 추가금", value: `+${won(totalOptionSurcharge)}` });
    steps.push({ label: "최종 단가", value: won(final), isFinal: true });
    return steps;
  }

  if (category === DetailProductType.DRAWERCABINET) {
    const margin = BASE_MARGIN_DEFAULT + bodyMarginAddition;
    const raw = width * 500 * (1 + colorWeight) * (1 + margin);
    const final = roundToUnit(raw + totalOptionSurcharge, ROUNDING_UNIT_WON);
    steps.push(
      { label: "기본 단가/mm", value: "500원" },
      { label: "색상 가중치", value: `+${(colorWeight * 100).toFixed(0)}%` },
      { label: `마진 ${(margin * 100).toFixed(0)}%`, value: `×(1 + ${margin.toFixed(2)})` },
      { label: "기본 단가", value: won(raw) },
    );
    if (totalOptionSurcharge > 0) steps.push({ label: "옵션 추가금", value: `+${won(totalOptionSurcharge)}` });
    steps.push({ label: "최종 단가", value: won(final), isFinal: true });
    return steps;
  }

  if (category === DetailProductType.FLAPCABINET) {
    let cabinetWidthPrice = 0;
    if (width >= 1 && width <= 600) cabinetWidthPrice = 250_000;
    else if (width > 600 && width <= 1000) cabinetWidthPrice = 350_000;
    else return [{ label: "오류", value: "너비 범위 초과 → 0원", isFinal: true }];

    let cabinetDepthPrice = 0;
    if (depth > 650 && depth <= 750) cabinetDepthPrice = 30_000;
    else if (depth > 750) return [{ label: "오류", value: "깊이 범위 초과 → 60,000원", isFinal: true }];

    const raw = (cabinetDepthPrice + cabinetWidthPrice) * (1 + colorWeight) * (1 + bodyMarginAddition);
    const final = roundToUnit(raw + totalOptionSurcharge, ROUNDING_UNIT_WON);
    steps.push(
      { label: "너비 기준 고정가", value: won(cabinetWidthPrice) },
      { label: "깊이 추가금", value: won(cabinetDepthPrice) },
      { label: "색상 가중치", value: `+${(colorWeight * 100).toFixed(0)}%` },
      { label: `몸통 마진 ${(bodyMarginAddition * 100).toFixed(0)}%`, value: `×(1 + ${bodyMarginAddition.toFixed(2)})` },
      { label: "기본 단가", value: won(raw) },
    );
    if (totalOptionSurcharge > 0) steps.push({ label: "옵션 추가금", value: `+${won(totalOptionSurcharge)}` });
    steps.push({ label: "최종 단가", value: won(final), isFinal: true });
    return steps;
  }

  return [{ label: "지원되지 않는 카테고리", value: "-", isFinal: true }];
}

function getLongDoorTrace(detail: any, relatedDoors?: any[]): PriceTraceStep[] {
  const colorName =
    detail.door_color_direct_input ||
    LONG_DOOR_COLOR_LIST.find((c) => c.id === detail.door_color)?.name ||
    String(detail.door_color ?? "");
  const colorTier = getLongDoorColorTier(colorName);
  const addOnHinge = detail.addOn_hinge ?? false;

  const steps: PriceTraceStep[] = [
    { label: "색상", value: colorName },
    { label: "색상 등급", value: colorTier },
  ];

  if (!relatedDoors || relatedDoors.length === 0) {
    steps.push({ label: "비고", value: "개별 문 정보 없음 — 저장된 단가 참조", isFinal: true });
    return steps;
  }

  let total = 0;
  relatedDoors.forEach((door, idx) => {
    const width = door.door_width ?? 0;
    const widthTier = getLongDoorWidthTier(width);
    const doorPrice = getLongDoorUnitPriceByTier(colorTier, widthTier);
    const hingeCount = addOnHinge ? getKnownHingeCount(door.hinge ?? []) : 0;
    const hingeSurcharge = hingeCount * LONG_DOOR_HINGE_SURCHARGE_PER_ONE;
    const doorTotal = doorPrice + hingeSurcharge;
    total += doorTotal;
    const hingeNote = hingeSurcharge > 0 ? ` + 힌지 ${won(hingeSurcharge)}` : "";
    steps.push({
      label: `문 ${idx + 1} (${width}mm, 너비등급 ${widthTier})`,
      value: `${won(doorPrice)}${hingeNote} = ${won(doorTotal)}`,
    });
  });

  if (detail.door_construct) {
    total += LONG_DOOR_CONSTRUCT_PRICE;
    steps.push({ label: "설치비", value: `+${won(LONG_DOOR_CONSTRUCT_PRICE)}` });
  }
  steps.push({ label: "최종 단가", value: won(total), isFinal: true });
  return steps;
}

export function getCartItemPriceTrace(
  cartItem: CartItem,
  detail: any,
  relatedDoors?: any[],
): PriceTraceStep[] {
  if (!detail) return [{ label: "상세 정보 없음", value: "-", isFinal: true }];

  switch (cartItem.detail_product_type) {
    case DetailProductType.DOOR:
      return getDoorTrace(detail);
    case DetailProductType.FINISH:
      return getFinishTrace(detail);
    case DetailProductType.UPPERCABINET:
    case DetailProductType.LOWERCABINET:
    case DetailProductType.TALLCABINET:
    case DetailProductType.FLAPCABINET:
    case DetailProductType.DRAWERCABINET:
    case DetailProductType.OPENCABINET:
      return getCabinetTrace(cartItem, detail);
    case DetailProductType.LONGDOOR:
      return getLongDoorTrace(detail, relatedDoors);
    default:
      return [{ label: "고정가 상품", value: won(cartItem.unit_price ?? 0), isFinal: true }];
  }
}

export function getPriceTraceByDetailProductType(
  detailProductType: DetailProductType,
  detail: any,
  relatedDoors?: any[],
): PriceTraceStep[] {
  if (!detail) return [{ label: "상세 정보 없음", value: "-", isFinal: true }];

  switch (detailProductType) {
    case DetailProductType.DOOR:
      return getDoorTrace(detail);
    case DetailProductType.FINISH:
      return getFinishTrace(detail);
    case DetailProductType.UPPERCABINET:
    case DetailProductType.LOWERCABINET:
    case DetailProductType.TALLCABINET:
    case DetailProductType.FLAPCABINET:
    case DetailProductType.DRAWERCABINET:
    case DetailProductType.OPENCABINET:
      return getCabinetTrace({ detail_product_type: detailProductType } as CartItem, detail);
    case DetailProductType.LONGDOOR:
      return getLongDoorTrace(detail, relatedDoors);
    default:
      return [{ label: "지원되지 않는 카테고리", value: "-", isFinal: true }];
  }
}
