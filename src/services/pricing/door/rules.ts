import { getPricingColorName } from "../colorMapping";
import {
  DOOR_PREMIUM_COLORS,
  DOOR_PREMIUM_ORIGINAL_PRICE,
  DOOR_STANDARD_COLORS,
  DOOR_STANDARD_ORIGINAL_PRICE,
} from "./constants";

export function calculateDoorOriginalPrice(color: string): number {
  const colorName = getPricingColorName(color);

  if (DOOR_PREMIUM_COLORS.includes(colorName as (typeof DOOR_PREMIUM_COLORS)[number])) {
    return DOOR_PREMIUM_ORIGINAL_PRICE;
  }

  if (DOOR_STANDARD_COLORS.includes(colorName as (typeof DOOR_STANDARD_COLORS)[number])) {
    return DOOR_STANDARD_ORIGINAL_PRICE;
  }

  return DOOR_STANDARD_ORIGINAL_PRICE;
}

export function calculateDoorSplit(widthInput: number, heightInput: number): number {
  const width = widthInput < heightInput ? widthInput : heightInput;
  const height = widthInput < heightInput ? heightInput : widthInput;

  if (width >= 1 && width <= 300) {
    if (height >= 1 && height <= 1100) return 7;
    if (height >= 1101 && height <= 1300) return 5;
    if (height >= 1301 && height <= 1500) return 4;
    if (height >= 1501) return 3;
  } else if (width >= 301 && width <= 400) {
    if (height >= 1 && height <= 900) return 6;
    if (height >= 901 && height <= 1100) return 5;
    if (height >= 1101 && height <= 1300) return 4;
    if (height >= 1301) return 3;
  } else if (width >= 401 && width <= 500) {
    if (height >= 1 && height <= 900) return 5;
    if (height >= 901 && height <= 1100) return 4;
    if (height >= 1101 && height <= 1700) return 3;
    if (height >= 1701) return 2;
  } else if (width >= 501 && width <= 600) {
    if (height >= 1 && height <= 900) return 4;
    if (height >= 901 && height <= 1500) return 3;
    if (height >= 1501) return 2;
  } else if (width >= 601 && width <= 1220) {
    if (height >= 1 && height <= 900) return 2;
    if (height >= 901 && height <= 1500) return 1.5;
    if (height >= 1501) return 1;
  }

  return 1;
}
