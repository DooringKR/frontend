import MinusIcon from "public/icons/minus";
import PlusIcon from "public/icons/plus";
import TrashCan from "public/icons/trash_can";
import React from "react";

import Button2 from "../Button/Button";
import DoorPreviewIcon from "../DoorPreviewIcon/DoorPreviewIcon";

interface ShoppingCartCardProps {
  title: string;
  color: string;
  width: string;
  height: string;
  hingeCount: number;
  hingeDirection: string;
  boring: string;
  quantity: number;
  trashable: boolean;
  onOptionClick?: () => void;
  onDecrease?: () => void;
  onIncrease?: () => void;
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({
  title,
  color,
  width,
  height,
  hingeCount,
  hingeDirection,
  boring,
  quantity,
  trashable,
  onOptionClick,
  onDecrease,
  onIncrease,
}) => {
  return (
    <div className="flex w-full flex-col gap-[20px] rounded-[16px] border-[1px] border-gray-200 bg-white p-[20px]">
      {/* 상품 정보 */}
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-2">
          <div className="text-[17px} font-600 text-gray-800">{title}</div>
          <div className="flex flex-col text-[15px] font-400 text-gray-500">
            <div>색상 : {color}</div>
            <div>가로 길이 : {width}</div>
            <div>세로 길이 : {height}</div>
            <div>경첩 개수 : {hingeCount}개</div>
            <div>경첩 방향 : {hingeDirection}</div>
            <div>보링 치수 : {boring}</div>
          </div>
        </div>
        <DoorPreviewIcon
          DoorType={"플랩문"}
          FatOrTall={"Tall"}
          BoringDirection={hingeDirection === "우경" ? "right" : "left"}
          BoringNum={([2, 3, 4].includes(hingeCount) ? hingeCount : 2) as 2 | 3 | 4}
        />
      </div>
      {/* button section */}
      <div className="ml-auto flex w-fit items-center gap-3">
        <Button2 type={"OutlinedMedium"} text={"옵션 변경"} />
        <QuantitySelector
          quantity={quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          trashable={trashable}
        />
      </div>
    </div>
  );
  function QuantitySelector({
    trashable,
    quantity,
    onDecrease,
    onIncrease,
  }: {
    trashable: boolean;
    quantity: number;
    onDecrease?: () => void;
    onIncrease?: () => void;
  }) {
    return (
      <div className="flex items-center">
        <button
          className="h-[40px] rounded-l-[10px] border-b border-l border-t px-2"
          style={{
            transition: "background 0.2s",
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = "linear-gradient(90deg, #F3F4F6 0%, #FFF 100%)")
          }
          onMouseLeave={e => (e.currentTarget.style.background = "")}
          onClick={onDecrease}
          aria-label="수량 감소"
        >
          {trashable && quantity === 1 ? (
            <TrashCan disabled={false} />
          ) : (
            <MinusIcon disabled={quantity <= 0} />
          )}
        </button>
        <div className="flex h-[40px] w-[32px] items-center justify-center border-b border-t text-center text-[16px] font-500 text-gray-700">
          {quantity}
        </div>
        <button
          className="h-[40px] rounded-r-[10px] border-b border-r border-t px-2"
          style={{
            transition: "background 0.2s",
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.background = "linear-gradient(270deg, #F3F4F6 0%, #FFF 100%)")
          }
          onMouseLeave={e => (e.currentTarget.style.background = "")}
          onClick={onIncrease}
          aria-label="수량 증가"
        >
          <PlusIcon disabled={false} />
        </button>
      </div>
    );
  }
};

export default ShoppingCartCard;
