import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import { FINISH_MARGIN, FINISH_ROUNDING_UNIT_WON } from "./constants";
import { calculateFinishOriginalPrice, calculateFinishSplit, calculateGallePrice } from "./rules";
import { FinishPricingInput } from "./types";

function roundToUnit(value: number, unit: number): number {
  return Math.ceil(value / unit) * unit;
}

export function calculateFinishUnitPrice(input: FinishPricingInput): number {
  const totalDepth = input.baseDepth + input.additionalDepth;
  const totalHeight = input.baseHeight + input.additionalHeight;

  if (input.finishType === FinishType.GALLE) {
    return calculateGallePrice(totalDepth, totalHeight);
  }

  const originalPrice = calculateFinishOriginalPrice(input.color);
  const split = calculateFinishSplit(totalDepth, totalHeight, input.finishType);
  const unitPrice = (originalPrice / split) * (1 + FINISH_MARGIN);

  return roundToUnit(unitPrice, FINISH_ROUNDING_UNIT_WON);
}
