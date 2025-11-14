import type { 
  DetailProductType, 
  HardwareBaseDetails,
  HardwareHingeDetails,
  HardwareRailDetails,
  HardwarePieceDetails
} from "@/components/Card/ShoppingCartCardNew";
import { HardwareType, HardwareMadeBy, HingeThickness, HingeAngle, RailType, RailLength } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

/**
 * Hardware item interface - represents the item from itemStore
 */
export interface HardwareItem {
  type: string; // "경첩", "레일", "피스"
  madeby?: string | null;
  madebyInput?: string | null;
  thickness?: string | null;
  thicknessInput?: string | null;
  angle?: string | null;
  angleInput?: string | null;
  railType?: string | null;
  railTypeInput?: string | null;
  railLength?: string | null;
  railLengthInput?: string | null;
  railDamping?: boolean | null;
  color?: string | null;
  size?: string | null;
  request?: string | null;
}

/**
 * Transform hardware item to ShoppingCartCardNew props
 */
export function transformHardwareToNewCardProps(item: HardwareItem) {
  // Map hardware type to DetailProductType
  let detailProductType: DetailProductType;
  switch (item.type) {
    case HardwareType.HINGE:
      detailProductType = "경첩";
      break;
    case HardwareType.RAIL:
      detailProductType = "레일";
      break;
    case HardwareType.PIECE:
      detailProductType = "피스";
      break;
    default:
      detailProductType = "경첩";
  }

  // Format manufacturer
  const manufacturer = item.madeby === HardwareMadeBy.DIRECT_INPUT
    ? item.madebyInput 
      ? `(직접입력) ${item.madebyInput}`
      : undefined
    : item.madeby ?? undefined;

  // Build common data
  const baseData: HardwareBaseDetails = {
    manufacturer,
    color: item.color ?? undefined,
    size: item.size ?? undefined,
    request: item.request ?? undefined,
    images: undefined,
  };

  // Build type-specific details
  const commonProps = {
    hasPreviewIcon: false,
    hasPrice: false,
    hasStepper: false,
    price: 0,
    quantity: 0,
    trashable: false,
    onDecrease: () => {},
    onIncrease: () => {},
  };

  // Return with proper type based on detailProductType
  if (detailProductType === "경첩") {
    // Format thickness and angle
    const thickness: string | undefined = item.thickness === HingeThickness.DIRECT_INPUT
      ? item.thicknessInput 
        ? `(직접입력) ${item.thicknessInput}`
        : undefined
      : item.thickness ? item.thickness : undefined;

    const angle: string | undefined = item.angle === HingeAngle.DIRECT_INPUT
      ? item.angleInput 
        ? `(직접입력) ${item.angleInput}`
        : undefined
      : item.angle ? item.angle : undefined;

    const data: HardwareHingeDetails = { ...baseData, thickness, angle };
    return { ...commonProps, detailProductType, details: { type: "경첩" as const, data } };
  } else if (detailProductType === "레일") {
    // Format rail type and length
    const railType: string | undefined = item.railType === RailType.DIRECT_INPUT
      ? item.railTypeInput 
        ? `(직접입력) ${item.railTypeInput}`
        : undefined
      : item.railType ? item.railType : undefined;

    const railLength: string | undefined = item.railLength === RailLength.DIRECT_INPUT
      ? item.railLengthInput 
        ? `(직접입력) ${item.railLengthInput}`
        : undefined
      : item.railLength ? item.railLength : undefined;

    // railDamping은 볼레일일 때만 표시
    const railDamping: boolean | undefined = item.railType === RailType.BALL
      ? (item.railDamping !== null && item.railDamping !== undefined ? item.railDamping : undefined)
      : undefined;

    const data: HardwareRailDetails = { 
      ...baseData, 
      railType,
      railLength,
      railDamping
    };
    return { ...commonProps, detailProductType, details: { type: "레일" as const, data } };
  } else {
    // 피스
    const data: HardwarePieceDetails = baseData;
    return { ...commonProps, detailProductType, details: { type: "피스" as const, data } };
  }
}
