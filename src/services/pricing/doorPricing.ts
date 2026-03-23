import { calculateDoorUnitPrice } from "./door/calculateDoorPrice";
import { DoorPricingOptions } from "./door/types";

/**
 * 문짝 가격 계산
 */
export function calculateUnitDoorPrice(
  color: string,
  width: number,
  height: number,
  isPairDoor: boolean = false,
  options?: DoorPricingOptions,
) {
  return calculateDoorUnitPrice({
    color,
    width,
    height,
    isPairDoor,
    options,
  });
}
