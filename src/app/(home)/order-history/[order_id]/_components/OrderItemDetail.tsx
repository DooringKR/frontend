"use client";

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
import { CABINET_COLOR_LIST, DOOR_COLOR_LIST, FINISH_COLOR_LIST, LONG_DOOR_COLOR_LIST, OPEN_CABINET_BODY_MATERIAL_LIST } from "dooring-core-domain/dist/constants/color";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { CabinetRailType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";

import LongDoorDoors from "@/components/Card/LongDoorDoors";
import PhotoThumbs from "@/components/media/PhotoThumbs";

const CABINET_TYPES = [
  DetailProductType.UPPERCABINET,
  DetailProductType.LOWERCABINET,
  DetailProductType.TALLCABINET,
  DetailProductType.DRAWERCABINET,
  DetailProductType.OPENCABINET,
  DetailProductType.FLAPCABINET,
];

/** 품목 종류 → 첨부 사진 칸 */
const IMAGE_FIELD: Partial<Record<string, string>> = {
  [DetailProductType.DOOR]: "door_image_url",
  [DetailProductType.FINISH]: "finish_image_url",
  [DetailProductType.LONGDOOR]: "long_door_image_url",
  ...Object.fromEntries(CABINET_TYPES.map((t) => [t, "cabinet_image_url"])),
};

/** 사진 주소 칸 — 배열·JSON 배열 글·쉼표로 이은 글 셋 다 받는다 */
function parseImageUrls(v: unknown): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string" || !v) return [];
  try {
    const parsed = JSON.parse(v);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // 쉼표로 이은 글
  }
  return v.split(",").map((u) => u.trim()).filter(Boolean);
}

interface OrderItemDetailProps {
  item: any;
}

export default function OrderItemDetail({ item }: OrderItemDetailProps) {
  // 크게 보는 사진 차례(null = 닫힘)
  const photos = parseImageUrls(item.materialDetails?.[IMAGE_FIELD[item.detail_product_type] ?? ""]).map((src, i) => ({
    src,
    alt: `${String(item.detail_product_type ?? "").toLowerCase()}-image-${i}`,
  }));

  const HANDLE_TYPE_LABEL_MAP: Record<string, string> = {
    OUTER: "겉손잡이",
    SMART_BAR: "스마트바",
    PUSH: "푸시",
  };

  const renderItemDetails = () => {
    switch (item.detail_product_type) {
      case DetailProductType.DOOR: {
        const hinge = item?.materialDetails?.hinge;

        // 경첩 개수 처리: ShoppingCartCardNew와 동일한 방식
        let hingeCount: number | "모름" | undefined;
        if (!hinge) {
          hingeCount = undefined;
        } else if (Array.isArray(hinge) && hinge.length === 1 && hinge[0] === null) {
          hingeCount = "모름";
        } else if (Array.isArray(hinge)) {
          hingeCount = hinge.length;
        }

        // 경첩 방향 처리: ShoppingCartCardNew와 동일한 방식
        let hingeDirection: "좌경" | "우경" | "모름" | undefined;
        if (item.materialDetails.hinge_direction === "LEFT") {
          hingeDirection = "좌경";
        } else if (item.materialDetails.hinge_direction === "RIGHT") {
          hingeDirection = "우경";
        } else if (item.materialDetails.hinge_direction === "UNKNOWN") {
          hingeDirection = "모름";
        } else {
          hingeDirection = item.materialDetails.hinge_direction as any;
        }

        // 보링 치수 처리: 경첩 개수와 방향을 둘 다 알 때만 표시
        let boringDimensions: (number | "모름")[] | undefined;
        if (Array.isArray(hinge) &&
          hinge.length > 1 &&
          item.materialDetails.hinge_direction !== "UNKNOWN") {
          boringDimensions = hinge.map(val => val === null ? "모름" : val);
        }

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
            {hingeCount !== undefined && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 개수 : {hingeCount === "모름" ? "모름" : `${hingeCount}개`}
              </p>
            )}
            {hingeDirection && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 방향 : {hingeDirection}
              </p>
            )}
            {boringDimensions && boringDimensions.length > 0 && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 위치 : {boringDimensions.join(", ")}
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
            {(item.materialDetails.addOn_hinge !== undefined || item.materialDetails.door_construct !== undefined) && (() => {
              const options: string[] = [];
              if (item.materialDetails.addOn_hinge) {
                const hingeText = item.materialDetails.hinge_thickness
                  ? `경첩도 같이 받을래요(${item.materialDetails.hinge_thickness})`
                  : "경첩도 같이 받을래요";
                options.push(hingeText);
              }
              if (item.materialDetails.door_construct) options.push("시공도 필요해요");
              const displayValue = options.length > 0 ? options.join(", ") : "없음";
              return (
                <p className="text-[15px]/[22px] font-400 text-gray-600">
                  추가 선택 : {displayValue}
                </p>
              );
            })()}
          </>
        );
      }

      case DetailProductType.FINISH: {
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
      }

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
      case DetailProductType.TALLCABINET:
      case DetailProductType.DRAWERCABINET:
      case DetailProductType.OPENCABINET:
      case DetailProductType.FLAPCABINET: {
        return (
          <>
            {/* 공통 로직 */}
            <p className="text-[15px]/[22px] font-400 text-gray-600">
              색상: {
                item.detail_product_type === DetailProductType.OPENCABINET
                  ? OPEN_CABINET_BODY_MATERIAL_LIST.find(color => color.id === item.materialDetails.cabinet_color)?.name || "-"
                  : CABINET_COLOR_LIST.find(color => color.id === item.materialDetails.cabinet_color)?.name || "-"
              }
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
            {item.materialDetails.legType && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                다리발: {item.materialDetails.legType}
              </p>
            )}
            {item.materialDetails.legType_direct_input && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                다리발 직접 입력: {item.materialDetails.legType_direct_input}
              </p>
            )}
            {item.materialDetails.cabinet_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                기타 요청 사항: {item.materialDetails.cabinet_request}
              </p>
            )}
          </>
        );
      }

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

      case DetailProductType.LONGDOOR: {
        const relatedDoors = (item as any).relatedDoors as Door[] | undefined;
        const md = item.materialDetails || {};

        const longDoorColorLabel =
          md?.door_color_direct_input ||
          (typeof md?.door_color === "number"
            ? formatColor(LONG_DOOR_COLOR_LIST.find(color => color.id === md?.door_color)?.name)
            : formatColor(md?.door_color)) ||
          "-";
        const longDoorHeightLabel = md?.door_height ? `${md.door_height.toLocaleString()}mm` : "-";
        const longDoorLocationLabel = md?.door_location ? formatLocation(md.door_location) : "-";

        const handleTypeRaw = md?.handle_type;
        const handleTypeLabel = handleTypeRaw ? (HANDLE_TYPE_LABEL_MAP[handleTypeRaw] ?? handleTypeRaw) : "-";
        const handleTypeDirectInput = md?.handle_type_direct_input;

        return (
          <>
            {/* 롱문 공통 정보 */}
            <p className="text-[15px]/[22px] font-400 text-gray-600">색상 : {longDoorColorLabel}</p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">높이 : {longDoorHeightLabel}</p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">용도 ∙ 장소 : {longDoorLocationLabel}</p>
            <p className="text-[15px]/[22px] font-400 text-gray-600">손잡이 종류 : {handleTypeLabel}</p>
            {handleTypeDirectInput && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                손잡이 상세 : {handleTypeDirectInput}
              </p>
            )}
            {(md?.addOn_hinge !== undefined || md?.door_construct !== undefined) && (() => {
              const options: string[] = [];
              if (md?.addOn_hinge) {
                const hingeText = md?.hinge_thickness
                  ? `경첩도 같이 받을래요(${md.hinge_thickness})`
                  : "경첩도 같이 받을래요";
                options.push(hingeText);
              }
              if (md?.door_construct) options.push("시공도 필요해요");
              const displayValue = options.length > 0 ? options.join(", ") : "없음";
              return (
                <p className="text-[15px]/[22px] font-400 text-gray-600">
                  추가 선택 : {displayValue}
                </p>
              );
            })()}
            {md?.long_door_request && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                제작 시 요청 사항 : {md.long_door_request}
              </p>
            )}

            <LongDoorDoors doors={relatedDoors} className="mt-3" />
          </>
        );
      }

      default:
        return <>
          <p className="text-[15px]/[22px] font-400 text-gray-600">
            종류 :{item.detail_product_type}
          </p>
        </>;
    }
  };

  return (
    <div className="border-t border-gray-100 pt-3">
      <PhotoThumbs photos={photos} size="row" className="mb-2" />
      {renderItemDetails()}
    </div>
  );
}
