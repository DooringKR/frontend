import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import type { 
  DetailProductType, 
  ProductDetails,
  FinishDetails
} from "@/components/Card/ShoppingCartCardNew";
import formatColor from "@/utils/formatColor";

/**
 * Finish item interface - represents the item from itemStore
 */
export interface FinishItem {
  type: FinishType;
  color?: string | null;
  finish_color_direct_input?: string | null;
  edgeCount?: number;
  depth?: number;
  height?: number;
  depthIncrease?: number;
  heightIncrease?: number;
  finish_location?: string;
  request?: string;
  raw_images?: string[];
}

/**
 * Transform finish item to ShoppingCartCardNew props
 */
export function transformFinishToNewCardProps(item: FinishItem) {
  // Map FinishType to DetailProductType
  let detailProductType: DetailProductType;
  switch (item.type) {
    case FinishType.EP: // "EP 마감"
      detailProductType = "EP마감";
      break;
    case FinishType.MOLDING: // "몰딩"
      detailProductType = "몰딩";
      break;
    case FinishType.GALLE: // "걸레받이"
      detailProductType = "걸레받이";
      break;
    default:
      detailProductType = "EP마감";
  }

  // Format color
  const color = item.finish_color_direct_input
    ? `(직접입력) ${item.finish_color_direct_input}`
    : formatColor(item.color);

  const data: FinishDetails = {
    color,
    width: item.depth ?? 0,
    height: item.height ?? 0,
    widthIncrease: item.depthIncrease,
    heightIncrease: item.heightIncrease,
    edgeCount: item.edgeCount,
    location: item.finish_location,
    request: item.request,
    images: item.raw_images,
  };

  return {
    hasPreviewIcon: false,
    hasPrice: false,
    hasStepper: false,
    detailProductType,
    details: { type: detailProductType, data },
    price: 0,
    quantity: 0,
    trashable: false,
    onDecrease: () => {},
    onIncrease: () => {},
  };
}
