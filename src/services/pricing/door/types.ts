export type DoorPricingOptions = {
  addOnHinge?: boolean;
  hinge?: Array<number | null | undefined> | null;
};

export type DoorPricingInput = {
  color: string;
  width: number;
  height: number;
  isPairDoor?: boolean;
  options?: DoorPricingOptions;
};
