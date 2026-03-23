import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CabinetHandleType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import { calculateCabinetUnitPrice } from "./cabinet/calculateCabinetPrice";
import { CabinetPricingOptions } from "./cabinet/types";

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
  options?: CabinetPricingOptions,
): number {
  return calculateCabinetUnitPrice({
    category,
    color,
    width,
    bodyType,
    handleType,
    depth,
    options,
  });
}

