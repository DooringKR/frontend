import type { 
  DetailProductType, 
  ProductDetails,
  CabinetBaseDetails,
  CabinetLowerDetails,
  CabinetDrawerDetails,
  CabinetFlapDetails,
  CabinetTallDetails,
  CabinetOpenDetails
} from "@/components/Card/ShoppingCartCardNew";
import formatColor from "@/utils/formatColor";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_COLOR_LIST, OPEN_CABINET_BODY_MATERIAL_LIST } from "@/constants/colorList";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";

/**
 * Cabinet item interface - represents the item from itemStore
 */
export interface CabinetItem {
  type: string; // "상부장", "하부장", "서랍장", "플랩장", "키큰장", "오픈장"
  color?: string | number | null;
  cabinet_color_direct_input?: string | null;
  width?: number;
  height?: number;
  depth?: number;
  bodyMaterial?: string | number | null;  // string(리포트 페이지) 또는 number(DB에서 조회)
  body_material_direct_input?: string | null;
  handleType?: string;
  finishType?: string; // behindType
  drawer_type?: string | number;
  drawer_type_direct_input?: string;
  rail_type?: string;
  rail_type_direct_input?: string;
  absorber_type?: string | number;
  absorber_type_direct_input?: string;
  legType?: string;
  legType_direct_input?: string;
  riceRail?: string; // "추가" | "추가 안 함"
  lowerDrawer?: string; // "추가" | "추가 안 함"
  cabinet_construct?: boolean;
  cabinet_location?: string;
  request?: string;
  raw_images?: string[];
}

/**
 * Transform cabinet item to ShoppingCartCardNew props
 */
export function transformCabinetToNewCardProps(item: CabinetItem) {
  // Map cabinet type to DetailProductType
  let detailProductType: DetailProductType;
  switch (item.type) {
    case "상부장":
      detailProductType = "상부장";
      break;
    case "하부장":
      detailProductType = "하부장";
      break;
    case "서랍장":
      detailProductType = "서랍장";
      break;
    case "플랩장":
      detailProductType = "플랩장";
      break;
    case "키큰장":
      detailProductType = "키큰장";
      break;
    case "오픈장":
      detailProductType = "오픈장";
      break;
    default:
      detailProductType = "하부장";
  }

  // Format color
  const colorList = detailProductType === "오픈장" ? OPEN_CABINET_BODY_MATERIAL_LIST : CABINET_COLOR_LIST;
  const colorObj = typeof item.color === "number" 
    ? colorList.find(c => c.id === item.color)
    : colorList.find(c => c.name === item.color);
  
  const color = item.cabinet_color_direct_input
    ? `(직접입력) ${item.cabinet_color_direct_input}`
    : colorObj 
    ? formatColor(colorObj.name)
    : formatColor(item.color as string);

  // Format body material
  const bodyMaterialObj = typeof item.bodyMaterial === "number"
    ? BODY_MATERIAL_LIST.find(b => b.id === item.bodyMaterial)
    : typeof item.bodyMaterial === "string"
    ? BODY_MATERIAL_LIST.find(b => b.name === item.bodyMaterial)
    : undefined;
  
  const bodyMaterial = item.body_material_direct_input
    ? `(직접입력) ${item.body_material_direct_input}`
    : bodyMaterialObj?.name || (typeof item.bodyMaterial === "string" ? item.bodyMaterial : undefined);


  const drawerTypeObj = typeof item.drawer_type === "number"
    ? CABINET_DRAWER_TYPE_LIST.find(d => d.id === item.drawer_type)
    : undefined;

  // Format drawer type
  const drawerType = item.drawer_type_direct_input
    ? `(직접입력) ${item.drawer_type_direct_input}`
    : drawerTypeObj
    ? drawerTypeObj.name
    : item.drawer_type
    ? String(item.drawer_type)
    : undefined;

  // Format rail type
  const railType = item.rail_type_direct_input
    ? `(직접입력) ${item.rail_type_direct_input}`
    : item.rail_type;

  // Format absorber type
  const absorberTypeObj = typeof item.absorber_type === "number"
    ? ABSORBER_TYPE_LIST.find(a => a.id === item.absorber_type)
    : undefined;
  
  const absorberType = item.absorber_type_direct_input
    ? `(직접입력) ${item.absorber_type_direct_input}`
    : absorberTypeObj
    ? absorberTypeObj.name
    : item.absorber_type
    ? String(item.absorber_type)
    : undefined;

  // Format leg type
  const legType = item.legType_direct_input
    ? `(직접입력) ${item.legType_direct_input}`
    : item.legType;

  // Build common data
  const baseData: CabinetBaseDetails = {
    color,
    width: item.width ?? 0,
    height: item.height ?? 0,
    depth: item.depth ?? 0,
    bodyMaterial,
    handleType: item.handleType,
    behindType: item.finishType,
    cabinetConstruct: item.cabinet_construct,
    location: item.cabinet_location,
    request: item.request,
    images: item.raw_images,
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
  if (detailProductType === "하부장") {
    const data: CabinetLowerDetails = { ...baseData, legType };
    return { ...commonProps, detailProductType, details: { type: "하부장" as const, data } };
  } else if (detailProductType === "서랍장") {
    const data: CabinetDrawerDetails = { ...baseData, drawerType, railType, legType, absorberType };
    return { ...commonProps, detailProductType, details: { type: "서랍장" as const, data } };
  } else if (detailProductType === "플랩장") {
    const data: CabinetFlapDetails = { ...baseData, absorberType };
    return { ...commonProps, detailProductType, details: { type: "플랩장" as const, data } };
  } else if (detailProductType === "키큰장") {
    const data: CabinetTallDetails = { ...baseData, legType };
    return { ...commonProps, detailProductType, details: { type: "키큰장" as const, data } };
  } else if (detailProductType === "오픈장") {
    const data: CabinetOpenDetails = { 
      ...baseData, 
      addRiceCookerRail: item.riceRail === "추가",
      addBottomDrawer: item.lowerDrawer === "추가",
    };
    return { ...commonProps, detailProductType, details: { type: "오픈장" as const, data } };
  } else {
    // 상부장
    return { ...commonProps, detailProductType, details: { type: detailProductType, data: baseData } };
  }
}
