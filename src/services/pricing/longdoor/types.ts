export type LongDoorWidthTier = 0 | 1 | 2;
export type LongDoorColorTier = "film" | "special" | "signature" | "glass" | "other";

export type LongDoorPricingInput = {
  color: string;
  width: number;
  addOnHinge?: boolean;
  hinge?: Array<number | null | undefined> | null;
};
