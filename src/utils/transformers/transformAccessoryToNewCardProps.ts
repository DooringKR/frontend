import type { 
  DetailProductType, 
  AccessoryDetails
} from "@/components/Card/ShoppingCartCardNew";

/**
 * Accessory item interface - represents the item from itemStore
 */
export interface AccessoryItem {
  type?: string | null; // "싱크볼", "쿡탑", "후드"
  slug?: string | null;
  accessory_madeby?: string | null;
  accessory_model?: string | null;
  request?: string | null;
  raw_images?: string[];
}

/**
 * Transform accessory item to ShoppingCartCardNew props
 */
export function transformAccessoryToNewCardProps(item: AccessoryItem) {
  // Map accessory type to DetailProductType
  let detailProductType: DetailProductType;
  if (item.type === "싱크볼" || item.slug === "sink") {
    detailProductType = "싱크볼";
  } else if (item.type === "쿡탑" || item.slug === "cooktop") {
    detailProductType = "쿡탑";
  } else if (item.type === "후드" || item.slug === "hood") {
    detailProductType = "후드";
  } else {
    detailProductType = "싱크볼"; // default
  }

  // Build accessory data
  const data: AccessoryDetails = {
    manufacturer: item.accessory_madeby ?? undefined,
    modelName: item.accessory_model ?? undefined,
    size: undefined, // 부속에는 size 정보가 없는 것으로 보임
    request: item.request ?? undefined,
    images: item.raw_images,
  };

  // Build props
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

  return { ...commonProps, detailProductType, details: { type: detailProductType, data } };
}
