import { getKnownHingeCount } from "../priceAdjustments";
import { LONG_DOOR_HINGE_SURCHARGE_PER_ONE } from "./constants";
import { getLongDoorColorTier, getLongDoorUnitPriceByTier, getLongDoorWidthTier } from "./rules";
import { LongDoorPricingInput } from "./types";

export function calculateLongDoorUnitPriceCore(color: string, width: number): number {
  const widthTier = getLongDoorWidthTier(width);
  const colorTier = getLongDoorColorTier(color);

  return getLongDoorUnitPriceByTier(colorTier, widthTier);
}

export function calculateLongDoorUnitPriceWithOptionsCore(input: LongDoorPricingInput): number {
  const basePrice = calculateLongDoorUnitPriceCore(input.color, input.width);

  if (!input.addOnHinge) {
    return basePrice;
  }

  return basePrice + (getKnownHingeCount(input.hinge) * LONG_DOOR_HINGE_SURCHARGE_PER_ONE);
}
