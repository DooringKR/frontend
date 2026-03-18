type NullableNumberArray = Array<number | null | undefined> | null | undefined;

import { CabinetHandleType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

export type DeliveryPricingMode = "TODAY" | "RESERVED" | "GENERAL";

const TODAY_DELIVERY_MULTIPLIER = 1.15;
const RESERVED_DELIVERY_MULTIPLIER = 1.05;
const GENERAL_DELIVERY_MULTIPLIER = 1;

export function getKnownHingeCount(hinge: NullableNumberArray): number {
  if (!hinge || hinge.length === 0) {
    return 0;
  }

  if (hinge.length === 1 && (hinge[0] === null || hinge[0] === undefined)) {
    return 0;
  }

  return hinge.length;
}

export function calculateDoorHingeSurcharge(params: {
  addOnHinge?: boolean;
  hinge?: NullableNumberArray;
  isPairDoor?: boolean;
}): number {
  if (!params.addOnHinge) {
    return 0;
  }

  const hingeCount = getKnownHingeCount(params.hinge);
  const doorCount = params.isPairDoor ? 2 : 1;

  return hingeCount * doorCount * 10_000;
}

export function getDeliveryPricingMode(order: {
  is_today_delivery?: boolean | null;
  is_date_free?: boolean | null;
} | null | undefined): DeliveryPricingMode {
  if (order?.is_today_delivery) {
    return "TODAY";
  }

  if (order?.is_date_free) {
    return "GENERAL";
  }

  return "RESERVED";
}

export function getDeliveryPriceMultiplier(order: {
  is_today_delivery?: boolean | null;
  is_date_free?: boolean | null;
} | null | undefined): number {
  switch (getDeliveryPricingMode(order)) {
    case "TODAY":
      return TODAY_DELIVERY_MULTIPLIER;
    case "GENERAL":
      return GENERAL_DELIVERY_MULTIPLIER;
    case "RESERVED":
    default:
      return RESERVED_DELIVERY_MULTIPLIER;
  }
}

export function applyDeliveryPriceMultiplier(
  basePrice: number,
  order: {
    is_today_delivery?: boolean | null;
    is_date_free?: boolean | null;
  } | null | undefined,
): number {
  return Math.round(basePrice * getDeliveryPriceMultiplier(order));
}

export function isOuterHandleType(handleType: string | null | undefined): boolean {
  return handleType === CabinetHandleType.OUTER;
}