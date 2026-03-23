import { calculateDoorHingeSurcharge } from "../priceAdjustments";
import { DOOR_MARGIN, DOOR_ROUNDING_UNIT_WON } from "./constants";
import { calculateDoorOriginalPrice, calculateDoorSplit } from "./rules";
import { DoorPricingInput } from "./types";

function roundToUnit(value: number, unit: number): number {
  return Math.ceil(value / unit) * unit;
}

export function calculateDoorUnitPrice(input: DoorPricingInput): number {
  const originalPrice = calculateDoorOriginalPrice(input.color);
  const split = calculateDoorSplit(input.width, input.height);
  const unitPrice = (originalPrice / split) * (1 + DOOR_MARGIN);

  const basePrice = roundToUnit(unitPrice, DOOR_ROUNDING_UNIT_WON);
  const doorPrice = input.isPairDoor ? basePrice * 2 : basePrice;

  return doorPrice + calculateDoorHingeSurcharge({
    addOnHinge: input.options?.addOnHinge,
    hinge: input.options?.hinge,
    isPairDoor: input.isPairDoor,
  });
}
