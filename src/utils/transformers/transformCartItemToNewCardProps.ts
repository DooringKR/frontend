import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { DOOR_COLOR_LIST, CABINET_COLOR_LIST, FINISH_COLOR_LIST } from "@/constants/colorList";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { transformDoorToNewCardProps } from "./transformDoorToNewCardProps";
import { transformFinishToNewCardProps } from "./transformFinishToNewCardProps";
import { transformCabinetToNewCardProps } from "./transformCabinetToNewCardProps";
import { transformHardwareToNewCardProps } from "./transformHardwareToNewCardProps";
import { transformAccessoryToNewCardProps } from "./transformAccessoryToNewCardProps";

/**
 * CartItem과 detail을 받아서 ShoppingCartCardNew의 props로 변환하는 통합 함수
 * - Color/BodyMaterial ID → Name 변환 처리
 * - Category별로 적절한 개별 transformer 호출
 * - Cart 전용 props (price, quantity, hasPrice, hasStepper, trashable) 추가
 * @param relatedDoors 롱문의 경우 관련 Door 배열 (선택사항)
 */
export function transformCartItemToNewCardProps(cartItem: CartItem, detail: any, relatedDoors?: any[]) {
  const category = cartItem.detail_product_type;

  if (!detail) return null;

  // LONGDOOR (롱문)
  if (category === DetailProductType.LONGDOOR) {
    // 롱문의 색상 정보는 LongDoor 객체에서 가져옴
    const colorName = detail.door_color_direct_input
      ? detail.door_color_direct_input
      : (detail.door_color ? DOOR_COLOR_LIST.find(c => c.id === detail.door_color)?.name || detail.door_color : undefined);

    const longDoorItem = {
      type: "롱문" as const,
      color: colorName,
      door_color_direct_input: detail.door_color_direct_input,
      door_width: undefined, // 롱문은 개별 문의 너비가 다를 수 있으므로 표시하지 않음
      door_height: detail.door_height,
      handleType: detail.handle_type ?? null,
      handleTypeDirectInput: detail.handle_type_direct_input ?? null,
      hinge: undefined, // 롱문은 개별 문의 경첩 정보가 다를 수 있으므로 표시하지 않음
      hinge_direction: undefined, // 롱문은 개별 문의 경첩 방향이 다를 수 있으므로 표시하지 않음
      door_location: detail.door_location,
      door_construct: detail.door_construct,
      addOn_hinge: detail.addOn_hinge,
      hinge_thickness: detail.hinge_thickness,
      door_request: detail.long_door_request,
      raw_images: detail.long_door_image_url,
      is_pair_door: false, // 롱문은 항상 단문
    };
    return {
      ...transformDoorToNewCardProps(longDoorItem),
      price: cartItem.unit_price * cartItem.item_count,
      quantity: cartItem.item_count,
      hasPrice: true,
      hasStepper: true,
      trashable: true,
    };
  }

  // DOOR
  if (category === DetailProductType.DOOR) {
    const colorName = DOOR_COLOR_LIST.find(c => c.id === detail.door_color)?.name || detail.door_color;
    const doorItem = {
      type: detail.door_type || "일반문",
      color: colorName,
      door_color_direct_input: detail.door_color_direct_input,
      door_width: detail.door_width,
      door_height: detail.door_height,
      hinge: detail.hinge,
      hinge_direction: detail.hinge_direction,
      door_location: detail.door_location,
      door_construct: detail.door_construct,
      addOn_hinge: detail.addOn_hinge,
      hinge_thickness: detail.hinge_thickness,
      door_request: detail.door_request,
      raw_images: detail.door_image_url,
      is_pair_door: detail.is_pair_door,
    };
    return {
      ...transformDoorToNewCardProps(doorItem),
      price: cartItem.unit_price * cartItem.item_count,
      quantity: cartItem.item_count,
      hasPrice: true,
      hasStepper: true,
      trashable: true,
    };
  }

  // FINISH
  if (category === DetailProductType.FINISH) {
    const colorName = FINISH_COLOR_LIST.find(c => c.id === detail.finish_color)?.name || detail.finish_color;
    const finishItem = {
      type: detail.finish_type,
      color: colorName,
      finish_color_direct_input: detail.finish_color_direct_input,
      depth: detail.finish_base_depth,
      depthIncrease: detail.finish_additional_depth,
      height: detail.finish_base_height,
      heightIncrease: detail.finish_additional_height,
      edgeCount: detail.finish_edge_count,
      finish_location: detail.finish_location,
      request: detail.finish_request,
      raw_images: detail.finish_image_url,
    };
    return {
      ...transformFinishToNewCardProps(finishItem),
      price: cartItem.unit_price * cartItem.item_count,
      quantity: cartItem.item_count,
      hasPrice: true,
      hasStepper: true,
      trashable: true,
    };
  }

  // CABINET (6 types)
  if (
    category === DetailProductType.UPPERCABINET ||
    category === DetailProductType.LOWERCABINET ||
    category === DetailProductType.TALLCABINET ||
    category === DetailProductType.FLAPCABINET ||
    category === DetailProductType.DRAWERCABINET ||
    category === DetailProductType.OPENCABINET
  ) {
    const cabinetType =
      category === DetailProductType.UPPERCABINET ? "상부장" :
        category === DetailProductType.LOWERCABINET ? "하부장" :
          category === DetailProductType.TALLCABINET ? "키큰장" :
            category === DetailProductType.FLAPCABINET ? "플랩장" :
              category === DetailProductType.DRAWERCABINET ? "서랍장" :
                category === DetailProductType.OPENCABINET ? "오픈장" : "하부장";

    const colorName = CABINET_COLOR_LIST.find(c => c.id === detail.cabinet_color)?.name || detail.cabinet_color;
    const bodyMaterialName = BODY_MATERIAL_LIST.find(b => b.id === detail.cabinet_body_material)?.name || detail.cabinet_body_material;

    const cabinetItem = {
      type: cabinetType,
      color: colorName,
      cabinet_color_direct_input: detail.cabinet_color_direct_input,
      width: detail.cabinet_width,
      height: detail.cabinet_height,
      depth: detail.cabinet_depth,
      bodyMaterial: bodyMaterialName,
      body_material_direct_input: detail.cabinet_body_material_direct_input,
      handleType: detail.handle_type,
      finishType: detail.behind_type ?? detail.cabinet_behind_type,
      drawer_type: detail.drawer_type,
      drawer_type_direct_input: detail.drawer_type_direct_input,
      rail_type: detail.rail_type,
      rail_type_direct_input: detail.rail_type_direct_input,
      absorber_type: detail.absorber_type,
      absorber_type_direct_input: detail.absorber_type_direct_input,
      legType: detail.legType,
      legType_direct_input: detail.legType_direct_input,
      riceRail: detail.add_rice_cooker_rail ? "추가" : "추가 안 함",
      lowerDrawer: detail.add_bottom_drawer ? "추가" : "추가 안 함",
      cabinet_construct: detail.cabinet_construct,
      cabinet_location: detail.cabinet_location,
      request: detail.cabinet_request,
      raw_images: detail.cabinet_image_url,
    };
    return {
      ...transformCabinetToNewCardProps(cabinetItem),
      price: cartItem.unit_price * cartItem.item_count,
      quantity: cartItem.item_count,
      hasPrice: true,
      hasStepper: true,
      trashable: true,
    };
  }

  // ACCESSORY
  if (category === DetailProductType.ACCESSORY) {
    const accessoryType =
      detail.accessory_type === "싱크볼" ? "sinkbowl" :
        detail.accessory_type === "쿡탑" ? "cooktop" :
          detail.accessory_type === "후드" ? "hood" : "sinkbowl";

    const accessoryItem = {
      type: detail.accessory_type,
      slug: accessoryType,
      accessory_madeby: detail.accessory_madeby,
      accessory_model: detail.accessory_model,
      request: detail.accessory_request,
    };
    return {
      ...transformAccessoryToNewCardProps(accessoryItem),
      price: cartItem.unit_price * cartItem.item_count,
      quantity: cartItem.item_count,
      hasPrice: true,
      hasStepper: true,
      trashable: true,
    };
  }

  // HARDWARE (HINGE, RAIL, PIECE)
  if (
    category === DetailProductType.HINGE ||
    category === DetailProductType.RAIL ||
    category === DetailProductType.PIECE
  ) {
    const hardwareType =
      category === DetailProductType.HINGE ? "경첩" :
        category === DetailProductType.RAIL ? "레일" :
          category === DetailProductType.PIECE ? "피스" : "경첩";

    const hardwareItem = {
      type: hardwareType,
      madeby: category === DetailProductType.HINGE ? detail.hinge_madeby :
        category === DetailProductType.RAIL ? detail.rail_madeby :
          detail.piece_madeby,
      madebyInput: category === DetailProductType.HINGE ? detail.hinge_madeby_direct_input :
        category === DetailProductType.RAIL ? detail.rail_madeby_direct_input :
          detail.piece_madeby_direct_input,
      thickness: category === DetailProductType.HINGE ? detail.hinge_thickness : null,
      thicknessInput: category === DetailProductType.HINGE ? detail.hinge_thickness_direct_input : null,
      angle: category === DetailProductType.HINGE ? detail.hinge_angle : null,
      angleInput: category === DetailProductType.HINGE ? detail.hinge_angle_direct_input : null,
      railType: category === DetailProductType.RAIL ? detail.rail_type : null,
      railTypeInput: category === DetailProductType.RAIL ? detail.rail_type_direct_input : null,
      railLength: category === DetailProductType.RAIL ? detail.rail_length : null,
      railLengthInput: category === DetailProductType.RAIL ? detail.rail_length_direct_input : null,
      railDamping: category === DetailProductType.RAIL ? detail.rail_damping : null,
      color: category === DetailProductType.HINGE ? detail.hinge_color :
        category === DetailProductType.RAIL ? detail.rail_color :
          detail.piece_color,
      size: category === DetailProductType.PIECE ? detail.piece_size : null,
      request: detail.hardware_request,
    };
    return {
      ...transformHardwareToNewCardProps(hardwareItem),
      price: cartItem.unit_price * cartItem.item_count,
      quantity: cartItem.item_count,
      hasPrice: true,
      hasStepper: true,
      trashable: true,
    };
  }

  return null;
}
