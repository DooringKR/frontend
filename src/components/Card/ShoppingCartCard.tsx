import MinusIcon from "public/icons/minus";
import PlusIcon from "public/icons/plus";
import TrashCan from "public/icons/trash_can";
import React from "react";

import DoorPreviewIcon from "../DoorPreviewIcon/DoorPreviewIcon";
import Button from "../Button/Button";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

interface ShoppingCartCardProps {
  type: "door" | "cabinet";
  title: string;
  color: string;
  width: string;
  height: string;
  depth?: string;
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
}) => {
  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border-[1px] border-gray-200 bg-white p-[20px]">
      {/* 상품 정보 */}
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-2">
          <div className="text-[17px} font-600 text-gray-800">{title}</div>
          <div className="flex flex-col text-[15px] font-400 text-gray-500">
            <div>색상 : {color}</div>
            {bodyMaterial && <div>몸통 소재 및 두께 : {bodyMaterial}</div>}
            <div>{type === "cabinet" ? `너비 : ${width}` : `가로 길이 : ${width}`}</div>
            <div>{type === "cabinet" ? `높이 : ${height}` : `세로 길이 : ${height}`}</div>
            {depth && <div>깊이 : {depth}</div>}
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
            {request && <div>제작 시 요청 사항 : {request}</div>}
          </div>
        </div>
        {type === "door" && hingeCount && hingeDirection && <DoorPreviewIcon
          DoorType={"플랩문"}
          FatOrTall={"Tall"}
          BoringDirection={hingeDirection === "우경" ? "right" : "left"}
          BoringNum={([2, 3, 4].includes(hingeCount) ? hingeCount : 2) as 2 | 3 | 4}
        />
        }
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
