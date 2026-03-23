import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

import { BASE_MARGIN_DEFAULT, ROUNDING_UNIT_WON } from "./constants";
import {
  calculateAbsorberSurcharge,
  calculateBodyMarginAddition,
  calculateDoorColorWeight,
  calculateDoorPricePerMm,
  calculateHandleSurcharge,
  calculateRailSurcharge,
} from "./rules";
import { CabinetPricingInput } from "./types";

function roundToManWon(value: number): number {
  return Math.ceil(value / ROUNDING_UNIT_WON) * ROUNDING_UNIT_WON;
}

function calculateFixedOptionPrice(input: CabinetPricingInput): number {
  const { category, handleType, width, options } = input;

  return calculateHandleSurcharge(category, handleType)
    + calculateAbsorberSurcharge(width, options?.absorberType, options?.absorberTypeDirectInput)
    + calculateRailSurcharge(options?.railType, options?.railTypeDirectInput, options?.drawerType);
}

export function calculateCabinetUnitPrice(input: CabinetPricingInput): number {
  const { category, color, width, depth, bodyType, options } = input;
  let cabinetDepthPrice = 0;
  let cabinetWidthPrice = 0;

  if (category === DetailProductType.LOWERCABINET || category === DetailProductType.TALLCABINET) {
    if (depth >= 1 && depth <= 400) {
      if (width >= 1 && width <= 900) {
        cabinetDepthPrice = 200;
      } else if (width > 900) {
        cabinetDepthPrice = 250;
      }
    } else if (depth > 400 && depth <= 650) {
      if (width >= 1 && width <= 900) {
        cabinetDepthPrice = 250;
      } else if (width > 900) {
        cabinetDepthPrice = 250;
      }
    } else if (depth > 650) {
      return 0;
    }

    const doorColorWeight = calculateDoorColorWeight(color);
    const margin = BASE_MARGIN_DEFAULT + calculateBodyMarginAddition(bodyType, options?.bodyMaterialDirectInput);
    const fixedOptionPrice = calculateFixedOptionPrice(input);
    const unitPrice = ((cabinetDepthPrice * width) * (1 + doorColorWeight) * (1 + margin)) + fixedOptionPrice;

    const roundedUnitPrice = roundToManWon(unitPrice);
    return category === DetailProductType.TALLCABINET ? roundedUnitPrice * 2 : roundedUnitPrice;
  }

  if (category === DetailProductType.UPPERCABINET) {
    if (depth >= 1 && depth <= 350) {
      cabinetDepthPrice = 150;
    } else if (depth > 350) {
      cabinetDepthPrice = 200;
    }

    const doorColorWeight = calculateDoorColorWeight(color);
    const margin = BASE_MARGIN_DEFAULT + calculateBodyMarginAddition(bodyType, options?.bodyMaterialDirectInput);
    const fixedOptionPrice = calculateFixedOptionPrice(input);
    const unitPrice = (cabinetDepthPrice * width * (1 + doorColorWeight) * (1 + margin)) + fixedOptionPrice;

    return roundToManWon(unitPrice);
  }

  if (category === DetailProductType.DRAWERCABINET) {
    const doorColorWeight = calculateDoorColorWeight(color);
    const margin = BASE_MARGIN_DEFAULT + calculateBodyMarginAddition(bodyType, options?.bodyMaterialDirectInput);
    const fixedOptionPrice = calculateFixedOptionPrice(input);
    const unitPrice = (width * 500 * (1 + doorColorWeight) * (1 + margin)) + fixedOptionPrice;

    return roundToManWon(unitPrice);
  }

  if (category === DetailProductType.OPENCABINET) {
    const doorColorPrice = calculateDoorPricePerMm(color);
    const margin = calculateBodyMarginAddition(bodyType, options?.bodyMaterialDirectInput);
    const fixedOptionPrice = calculateFixedOptionPrice(input);
    const unitPrice = (width * doorColorPrice * (1 + margin)) + fixedOptionPrice;

    return roundToManWon(unitPrice);
  }

  if (category === DetailProductType.FLAPCABINET) {
    if (width >= 1 && width <= 600) {
      cabinetWidthPrice = 250_000;
    } else if (width > 600 && width <= 1000) {
      cabinetWidthPrice = 350_000;
    } else if (width > 1000) {
      return 0;
    }

    if (depth >= 1 && depth <= 650) {
      cabinetDepthPrice = 0;
    } else if (depth > 650 && depth <= 750) {
      cabinetDepthPrice = 30_000;
    } else if (depth > 750) {
      return 60_000;
    }

    const doorColorWeight = calculateDoorColorWeight(color);
    const margin = calculateBodyMarginAddition(bodyType, options?.bodyMaterialDirectInput);
    const fixedOptionPrice = calculateFixedOptionPrice(input);
    const unitPrice = ((cabinetDepthPrice + cabinetWidthPrice) * (1 + doorColorWeight) * (1 + margin)) + fixedOptionPrice;

    return roundToManWon(unitPrice);
  }

  return 0;
}
