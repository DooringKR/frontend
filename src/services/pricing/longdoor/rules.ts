import { getPricingColorName } from "../colorMapping";
import {
  LONG_DOOR_GLASS_COLORS,
  LONG_DOOR_PREMIUM_COLORS,
  LONG_DOOR_STANDARD_COLORS,
  LONG_DOOR_UNIT_PRICE_TABLE,
} from "./constants";
import { LongDoorColorTier, LongDoorWidthTier } from "./types";

export function getLongDoorWidthTier(width: number): LongDoorWidthTier {
  if (width >= 600) return 2;
  if (width >= 450) return 1;
  return 0;
}

export function getLongDoorColorTier(color: string): LongDoorColorTier {
  const normalized = getPricingColorName(color);

  if (normalized.includes("필름 부착용 합판")) return "film";

  if (LONG_DOOR_PREMIUM_COLORS.includes(normalized as (typeof LONG_DOOR_PREMIUM_COLORS)[number])) {
    return "signature";
  }

  if (LONG_DOOR_STANDARD_COLORS.includes(normalized as (typeof LONG_DOOR_STANDARD_COLORS)[number])) {
    return "special";
  }

  if (LONG_DOOR_GLASS_COLORS.includes(normalized as (typeof LONG_DOOR_GLASS_COLORS)[number])) {
    return "glass";
  }

  return "signature";
}

export function getLongDoorUnitPriceByTier(colorTier: LongDoorColorTier, widthTier: LongDoorWidthTier): number {
  return LONG_DOOR_UNIT_PRICE_TABLE[colorTier][widthTier] * 10_000;
}
