import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

export type FinishPricingInput = {
  color: string;
  baseDepth: number;
  additionalDepth: number;
  baseHeight: number;
  additionalHeight: number;
  finishType: FinishType;
};
