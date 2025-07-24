import React from "react";

import formatSize from "@/utils/formatSize";

import Button from "../Button/Button";
import DoorPreviewIcon from "../DoorPreviewIcon/DoorPreviewIcon";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

interface ShoppingCartCardProps {
  type: "door" | "cabinet" | "finish" | "accessory" | "hardware";
  title: string;
  color?: string;
  width?: number;
  height?: number;
  depth?: number;
  hingeCount?: number;
  hingeDirection?: string;
  boring?: string;
  quantity: number;
  trashable: boolean;
  showQuantitySelector?: boolean;
  request?: string;
  onOptionClick?: () => void;
  onDecrease?: () => void;
  onIncrease?: () => void;
  bodyMaterial?: string;
  handleType?: string;
  finishType?: string;
  showBar?: string;
  drawerType?: string;
  railType?: string;
  riceRail?: string;
  lowerDrawer?: string;
  depthIncrease?: number;
  heightIncrease?: number;
  manufacturer?: string;
  modelName?: string;
  size?: string;
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({
  type,
  title,
  color,
  width,
  height,
  depth,
  hingeCount,
  hingeDirection,
  boring,
  quantity,
  trashable,
  showQuantitySelector,
  request,
  onOptionClick,
  onDecrease,
  onIncrease,
  bodyMaterial,
  handleType,
  finishType,
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
}) => {
  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border-[1px] border-gray-200 bg-white p-[20px]">
      {/* 상품 정보 */}
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-2">
          <div className="text-[17px] font-600 text-gray-800">{title}</div>
          <div className="flex flex-col text-[15px] font-400 text-gray-500">
            {color && <div>색상 : {color}</div>}
            {bodyMaterial && <div>몸통 소재 및 두께 : {bodyMaterial}</div>}
            {width && <div>{type === "cabinet" ? `너비 : ${formatSize(width.toString())}` : `가로 길이 : ${formatSize(width.toString())}`}</div>}
            {height && (
              <div>
                {type === "cabinet" || type === "finish"
                  ? `높이 : ${formatSize(height.toString())}`
                  : `세로 길이 : ${formatSize(height.toString())}`}
              </div>
            )}
            {heightIncrease && <div>⤷ 높이 키우기 : {formatSize(heightIncrease.toString())}</div>}
            {heightIncrease && (
              <div>⤷ 합산 높이 : {formatSize((Number(height) + Number(heightIncrease)).toString())}</div>
            )}
            {depth && <div>깊이 : {formatSize(depth.toString())}</div>}
            {depthIncrease && <div>⤷ 깊이 키우기 : {formatSize(depthIncrease.toString())}</div>}
            {depthIncrease && (
              <div>⤷ 합산 깊이 : {formatSize((Number(depth) + Number(depthIncrease)).toString())}</div>
            )}
            {hingeCount && <div>경첩 개수 : {hingeCount}개</div>}
            {hingeDirection && <div>경첩 방향 : {hingeDirection}</div>}
            {boring && <div>보링 치수 : {boring}</div>}
            {showBar && <div>쇼바 종류 : {showBar}</div>}
            {handleType && <div>손잡이 종류 : {handleType}</div>}
            {drawerType && <div>서랍 종류 : {drawerType}</div>}
            {railType && <div>레일 종류 : {railType}</div>}
            {riceRail && <div>밥솥 레일 추가 여부 : {riceRail}</div>}
            {lowerDrawer && <div>하부 서랍장 추가 여부 : {lowerDrawer}</div>}
            {finishType && <div>마감 방식 : {finishType}</div>}
            {manufacturer && <div>제조사 : {manufacturer}</div>}
            {modelName && <div>모델명 : {modelName}</div>}
            {size && <div>사이즈 : {size}</div>}
            {request && <div>제작 시 요청 사항 : {request}</div>}
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
                    : null}
            BoringNum={([2, 3, 4].includes(hingeCount) ? hingeCount : 2) as 2 | 3 | 4}
          />
        )}
      </div>
      {/* button section */}
      <div className="ml-auto flex w-fit items-center gap-3">
        <Button type={"OutlinedMedium"} text={"옵션 변경"} onClick={onOptionClick} />
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
