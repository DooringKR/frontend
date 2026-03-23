import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { calculateFinishUnitPrice } from "./finish/calculateFinishPrice";

/**
 * 마감재 단위 가격 계산
 */
export function calculateUnitFinishPrice(
  color: string,
  baseDepth: number,
  additionalDepth: number,
  baseHeight: number,
  additionalHeight: number,
  finishType: FinishType,
) {
  return calculateFinishUnitPrice({
    color,
    baseDepth,
    additionalDepth,
    baseHeight,
    additionalHeight,
    finishType,
  });
}
