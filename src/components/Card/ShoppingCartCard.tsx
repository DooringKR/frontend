
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import React from "react";


import { DoorType, FinishEdgeCount, HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import Button from "../Button/Button";
import DoorPreviewIcon from "../DoorPreviewIcon/DoorPreviewIcon";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

interface ShoppingCartCardProps {
  type: "door" | "cabinet" | "finish" | "accessory" | "hardware";
  title: string;
  totalPrice?: number;
  color?: string;
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
  showBar?: string;
  drawerType?: string;
  railType?: string;
  railLength?: string;
  riceRail?: string;
  lowerDrawer?: string;
  depthIncrease?: number;
  heightIncrease?: number;
  manufacturer?: string;
  modelName?: string;
  size?: string;
  addOn_hinge?: boolean;
  addOn_construction?: boolean;
  legType?: string;
  thickness?: string;
  angle?: string;
  railDamping?: boolean;
  behindType?: string;
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({
  type,
  title,
  totalPrice,
  color,
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
  showBar,
  drawerType,
  railType,
  riceRail,
  lowerDrawer,
  depthIncrease,
  heightIncrease,
  manufacturer,
  modelName,
  size,
  addOn_hinge,
  addOn_construction,
  legType,
  thickness,
  angle,
  railLength,
  railDamping,
}) => {
  // bodyMaterial이 숫자(id)라면 name으로 변환
  let bodyMaterialLabel = bodyMaterial;
  if (bodyMaterial && !isNaN(Number(bodyMaterial))) {
    const found = BODY_MATERIAL_LIST.find(opt => String(opt.id) === String(bodyMaterial));
    if (found) bodyMaterialLabel = found.name;
  }
  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border-[1px] border-gray-200 bg-white p-[20px]">
      {/* 상품 정보 */}
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-2">
          <div className="text-[17px] font-600 text-gray-800">{title}</div>
          <div className="flex flex-col text-[15px] font-400 text-gray-500">
            {type !== "hardware" && color && <div>색상 : {color}</div>}
            {bodyMaterial && <div>몸통 소재 및 두께 : {bodyMaterialLabel}</div>}
            {width && <div>너비 : {width}mm</div>}
            {height && <div>높이 : {height}mm</div>}
            {heightIncrease !== undefined && heightIncrease !== null && heightIncrease > 0 && (
              <>
                <div>⤷ 높이 키우기 : {heightIncrease}mm</div>
                {height && <div>⤷ 합산 높이 : {Number(height) + Number(heightIncrease)}mm</div>}
              </>
            )}
            {depth && <div>깊이 : {depth}mm</div>}
            {depthIncrease !== undefined && depthIncrease !== null && depthIncrease > 0 && (
              <>
                <div>⤷ 깊이 키우기 : {depthIncrease}mm</div>
                {depth && <div>⤷ 합산 깊이 : {Number(depth) + Number(depthIncrease)}mm</div>}
              </>
            )}
            {edgeCount && <div>엣지 면 수 : {edgeCount}</div>}
            {type === "hardware" && manufacturer && <div>제조사 : {manufacturer}</div>}
            {type === "hardware" && railType && <div>레일 종류 : {railType}</div>}
            {type === "hardware" && railLength && <div>레일 길이 : {railLength}</div>}
            {type === "hardware" && color && <div>색상 : {color}</div>}
            {type === "hardware" && size && <div>사이즈 : {size}</div>}
            {type === "hardware" && thickness && <div>합판 두께 : {thickness}</div>}
            {type === "hardware" && angle && <div>각도 : {angle}</div>}
            {type === "hardware" && railDamping !== undefined && <div>레일 댐핑 : {railDamping ? "있음" : "없음"}</div>}
            {hingeCount && <div>경첩 개수 : {hingeCount}개</div>}
            {hingeDirection && <div>경첩 방향 : {hingeDirection}</div>}
            {boring && (
              <div>
                보링 치수 : {Array.isArray(boring) ? boring.filter(Boolean).join(", ") : boring}
              </div>
            )}
            {showBar && <div>쇼바 종류 : {showBar}</div>}
            {handleType && <div>손잡이 종류 : {handleType}</div>}
            {drawerType && <div>서랍 종류 : {drawerType}</div>}
            {/* 중복 방지: railType은 위에서만 출력 */}
            {riceRail && <div>밥솥 레일 추가 여부 : {riceRail}</div>}
            {lowerDrawer && <div>하부 서랍장 추가 여부 : {lowerDrawer}</div>}
            {behindType && <div>마감 방식 : {behindType}</div>}
            {/* 중복 방지: manufacturer는 위에서만 출력 */}
            {modelName && <div>모델명 : {modelName}</div>}
            {type !== "hardware" && size && <div>사이즈 : {size}</div>}
            {request && <div>제작 시 요청 사항 : {request}</div>}
            {location && <div>용도 ∙ 장소 : {location}</div>}
            {addOn_hinge !== undefined && addOn_hinge !== null && (
              <div>경첩 추가 선택 : {addOn_hinge ? "경첩도 받기" : "필요 없어요"}</div>
            )}
            {addOn_construction !== undefined && addOn_construction !== null && (
              <div>시공 필요 여부 : {addOn_construction ? "시공도 필요해요" : "필요 없어요"}</div>
            )}
            {legType && <div>다리발 : {legType}</div>}
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
    </div>
  );
};

export default ShoppingCartCard;
