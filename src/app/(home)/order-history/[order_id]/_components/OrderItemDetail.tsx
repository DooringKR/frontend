import {
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  FINISH_CATEGORY_LIST,
} from "@/constants/category";
import {
  CABINET_ABSORBER_TYPE_NAME,
  CABINET_BODY_TYPE_NAME,
  CABINET_FINISH_TYPE_NAME,
  CABINET_HANDLE_TYPE_NAME,
} from "@/constants/modelList";
import formatLocation from "@/utils/formatLocation";
import { getCategoryLabel } from "@/utils/getCategoryLabel";
import formatColor from "@/utils/formatColor";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CABINET_COLOR_LIST, DOOR_COLOR_LIST, FINISH_COLOR_LIST } from "@/constants/colorList";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { CabinetRailType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

interface OrderItemDetailProps {
  item: any;
}

export default function OrderItemDetail({ item }: OrderItemDetailProps) {
  // item 객체 구조 확인을 위한 콘솔 로그
  console.log("🔍 OrderItemDetail - item:", item);
  // console.log("🔍 OrderItemDetail - item.detail_product_type:", item.detail_product_type);
  // console.log("🔍 OrderItemDetail - item.materialDetails:", item.materialDetails);

  // // materialDetails가 배열인 경우 첫 번째 요소도 확인
  // if (item.materialDetails && Array.isArray(item.materialDetails) && item.materialDetails.length > 0) {
  //   console.log("🔍 OrderItemDetail - item.materialDetails[0]:", item.materialDetails[0]);
  // }

  const renderItemDetails = () => {
    switch (item.detail_product_type) {
      case DetailProductType.DOOR:
        return (
          <>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              종류 : {item.materialDetails.door_type || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              색상 : {DOOR_COLOR_LIST.find(color => color.id === item.materialDetails.door_color)?.name || item.materialDetails.door_color_direct_input || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              가로 길이 :{" "}
              {item.materialDetails.door_width ? item.materialDetails.door_width.toLocaleString() : "-"}mm
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              세로 길이 :{" "}
              {item.materialDetails.door_height ? item.materialDetails.door_height.toLocaleString() : "-"}
              mm
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              경첩 개수 : {item.materialDetails.hinge.length || "-"}개
            </p>
            {item.materialDetails.hinge.length > 0 && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 위치 : {Array.isArray(item.materialDetails.hinge) ? item.materialDetails.hinge.filter(Boolean).join(", ") : item.materialDetails.hinge}
              </p>
            )}
            {item.materialDetails.hinge_direction && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 방향 : {item.materialDetails.hinge_direction}
              </p>
            )}
            {item.materialDetails.door_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                추가 요청: {item.materialDetails.door_request}
              </p>
            )}
            {item.materialDetails.door_location && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                용도 ∙ 장소: {formatLocation(item.materialDetails.door_location)}
              </p>
            )}
            {item.materialDetails.addOn_hinge && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 추가 선택 :{" "}
                {item.materialDetails.addOn_hinge ? "경첩도 받기" : "필요 없어요"}
              </p>
            )}
          </>
        );

      case DetailProductType.FINISH:
        return (
          <>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              종류 : {item.materialDetails.finish_type || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              색상 : {FINISH_COLOR_LIST.find(color => color.id === item.materialDetails.finish_color)?.name || item.materialDetails.finish_color_direct_input || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              엣지 면 수 : {item.materialDetails.finish_edge_count || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              깊이 :{" "}
              {item.materialDetails.finish_base_depth
                ? item.materialDetails.finish_base_depth.toLocaleString()
                : "-"}
              mm
            </p>
            {item.materialDetails.finish_additional_depth !== undefined &&
              item.materialDetails.finish_additional_depth !== null &&
              item.materialDetails.finish_additional_depth > 0 && (
                <p className="text-[15px]/[22px] font-400 text-gray-600">
                  ⤷ 깊이 키움 : {item.materialDetails.finish_additional_depth.toLocaleString()}mm
                </p>
              )}
            {item.materialDetails.finish_additional_depth !== undefined &&
              item.materialDetails.finish_additional_depth !== null &&
              item.materialDetails.finish_additional_depth > 0 && (
                <p className="text-[15px]/[22px] font-400 text-gray-600">
                  ⤷ 합산 깊이 :{" "}
                  {(
                    item.materialDetails.finish_base_depth + item.materialDetails.finish_additional_depth
                  ).toLocaleString()}
                  mm
                </p>
              )}
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              높이 :{" "}
              {item.materialDetails.finish_base_height
                ? item.materialDetails.finish_base_height.toLocaleString()
                : "-"}
              mm
            </p>
            {item.materialDetails.finish_additional_height !== undefined &&
              item.materialDetails.finish_additional_height !== null &&
              item.materialDetails.finish_additional_height > 0 && (
                <p className="text-[15px]/[22px] font-400 text-gray-600">
                  ⤷ 높이 키움 : {item.materialDetails.finish_additional_height.toLocaleString()}
                  mm
                </p>
              )}
            {item.materialDetails.finish_additional_height !== undefined &&
              item.materialDetails.finish_additional_height !== null &&
              item.materialDetails.finish_additional_height > 0 && (
                <p className="text-[15px]/[22px] font-400 text-gray-600">
                  ⤷ 합산 높이 :{" "}
                  {(
                    item.materialDetails.finish_base_height +
                    item.materialDetails.finish_additional_height
                  ).toLocaleString()}
                  mm
                </p>
              )}
            {item.materialDetails.finish_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                요청 사항 : {item.materialDetails.finish_request}
              </p>
            )}
            {item.materialDetails.finish_location && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                용도 ∙ 장소: {formatLocation(item.materialDetails.finish_location)}
              </p>
            )}
          </>
        );

      case DetailProductType.HINGE:
        return (
          <>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              종류: 경첩
            </p>
            {(item.materialDetails.hinge_madeby || item.materialDetails.hinge_madeby_direct_input) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                제조사 : {item.materialDetails.hinge_madeby || item.materialDetails.hinge_madeby_direct_input}
              </p>
            )}
            {(item.materialDetails.hinge_thickness || item.materialDetails.hinge_thickness_direct_input) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                두께 : {item.materialDetails.hinge_thickness || item.materialDetails.hinge_thickness_direct_input}
              </p>
            )}
            {(item.materialDetails.hinge_angle || item.materialDetails.hinge_angle_direct_input) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                각도 : {item.materialDetails.hinge_angle || item.materialDetails.hinge_angle_direct_input}
              </p>
            )}
            {item.materialDetails.hardware_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                요청 사항 : {item.materialDetails.hardware_request}
              </p>
            )}
          </>
        );

      case DetailProductType.RAIL:
        return (
          <>
            {(item.materialDetails.rail_madeby || item.materialDetails.rail_madeby_direct_input) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                제조사 : {item.materialDetails.rail_madeby || item.materialDetails.rail_madeby_direct_input}
              </p>
            )}
            {(item.materialDetails.rail_type || item.materialDetails.rail_type_direct_input) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                레일 타입 : {item.materialDetails.rail_type || item.materialDetails.rail_type_direct_input}
              </p>
            )}
            {(item.materialDetails.rail_length || item.materialDetails.rail_length_direct_input) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                길이 : {item.materialDetails.rail_length || item.materialDetails.rail_length_direct_input}
              </p>
            )}
            {(item.materialDetails.rail_damping) && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                댐핑 : {item.materialDetails.rail_damping ? "있음" : "없음"}
              </p>
            )}
            {item.materialDetails.hardware_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                요청 사항 : {item.materialDetails.hardware_request}
              </p>
            )}
          </>
        );

      case DetailProductType.PIECE:
        return (
          <>
            {item.materialDetails.piece_color && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                색상 : {item.materialDetails.piece_color}
              </p>
            )}
            {item.materialDetails.piece_size && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                크기 : {item.materialDetails.piece_size}
              </p>
            )}

            {item.materialDetails.hardware_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                요청 사항 : {item.materialDetails.hardware_request}
              </p>
            )}
          </>
        );

      case DetailProductType.UPPERCABINET:
      case DetailProductType.LOWERCABINET:
      case DetailProductType.DRAWERCABINET:
      case DetailProductType.OPENCABINET:
      case DetailProductType.FLAPCABINET:
        return (
          <>
            {/* 공통 로직 */}
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              색상: {CABINET_COLOR_LIST.find(color => color.id === item.materialDetails.cabinet_color)?.name || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              너비:{" "}
              {item.materialDetails.cabinet_width
                ? item.materialDetails.cabinet_width.toLocaleString()
                : "-"}
              mm
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              깊이:{" "}
              {item.materialDetails.cabinet_depth
                ? item.materialDetails.cabinet_depth.toLocaleString()
                : "-"}
              mm
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              높이:{" "}
              {item.materialDetails.cabinet_height
                ? item.materialDetails.cabinet_height.toLocaleString()
                : "-"}
              mm
            </p>
            {item.materialDetails.cabinet_location && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                용도 ∙ 장소: {formatLocation(item.materialDetails.cabinet_location)}
              </p>
            )}
            {item.materialDetails.cabinet_behind_type && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                마감 방식: {item.materialDetails.cabinet_behind_type}
              </p>
            )}
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              소재:{" "}
              {item.materialDetails.cabinet_body_material === 4
                ? item.materialDetails.cabinet_body_material_direct_input || "-"
                : item.materialDetails.cabinet_body_material
                  ? BODY_MATERIAL_LIST.find(material => material.id === item.materialDetails.cabinet_body_material)?.name || "-"
                  : "기타"}
            </p>
            {item.materialDetails.handle_type && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                손잡이 종류: {item.materialDetails.handle_type}
              </p>
            )}
            {item.materialDetails.absorber_type && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                소재:{" "}
                {item.materialDetails.absorber_type === 6
                  ? item.materialDetails.absorber_type_direct_input || "-"
                  : ABSORBER_TYPE_LIST.find(material => material.id === item.materialDetails.absorber_type)?.name || "-"}
              </p>
            )}
            {item.materialDetails.drawer_type && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                서랍 종류:{" "}
                {item.materialDetails.drawer_type === 4
                  ? item.materialDetails.drawer_type_direct_input || "-"
                  : CABINET_DRAWER_TYPE_LIST.find(material => material.id === item.materialDetails.drawer_type)?.name || "-"}
              </p>
            )}
            {item.materialDetails.rail_type && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                레일 종류:{" "}
                {item.materialDetails.rail_type === CabinetRailType.DIRECT_INPUT
                  ? item.materialDetails.rail_type_direct_input || "-"
                  : item.materialDetails.rail_type}
              </p>
            )}
            {item.materialDetails.add_rice_cooker_rail && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                종류: {item.materialDetails.add_rice_cooker_rail ? '밥솥 레일 추가' : '밥솥 레일 필요 없음'}
              </p>
            )}
            {item.materialDetails.add_bottom_drawer && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                종류: {item.materialDetails.add_bottom_drawer ? '하부 서랍 추가' : '하부 서랍 필요 없음'}
              </p>
            )}
            {item.materialDetails.cabinet_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                기타 요청 사항: {item.materialDetails.cabinet_request}
              </p>
            )}
          </>
        );

      case DetailProductType.ACCESSORY:
        return (
          <>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              종류: {item.materialDetails.accessory_type || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              제조사: {item.materialDetails.accessory_madeby || "-"}
            </p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              모델명 : {item.materialDetails.accessory_model || "-"}
            </p>
            {item.materialDetails.accessory_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                요청 사항 : {item.materialDetails.accessory_request}
              </p>
            )}
          </>
        );

      default:
        return <>
          <p className="text-[15px]/[22px] font-400 text-gray-600">
            종류 :{item.detail_product_type}
          </p>
        </>;
    }
  };

  return <div className="border-t border-gray-100 pt-3">{renderItemDetails()}</div>;
}
