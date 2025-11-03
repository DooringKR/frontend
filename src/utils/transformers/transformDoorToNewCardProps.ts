import { DoorType, HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import type { 
  DetailProductType, 
  ProductDetails,
  DoorStandardDetails, 
  DoorFlapDetails, 
  DoorDrawerDetails
} from "@/components/Card/ShoppingCartCardNew";
import formatColor from "@/utils/formatColor";

/**
 * Door item interface - represents the item from itemStore
 */
export interface DoorItem {
  type: DoorType;
  color?: string | null;
  door_color_direct_input?: string | null;
  door_width?: number;
  door_height?: number;
  hinge?: number[] | null;
  hinge_direction?: HingeDirection;
  door_location?: string;
  addOn_hinge?: boolean;
  door_request?: string;
  raw_images?: string[];
}

/**
 * Transform door item to ShoppingCartCardNew props
 */
export function transformDoorToNewCardProps(item: DoorItem) {
  const doorType = item.type;

  // Map DoorType to DetailProductType (DoorType enum values are in Korean)
  let detailProductType: DetailProductType;
  switch (doorType) {
    case DoorType.STANDARD: // "일반문"
      detailProductType = "일반문";
      break;
    case DoorType.FLAP: // "플랩문"
      detailProductType = "플랩문";
      break;
    case DoorType.DRAWER: // "서랍문"
      detailProductType = "서랍 마에다";
      break;
    default:
      detailProductType = "일반문";
  }

  // Determine hinge count from array
  let hingeCount: number | "모름" | undefined;
  if (!item.hinge) {
    hingeCount = undefined;
  } else if (item.hinge.length === 1 && item.hinge[0] === null) {
    hingeCount = "모름";
  } else {
    hingeCount = item.hinge.length;
  }

  // Determine hinge direction
  let hingeDirection: "좌경" | "우경" | "모름" | undefined;
  if (item.hinge_direction === HingeDirection.LEFT) {
    hingeDirection = "좌경";
  } else if (item.hinge_direction === HingeDirection.RIGHT) {
    hingeDirection = "우경";
  } else if (item.hinge_direction === HingeDirection.UNKNOWN) {
    hingeDirection = "모름";
  } else {
    hingeDirection = undefined;
  }

  // Determine boringDimensions - 보링 치수는 경첩 개수와 방향을 둘 다 알 때만 표시
  // 기존 로직: boring.length > 1 && hingeDirection !== UNKNOWN
  let boringDimensions: (number | "모름")[] | undefined;
  if (item.hinge && 
      item.hinge.length > 1 && 
      item.hinge_direction !== HingeDirection.UNKNOWN) {
    // null 값은 "모름"으로 변환
    boringDimensions = item.hinge.map(val => val === null ? "모름" : val);
  }

  // Build common fields - ensure required fields have defaults
  // Format color same as old component: use formatColor for DB colors, or "(직접입력) " prefix for direct input
  const color = item.door_color_direct_input 
    ? `(직접입력) ${item.door_color_direct_input}`
    : formatColor(item.color);
  const width = item.door_width ?? 0;
  const height = item.door_height ?? 0;

  // Build common props
  const commonProps = {
    hasPreviewIcon: true,
    hasPrice: false,
    hasStepper: false,
    price: 0,
    quantity: 0,
    trashable: false,
    onDecrease: () => {},
    onIncrease: () => {},
  };

  // Build type-specific details
  if (doorType === DoorType.STANDARD) {
    const data: DoorStandardDetails = {
      color,
      width,
      height,
      hingeCount,
      hingeDirection,
      boringDimensions,
      location: item.door_location,
      addOnHinge: item.addOn_hinge,
      request: item.door_request,
    };
    return { 
      ...commonProps,
      detailProductType: "일반문" as const, 
      details: { type: "일반문" as const, data } 
    };
  } else if (doorType === DoorType.FLAP) {
    const data: DoorFlapDetails = {
      color,
      width,
      height,
      hingeCount,
      boringDimensions,
      location: item.door_location,
      addOnHinge: item.addOn_hinge,
      request: item.door_request,
    };
    return { 
      ...commonProps,
      detailProductType: "플랩문" as const, 
      details: { type: "플랩문" as const, data } 
    };
  } else {
    // DRAWER
    const data: DoorDrawerDetails = {
      color,
      width,
      height,
      location: item.door_location,
      request: item.door_request,
    };
    return { 
      ...commonProps,
      detailProductType: "서랍 마에다" as const, 
      details: { type: "서랍 마에다" as const, data } 
    };
  }
}
