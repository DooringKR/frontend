import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import { getPricingColorName } from "../colorMapping";
import {
  FINISH_HERRINGBONE_15T_COLORS,
  FINISH_HERRINGBONE_15T_ORIGINAL_PRICE,
  FINISH_HERRINGBONE_18T_COLORS,
  FINISH_HERRINGBONE_18T_ORIGINAL_PRICE,
  FINISH_HERRINGBONE_3T_COLORS,
  FINISH_HERRINGBONE_3T_ORIGINAL_PRICE,
  FINISH_LPM_COLORS,
  FINISH_LPM_ORIGINAL_PRICE,
  FINISH_PREMIUM_COLORS,
  FINISH_PREMIUM_ORIGINAL_PRICE,
  FINISH_STANDARD_COLORS,
  FINISH_STANDARD_ORIGINAL_PRICE,
  GALLE_PRICE_LONG,
  GALLE_PRICE_SHORT,
} from "./constants";

export function calculateFinishOriginalPrice(color: string): number {
  const colorName = getPricingColorName(color);

  if (FINISH_STANDARD_COLORS.includes(colorName as (typeof FINISH_STANDARD_COLORS)[number])) {
    return FINISH_STANDARD_ORIGINAL_PRICE;
  }

  if (FINISH_PREMIUM_COLORS.includes(colorName as (typeof FINISH_PREMIUM_COLORS)[number])) {
    return FINISH_PREMIUM_ORIGINAL_PRICE;
  }

  if (FINISH_HERRINGBONE_3T_COLORS.includes(colorName as (typeof FINISH_HERRINGBONE_3T_COLORS)[number])) {
    return FINISH_HERRINGBONE_3T_ORIGINAL_PRICE;
  }

  if (FINISH_HERRINGBONE_15T_COLORS.includes(colorName as (typeof FINISH_HERRINGBONE_15T_COLORS)[number])) {
    return FINISH_HERRINGBONE_15T_ORIGINAL_PRICE;
  }

  if (FINISH_HERRINGBONE_18T_COLORS.includes(colorName as (typeof FINISH_HERRINGBONE_18T_COLORS)[number])) {
    return FINISH_HERRINGBONE_18T_ORIGINAL_PRICE;
  }

  if (FINISH_LPM_COLORS.includes(colorName as (typeof FINISH_LPM_COLORS)[number])) {
    return FINISH_LPM_ORIGINAL_PRICE;
  }

  return FINISH_STANDARD_ORIGINAL_PRICE;
}

export function calculateGallePrice(totalDepth: number, totalHeight: number): number {
  const horizontalLength = Math.max(totalDepth, totalHeight);
  return horizontalLength <= 1000 ? GALLE_PRICE_SHORT : GALLE_PRICE_LONG;
}

export function calculateFinishSplit(depthInput: number, heightInput: number, finishType: FinishType): number {
  const depth = depthInput > heightInput ? heightInput : depthInput;
  const height = depthInput > heightInput ? depthInput : heightInput;
  const length = height / 1000;

  if (finishType === FinishType.GALLE) {
    return 8 / length;
  }

  let split = 1;

  if (depth >= 1 && depth <= 300) {
    if (height >= 1 && height <= 1100) split = 7;
    else if (height >= 1101 && height <= 1300) split = 5;
    else if (height >= 1301 && height <= 1500) split = 4;
    else if (height >= 1501) split = 3;
  } else if (depth >= 301 && depth <= 400) {
    if (height >= 1 && height <= 900) split = 6;
    else if (height >= 901 && height <= 1100) split = 5;
    else if (height >= 1101 && height <= 1300) split = 4;
    else if (height >= 1301) split = 3;
  } else if (depth >= 401 && depth <= 500) {
    if (height >= 1 && height <= 900) split = 5;
    else if (height >= 901 && height <= 1100) split = 4;
    else if (height >= 1101 && height <= 1700) split = 3;
    else if (height >= 1701) split = 2;
  } else if (depth >= 501 && depth <= 600) {
    if (height >= 1 && height <= 900) split = 4;
    else if (height >= 901 && height <= 1500) split = 3;
    else if (height >= 1501) split = 2;
  } else if (depth >= 601 && depth <= 1220) {
    if (height >= 1 && height <= 900) split = 2;
    else if (height >= 901 && height <= 1500) split = 1.5;
    else if (height >= 1501) split = 1;
  }

  if (finishType === FinishType.MOLDING) {
    split /= length;
  }

  return split;
}
