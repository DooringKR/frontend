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
import { CABINET_COLOR_LIST, DOOR_COLOR_LIST, FINISH_COLOR_LIST } from "@/constants/colorList";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { CabinetRailType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import Image from "next/image";
import { useState } from "react";

interface OrderItemDetailProps {
  item: any;
}

export default function OrderItemDetail({ item }: OrderItemDetailProps) {
  // 이미지 모달 상태
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

        // 이미지 URL 처리 - materialDetails에서 가져오기
        let imageArray: string[] = [];
        const doorImageUrl = item.materialDetails?.door_image_url;

        if (doorImageUrl) {
          if (Array.isArray(doorImageUrl)) {
            imageArray = doorImageUrl;
          } else if (typeof doorImageUrl === 'string') {
            try {
              const parsed = JSON.parse(doorImageUrl);
              if (Array.isArray(parsed)) {
                imageArray = parsed;
              } else {
                imageArray = doorImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              }
            } catch {
              imageArray = doorImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
            }
          }
        }

        return (
          <>
            {imageArray.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {imageArray.map((url, index) => (
                    <div
                      key={`image-${index}-${url}`}
                      className="relative w-20 h-20 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={url}
                        alt={`door-image-${index}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            {item.materialDetails.addOn_hinge && (
              <p className="text-[15px]/[22px] font-400 text-gray-600">
                경첩 추가 선택 :{" "}
                {item.materialDetails.addOn_hinge ? "경첩도 받기" : "필요 없어요"}
              </p>
            )}
          </>
        );
      }

      case DetailProductType.FINISH: {
        // 이미지 URL 처리 - materialDetails에서 가져오기
        let imageArray: string[] = [];
        const finishImageUrl = item.materialDetails?.finish_image_url;

        if (finishImageUrl) {
          if (Array.isArray(finishImageUrl)) {
            imageArray = finishImageUrl;
          } else if (typeof finishImageUrl === 'string') {
            try {
              const parsed = JSON.parse(finishImageUrl);
              if (Array.isArray(parsed)) {
                imageArray = parsed;
              } else {
                imageArray = finishImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              }
            } catch {
              imageArray = finishImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
            }
          }
        }

        return (
          <>
            {imageArray.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {imageArray.map((url, index) => (
                    <div
                      key={`image-${index}-${url}`}
                      className="relative w-20 h-20 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={url}
                        alt={`finish-image-${index}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        // 이미지 URL 처리 - materialDetails에서 가져오기
        let imageArray: string[] = [];
        const cabinetImageUrl = item.materialDetails?.cabinet_image_url;

        if (cabinetImageUrl) {
          if (Array.isArray(cabinetImageUrl)) {
            imageArray = cabinetImageUrl;
          } else if (typeof cabinetImageUrl === 'string') {
            try {
              const parsed = JSON.parse(cabinetImageUrl);
              if (Array.isArray(parsed)) {
                imageArray = parsed;
              } else {
                imageArray = cabinetImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              }
            } catch {
              imageArray = cabinetImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
            }
          }
        }

        return (
          <>
            {imageArray.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {imageArray.map((url, index) => (
                    <div
                      key={`image-${index}-${url}`}
                      className="relative w-20 h-20 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={url}
                        alt={`cabinet-image-${index}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
      {renderItemDetails()}

      {/* 이미지 확대 모달 */}
      {selectedImageIndex !== null && (() => {
        let imageArray: string[] = [];

        // 제품 타입에 따라 다른 이미지 필드 사용
        if (item.detail_product_type === DetailProductType.DOOR) {
          const doorImageUrl = item.materialDetails?.door_image_url;
          if (doorImageUrl) {
            if (Array.isArray(doorImageUrl)) {
              imageArray = doorImageUrl;
            } else if (typeof doorImageUrl === 'string') {
              try {
                const parsed = JSON.parse(doorImageUrl);
                if (Array.isArray(parsed)) {
                  imageArray = parsed;
                } else {
                  imageArray = doorImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                }
              } catch {
                imageArray = doorImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              }
            }
          }
        } else if (item.detail_product_type === DetailProductType.FINISH) {
          const finishImageUrl = item.materialDetails?.finish_image_url;
          if (finishImageUrl) {
            if (Array.isArray(finishImageUrl)) {
              imageArray = finishImageUrl;
            } else if (typeof finishImageUrl === 'string') {
              try {
                const parsed = JSON.parse(finishImageUrl);
                if (Array.isArray(parsed)) {
                  imageArray = parsed;
                } else {
                  imageArray = finishImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                }
              } catch {
                imageArray = finishImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              }
            }
          }
        } else if ([DetailProductType.UPPERCABINET, DetailProductType.LOWERCABINET, DetailProductType.TALLCABINET, DetailProductType.DRAWERCABINET, DetailProductType.OPENCABINET, DetailProductType.FLAPCABINET].includes(item.detail_product_type)) {
          const cabinetImageUrl = item.materialDetails?.cabinet_image_url;
          if (cabinetImageUrl) {
            if (Array.isArray(cabinetImageUrl)) {
              imageArray = cabinetImageUrl;
            } else if (typeof cabinetImageUrl === 'string') {
              try {
                const parsed = JSON.parse(cabinetImageUrl);
                if (Array.isArray(parsed)) {
                  imageArray = parsed;
                } else {
                  imageArray = cabinetImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                }
              } catch {
                imageArray = cabinetImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
              }
            }
          }
        }

        return (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] p-4">
              <Image
                src={imageArray[selectedImageIndex]}
                alt={`${item.detail_product_type?.toLowerCase()}-image-${selectedImageIndex}`}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
                unoptimized={true}
                onClick={(e) => e.stopPropagation()}
              />

              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
