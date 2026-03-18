import { getAbsorberTypeById } from "dooring-core-domain/dist/constants/absorberType";
import { getBodyMaterialById } from "dooring-core-domain/dist/constants/bodyMaterial";
import { getCabinetDrawerTypeById } from "dooring-core-domain/dist/constants/cabinetDrawerType";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import {
  AbsorberType,
  BodyMaterial,
  CabinetDrawerType,
  CabinetHandleType,
  CabinetRailType,
} from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import { getPricingColorName } from "../colorMapping";
import {
  ABSORBER_SURCHARGE_DEFAULT,
  ABSORBER_SURCHARGE_WIDE,
  PREMIUM_COLORS,
  PREMIUM_COLOR_WEIGHT,
  PREMIUM_DOOR_PRICE_PER_MM,
  PUSH_HANDLE_SURCHARGE_DEFAULT,
  PUSH_HANDLE_SURCHARGE_LOWER,
  RAIL_PRICE_BLUM_TANDEM,
  RAIL_PRICE_DAMPING_BALL_RAIL,
  RAIL_PRICE_DOMESTIC_TANDEM,
  RAIL_PRICE_HETTICH,
  RAIL_PRICE_UNDER_RAIL,
  STANDARD_COLORS,
  STANDARD_COLOR_WEIGHT,
  STANDARD_DOOR_PRICE_PER_MM,
} from "./constants";

function isStandardColor(colorName: string): boolean {
  return STANDARD_COLORS.includes(colorName as (typeof STANDARD_COLORS)[number]);
}

function isPremiumColor(colorName: string): boolean {
  return PREMIUM_COLORS.includes(colorName as (typeof PREMIUM_COLORS)[number]);
}

export function calculateDoorColorWeight(color: string): number {
  const colorName = getPricingColorName(color);

  if (isStandardColor(colorName)) {
    return STANDARD_COLOR_WEIGHT;
  }

  if (isPremiumColor(colorName)) {
    return PREMIUM_COLOR_WEIGHT;
  }

  return STANDARD_COLOR_WEIGHT;
}

export function calculateDoorPricePerMm(color: string): number {
  const colorName = getPricingColorName(color);

  if (isStandardColor(colorName)) {
    return STANDARD_DOOR_PRICE_PER_MM;
  }

  if (isPremiumColor(colorName)) {
    return PREMIUM_DOOR_PRICE_PER_MM;
  }

  return STANDARD_DOOR_PRICE_PER_MM;
}

export function calculateBodyMarginAddition(bodyType: number, bodyMaterialDirectInput?: string | null): number {
  if (bodyMaterialDirectInput && bodyMaterialDirectInput.trim().length > 0) {
    return 0.3;
  }

  const material = getBodyMaterialById(bodyType);
  if (!material) return 0;

  switch (material.name as BodyMaterial) {
    case BodyMaterial.HERRINGBONE_PP_15T:
      return 0;
    case BodyMaterial.HERRINGBONE_PP_18T:
      return 0.1;
    case BodyMaterial.PATAGONIA_CREAM_LPM_18T:
      return 0.3;
    case BodyMaterial.DIRECT_INPUT:
      return 0.3;
    default:
      return 0;
  }
}

function getDrawerMultiplier(drawerType: number | null | undefined): number {
  if (drawerType == null) {
    return 1;
  }

  const drawerTypeName = getCabinetDrawerTypeById(drawerType)?.name as CabinetDrawerType | undefined;

  switch (drawerTypeName) {
    case CabinetDrawerType.TWO_DRAWERS:
      return 2;
    case CabinetDrawerType.THREE_DRAWERS_112:
    case CabinetDrawerType.THREE_DRAWERS_21:
      return 3;
    default:
      return 1;
  }
}

function getRailUnitPrice(railType: CabinetRailType | string | null | undefined, railTypeDirectInput?: string | null): number {
  if (railTypeDirectInput && railTypeDirectInput.trim().length > 0) {
    return RAIL_PRICE_BLUM_TANDEM;
  }

  switch (railType as CabinetRailType | undefined) {
    case CabinetRailType.BLUM_TANDEM:
      return RAIL_PRICE_BLUM_TANDEM;
    case CabinetRailType.DOMESTIC_TANDEM:
      return RAIL_PRICE_DOMESTIC_TANDEM;
    case CabinetRailType.HETTICH:
      return RAIL_PRICE_HETTICH;
    case CabinetRailType.UNDER_RAIL:
      return RAIL_PRICE_UNDER_RAIL;
    case CabinetRailType.DAMPING_BALL_RAIL:
      return RAIL_PRICE_DAMPING_BALL_RAIL;
    case CabinetRailType.NORMAL_BALL_RAIL:
      return 0;
    case CabinetRailType.DIRECT_INPUT:
      return RAIL_PRICE_BLUM_TANDEM;
    default:
      return 0;
  }
}

export function calculateRailSurcharge(
  railType: CabinetRailType | string | null | undefined,
  railTypeDirectInput: string | null | undefined,
  drawerType: number | null | undefined,
): number {
  const railUnitPrice = getRailUnitPrice(railType, railTypeDirectInput);
  return railUnitPrice * getDrawerMultiplier(drawerType);
}

export function calculateHandleSurcharge(
  category: DetailProductType,
  handleType: CabinetHandleType | string | null | undefined,
): number {
  if (handleType !== CabinetHandleType.PUSH) {
    return 0;
  }

  return category === DetailProductType.LOWERCABINET
    ? PUSH_HANDLE_SURCHARGE_LOWER
    : PUSH_HANDLE_SURCHARGE_DEFAULT;
}

export function calculateAbsorberSurcharge(
  width: number,
  absorberType: number | null | undefined,
  absorberTypeDirectInput?: string | null,
): number {
  const absorberTypeName = absorberType == null
    ? undefined
    : (getAbsorberTypeById(absorberType)?.name as AbsorberType | undefined);

  const hasAbsorber = Boolean(
    (absorberTypeDirectInput && absorberTypeDirectInput.trim().length > 0)
    || (absorberTypeName && absorberTypeName !== AbsorberType.NONE),
  );

  if (!hasAbsorber) {
    return 0;
  }

  return width > 900 ? ABSORBER_SURCHARGE_WIDE : ABSORBER_SURCHARGE_DEFAULT;
}
