
"use client";

import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { DOOR_COLOR_LIST, FINISH_COLOR_LIST, CABINET_COLOR_LIST } from "@/constants/colorList";
import React, { useState } from "react";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import Image from "next/image";

import { DoorType, FinishEdgeCount, HingeDirection, CabinetLegType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import Button from "../Button/Button";
import DoorPreviewIcon from "../DoorPreviewIcon/DoorPreviewIcon";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import formatColor from "@/utils/formatColor";
import ImageCard from "./ImageCard";

interface ShoppingCartCardProps {
  addRiceCookerRail?: boolean;
  addBottomDrawer?: boolean;
  type: "door" | "cabinet" | "finish" | "accessory" | "hardware";
  title: string;
  totalPrice?: number;
  color?: string;
  color_direct_input?: string;
  width?: number;
  height?: number;
  depth?: number;
  edgeCount?: number;
  hingeCount?: number;
  hingeDirection?: HingeDirection;
  boring?: string | (number | null)[];
  boringCategory?: DoorType;
  quantity: number;
  trashable: boolean;
  showQuantitySelector?: boolean;
  request?: string;
  location?: string;
  onOptionClick?: () => void;
  onDecrease?: () => void;
  onIncrease?: () => void;
  bodyMaterial?: string;
  handleType?: string;
  finishType?: string;
  drawerType?: string;
  drawer_type_direct_input?: string;
  railType?: string;
  rail_type_direct_input?: string;
  railLength?: string;
  riceRail?: string;
  lowerDrawer?: string;
  depthIncrease?: number;
  heightIncrease?: number;
  manufacturer?: string;
  modelName?: string;
  size?: string;
  addOn_hinge?: boolean;
  cabinet_construct?: boolean;
  legType?: CabinetLegType;
  legType_direct_input?: string;
  thickness?: string;
  angle?: string;
  railDamping?: boolean;
  behindType?: string;
  absorberType?: string;
  body_material_direct_input?: string;
  absorber_type_direct_input?: string;
  images_url?: string[];
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({
  type,
  title,
  totalPrice,
  color,
  color_direct_input,
  width,
  height,
  depth,
  edgeCount,
  hingeCount,
  hingeDirection,
  boring,
  boringCategory,
  quantity,
  trashable,
  showQuantitySelector,
  request,
  location,
  onOptionClick,
  onDecrease,
  onIncrease,
  bodyMaterial,
  handleType,
  finishType,
  behindType,
  drawerType,
  drawer_type_direct_input,
  railType,
  rail_type_direct_input,
  riceRail,
  lowerDrawer,
  depthIncrease,
  heightIncrease,
  manufacturer,
  modelName,
  size,
  addOn_hinge,
  cabinet_construct,
  legType,
  legType_direct_input,
  thickness,
  angle,
  railLength,
  railDamping,
  absorberType,
  body_material_direct_input,
  absorber_type_direct_input,
  addRiceCookerRail,
  addBottomDrawer,
  images_url,
}) => {
  // 이미지 모달 상태
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // color label: direct input first, else resolve id/name by product type
  let colorLabel: string | undefined = undefined;
  if (typeof color_direct_input === "string" && color_direct_input.trim() !== "") {
    colorLabel = "(직접입력) " + color_direct_input;
  } else if (color) {
    const list = type === "door" ? DOOR_COLOR_LIST : type === "finish" ? FINISH_COLOR_LIST : type === "cabinet" ? CABINET_COLOR_LIST : null;
    if (list) {
      const found = list.find(opt => String(opt.id) === String(color) || opt.name === color);
      colorLabel = found ? found.name : color;
    } else {
      colorLabel = color;
    }
  }
  // bodyMaterial이 '직접입력' id면 직접입력값, 아니면 name 변환
  let bodyMaterialLabel = bodyMaterial;
  const directBodyMaterialOption = BODY_MATERIAL_LIST.find(opt => opt.name === "직접입력");
  if (bodyMaterial && !isNaN(Number(bodyMaterial))) {
    const found = BODY_MATERIAL_LIST.find(opt => String(opt.id) === String(bodyMaterial));
    if (found) {
      if (found.name === "직접입력" && body_material_direct_input) {
        bodyMaterialLabel = body_material_direct_input;
      } else {
        bodyMaterialLabel = found.name;
      }
    }
  }

  // absorberType robust 변환: 값 없으면 undefined
  let absorberTypeLabel: string | undefined = undefined;
  if (absorberType && absorberType !== "null" && absorberType !== null && absorberType !== "undefined" && absorberType !== "") {
    const found = ABSORBER_TYPE_LIST.find(opt => String(opt.id) === String(absorberType));
    if (found) {
      absorberTypeLabel = found.name === "직접입력" && absorber_type_direct_input ? absorber_type_direct_input : found.name;
    } else {
      absorberTypeLabel = absorberType;
    }
  } else if (absorber_type_direct_input) {
    absorberTypeLabel = absorber_type_direct_input;
  }

  // robust: 서랍 종류 변환 (id→name, name→name, 직접입력 우선, 값 없으면 undefined)
  let drawerTypeLabel: string | undefined = undefined;
  if (drawer_type_direct_input) {
    drawerTypeLabel = drawer_type_direct_input;
  } else if (drawerType) {
    const found = CABINET_DRAWER_TYPE_LIST.find(opt => String(opt.id) === String(drawerType) || opt.name === drawerType);
    if (found) drawerTypeLabel = found.name;
    else drawerTypeLabel = drawerType;
  }

  // robust: 레일 종류 변환 (enum→한글, name→name, 직접입력 우선, 값 없으면 undefined)
  let railTypeLabel: string | undefined = undefined;
  if (rail_type_direct_input) {
    railTypeLabel = rail_type_direct_input;
  } else if (railType) {
    if (railType === "BALL_BEARING") railTypeLabel = "볼베어링";
    else if (railType === "SOFT_CLOSE") railTypeLabel = "소프트클로즈";
    else if (railType === "UNDER_MOUNT") railTypeLabel = "언더마운트";
    else if (railType === "SIDE_MOUNT") railTypeLabel = "사이드마운트";
    else railTypeLabel = railType;
  }

  // legType label: prefer direct input with prefix, else enum label
  let legTypeLabel: string | undefined = undefined;
  if (typeof legType_direct_input === "string" && legType_direct_input.trim() !== "") {
    legTypeLabel = `(직접 입력) ${legType_direct_input}`;
  } else if (legType) {
    legTypeLabel = String(legType);
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border-[1px] border-gray-200 bg-white p-[20px]">
      {/* 상품 정보 */}
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-2">
          <div className="text-[17px] font-600 text-gray-800">{title}</div>
          <div className="flex flex-col text-[15px] font-400 text-gray-500">
            {type !== "hardware" && colorLabel && <div>색상 : {colorLabel}</div>}
            {type === "finish" && edgeCount && <div>엣지 면 수 : {edgeCount}</div>}
            {bodyMaterialLabel && <div>몸통 소재 및 두께 : {bodyMaterialLabel}</div>}
            {width && <div>너비 : {width}mm</div>}
            {depth && type === "finish" && <div>가로 : {depth}mm</div>}
            {depth && type === "cabinet" && <div>깊이 : {depth}mm</div>}
            {depthIncrease !== undefined && depthIncrease !== null && depthIncrease > 0 && (
              <>
                <div>⤷ 가로 키우기 : {depthIncrease}mm</div>
                {depth && <div>⤷ 합산 가로 : {Number(depth) + Number(depthIncrease)}mm</div>}
              </>
            )}
            {height && <div>높이 : {height}mm</div>}
            {heightIncrease !== undefined && heightIncrease !== null && heightIncrease > 0 && (
              <>
                <div>⤷ 높이 키우기 : {heightIncrease}mm</div>
                {height && <div>⤷ 합산 높이 : {Number(height) + Number(heightIncrease)}mm</div>}
              </>
            )}
            {(type === "hardware" || type === "accessory") && manufacturer && <div>제조사 : {manufacturer}</div>}
            {/* robust: 레일 종류 값 있을 때만 출력 (중복 제거)
            {typeof railTypeLabel !== "undefined" && railTypeLabel !== null && railTypeLabel !== "" && (
              <div>레일 종류 : {railTypeLabel}</div>
            )} */}
            {type === "hardware" && railLength && <div>레일 길이 : {railLength}</div>}
            {type === "hardware" && colorLabel && <div>색상 : {colorLabel}</div>}
            {type === "hardware" && size && <div>사이즈 : {size}</div>}
            {type === "hardware" && thickness && <div>합판 두께 : {thickness}</div>}
            {type === "hardware" && angle && <div>각도 : {angle}</div>}
            {type === "hardware" && railDamping !== undefined && <div>레일 댐핑 : {railDamping ? "있음" : "없음"}</div>}
            {/* 경첩 개수: hinge 배열이 [null]이면 모름 상태 */}
            {hingeCount !== undefined && hingeCount !== null && !(Array.isArray(boring) && boring.length === 1 && boring[0] === null) && (
              <div>경첩 개수 : {hingeCount}개</div>
            )}
            {Array.isArray(boring) && boring.length === 1 && boring[0] === null && (
              <div>경첩 개수 : 모름</div>
            )}
            {/* 경첩 방향: UNKNOWN이 아닐 때만 표시 */}
            {hingeDirection && hingeDirection !== HingeDirection.UNKNOWN && (
              <div>경첩 방향 : {hingeDirection}</div>
            )}
            {hingeDirection === HingeDirection.UNKNOWN && (
              <div>경첩 방향 : 모름</div>
            )}
            {/* 보링 치수: 경첩 개수와 방향을 둘 다 알 때만 표시 */}
            {Array.isArray(boring) && boring.length > 1 && hingeDirection !== HingeDirection.UNKNOWN && (
              <div>
                보링 치수 : {boring.map(val => val === null ? "모름" : val).join(", ")}
              </div>
            )}
            {/* robust: 쇼바 종류 값 있을 때만 출력 */}
            {typeof absorberTypeLabel !== "undefined" && absorberTypeLabel !== null && absorberTypeLabel !== "" && (
              <div>쇼바 종류 : {absorberTypeLabel}</div>
            )}
            {handleType && <div>손잡이 종류 : {handleType}</div>}
            {/* robust: 서랍 종류 값 있을 때만 출력 */}
            {typeof drawerTypeLabel !== "undefined" && drawerTypeLabel !== null && drawerTypeLabel !== "" && (
              <div>서랍 종류 : {drawerTypeLabel}</div>
            )}
            {/* robust: 레일 종류 값 있을 때만 출력 */}
            {typeof railTypeLabel !== "undefined" && railTypeLabel !== null && railTypeLabel !== "" && (
              <div>레일 종류 : {railTypeLabel}</div>
            )}
            {/* robust: 오픈장 밥솥 레일/하부장 추가 여부 */}
            {typeof addRiceCookerRail !== "undefined" && (
              <div>밥솥 레일 추가 여부 : {addRiceCookerRail ? "추가" : "추가 안 함"}</div>
            )}
            {typeof addBottomDrawer !== "undefined" && (
              <div>하부 서랍장 추가 여부 : {addBottomDrawer ? "추가" : "추가 안 함"}</div>
            )}
            {riceRail && <div>밥솥 레일 추가 여부 : {riceRail}</div>}
            {lowerDrawer && <div>하부 서랍장 추가 여부 : {lowerDrawer}</div>}
            {typeof behindType !== "undefined" && behindType !== null && behindType !== "" && (
              <div>마감 방식 : {behindType}</div>
            )}
            {/* 중복 방지: manufacturer는 위에서만 출력 */}
            {modelName && <div>모델명 : {modelName}</div>}
            {type !== "hardware" && size && <div>사이즈 : {size}</div>}
            {location && <div>용도 ∙ 장소 : {location}</div>}
            {addOn_hinge !== undefined && addOn_hinge !== null && (
              <div>경첩 추가 선택 : {addOn_hinge ? "경첩도 받기" : "필요 없어요"}</div>
            )}
            {typeof cabinet_construct !== "undefined" && cabinet_construct !== null && (
              <div>시공 필요 여부 : {cabinet_construct ? "시공도 필요해요" : "필요 없어요"}</div>
            )}
            {typeof legTypeLabel !== "undefined" && legTypeLabel !== null && legTypeLabel !== "" && (
              <div>다리발 : {legTypeLabel}</div>
            )}
            {request && <div>제작 시 요청 사항 : {request}</div>}
            {images_url && (() => {
              // 디버깅을 위한 로그
              console.log(`[${type}] images_url:`, images_url, 'type:', typeof images_url);

              // images_url이 배열이 아니면 배열로 변환
              let imageArray: string[] = [];
              if (Array.isArray(images_url)) {
                imageArray = images_url;
              } else if (typeof images_url === 'string') {
                // 문자열인 경우 JSON 파싱 시도
                try {
                  const parsed = JSON.parse(images_url);
                  if (Array.isArray(parsed)) {
                    imageArray = parsed;
                  } else {
                    // JSON이 아닌 경우 쉼표로 구분된 문자열로 처리
                    imageArray = (images_url as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                  }
                } catch {
                  // JSON 파싱 실패 시 쉼표로 구분된 문자열로 처리
                  imageArray = (images_url as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                }
              }

              // 유효한 URL만 필터링
              const validUrls = imageArray.filter((url) =>
                url &&
                typeof url === 'string' &&
                url.trim().length > 0 &&
                url !== '[]' &&
                url !== 'null' &&
                url !== 'undefined' &&
                (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('/'))
              );

              console.log(`[${type}] validUrls:`, validUrls);
              return validUrls.length > 0;
            })() && (
                <div>
                  {(() => {
                    // images_url이 배열이 아니면 배열로 변환
                    let imageArray: string[] = [];
                    if (Array.isArray(images_url)) {
                      imageArray = images_url;
                    } else if (typeof images_url === 'string') {
                      // 문자열인 경우 JSON 파싱 시도
                      try {
                        const parsed = JSON.parse(images_url);
                        if (Array.isArray(parsed)) {
                          imageArray = parsed;
                        } else {
                          // JSON이 아닌 경우 쉼표로 구분된 문자열로 처리
                          imageArray = (images_url as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                        }
                      } catch {
                        // JSON 파싱 실패 시 쉼표로 구분된 문자열로 처리
                        imageArray = (images_url as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
                      }
                    }

                    // 유효한 URL만 필터링
                    const validUrls = imageArray.filter((url) =>
                      url &&
                      typeof url === 'string' &&
                      url.trim().length > 0 &&
                      url !== '[]' &&
                      url !== 'null' &&
                      url !== 'undefined' &&
                      (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('/'))
                    );

                    return (
                      <>
                        <div className="flex gap-2 mt-2">
                          {validUrls.map((url, index) => (
                            <div
                              key={`image-${index}-${url}`}
                              className="relative w-16 h-16 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedImageIndex(index)}
                            >
                              <Image
                                src={url}
                                alt={`image-${index}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                                unoptimized={true}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
          </div>
        </div>
        {type === "door" && (title === "플랩문" || title === "일반문") && hingeCount && (
          <DoorPreviewIcon
            DoorType={title === "플랩문" ? "플랩문" : "일반문"}
            FatOrTall={
              width && height
                ? Number(width) > Number(height)
                  ? "Fat"
                  : Number(width) < Number(height)
                    ? "Tall"
                    : "Same"
                : "Tall"
            }
            BoringDirection={
              hingeDirection === "우경"
                ? "right"
                : hingeDirection === "좌경"
                  ? "left"
                  : title === "플랩문"
                    ? "left"
                    : null
            }
            BoringNum={([2, 3, 4].includes(hingeCount) ? hingeCount : 2) as 2 | 3 | 4}
          />
        )}
      </div>
      {/* 총 금액 */}
      {totalPrice && (
        <div className="flex items-end justify-end text-[20px]/[28px] font-600 text-gray-900">
          {totalPrice.toLocaleString()}원&nbsp;<span className="text-gray-600">부터~</span>
        </div>
      )}
      {/* button section */}
      <div className="ml-auto flex w-fit items-center gap-3">
        {/* <Button type={"OutlinedMedium"} text={"옵션 변경"} onClick={onOptionClick} /> */}
        {showQuantitySelector !== false && (
          <QuantitySelector
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            trashable={trashable}
          />
        )}
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImageIndex !== null && (() => {
        let imageArray: string[] = [];
        if (Array.isArray(images_url)) {
          imageArray = images_url;
        } else if (typeof images_url === 'string') {
          try {
            const parsed = JSON.parse(images_url);
            if (Array.isArray(parsed)) {
              imageArray = parsed;
            } else {
              imageArray = (images_url as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
            }
          } catch {
            imageArray = (images_url as string).split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
          }
        }

        // 유효한 URL만 필터링
        const validUrls = imageArray.filter((url) =>
          url &&
          typeof url === 'string' &&
          url.trim().length > 0 &&
          url !== '[]' &&
          url !== 'null' &&
          url !== 'undefined' &&
          (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('/'))
        );

        return (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] p-4">
              <Image
                src={validUrls[selectedImageIndex]}
                alt={`image-${selectedImageIndex}`}
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
};

export default ShoppingCartCard;
