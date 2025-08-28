import React from "react";

import DoorPreviewIcon from "@/components/DoorPreviewIcon/DoorPreviewIcon";

import formatBoring from "@/utils/formatBoring";
import formatSize from "@/utils/formatSize";

interface OrderConfirmCardProps {
  type: "door" | "cabinet" | "finish" | "accessory" | "hardware";
  title: string;
  color?: string;
  width?: number;
  height?: number;
  depth?: number;
  hingeCount?: number;
  hingeDirection?: string;
  boring?: (number | null)[];
  boringCategory?: string;
  quantity: number;
  request?: string;
  bodyMaterial?: string;
  handleType?: string;
  finishType?: string;
  showBar?: string;
  drawerType?: string;
  railType?: string;
  depthIncrease?: number;
  heightIncrease?: number;
  manufacturer?: string;
  modelName?: string;
  size?: string;
  price: number | string;
}

const OrderConfirmCard: React.FC<OrderConfirmCardProps> = ({
  type,
  title,
  color,
  width,
  height,
  depth,
  hingeCount,
  hingeDirection,
  boring,
  boringCategory,
  quantity,
  request,
  bodyMaterial,
  handleType,
  finishType,
  showBar,
  drawerType,
  railType,
  depthIncrease,
  heightIncrease,
  manufacturer,
  modelName,
  size,
  price,
}) => {
  return (
    <div className="flex w-full items-start justify-between gap-5">
      <div className="flex flex-col text-[15px] text-gray-500">
        <p className="mb-2 text-[17px] font-semibold text-gray-800">{title}</p>
        {color && <p>색상: {color}</p>}
        {width && (
          <p>
            {type === "cabinet"
              ? `너비: ${formatSize(width.toString())}`
              : `가로 길이: ${formatSize(width.toString())}`}
          </p>
        )}
        {height && (
          <p>
            {type === "cabinet"
              ? `높이: ${formatSize(height.toString())}`
              : `세로 길이: ${formatSize(height.toString())}`}
          </p>
        )}
        {heightIncrease !== undefined && heightIncrease !== null && heightIncrease > 0 && (
          <p>⤷ 높이 키우기: {formatSize(heightIncrease.toString())}</p>
        )}
        {height && heightIncrease !== undefined && heightIncrease !== null && heightIncrease > 0 && (
          <p>⤷ 합산 높이: {formatSize((height + heightIncrease).toString())}</p>
        )}
        {depth && <p>깊이: {formatSize(depth.toString())}</p>}
        {depthIncrease !== undefined && depthIncrease !== null && depthIncrease > 0 && (
          <p>⤷ 깊이 키우기: {formatSize(depthIncrease.toString())}</p>
        )}
        {depth && depthIncrease !== undefined && depthIncrease !== null && depthIncrease > 0 && (
          <p>⤷ 합산 깊이: {formatSize((depth + depthIncrease).toString())}</p>
        )}
        {hingeCount && <p>경첩 개수: {hingeCount}개</p>}
        {hingeDirection && <p>경첩 방향: {hingeDirection}</p>}
        {boring && <p>보링 치수: {formatBoring(boring, boringCategory)}</p>}
        {bodyMaterial && <p>몸통 소재 및 두께: {bodyMaterial}</p>}
        {handleType && <p>손잡이 종류: {handleType}</p>}
        {finishType && <p>마감 방식: {finishType}</p>}
        {showBar && <p>쇼바 종류: {showBar}</p>}
        {drawerType && <p>서랍 종류: {drawerType}</p>}
        {railType && <p>레일 종류: {railType}</p>}
        {manufacturer && <p>제조사: {manufacturer}</p>}
        {modelName && <p>모델명: {modelName}</p>}
        {size && <p>사이즈: {size}</p>}
        {request && <p>요청사항: {request}</p>}

        <p className="mt-1 text-[15px] font-500 text-gray-800">
          {typeof price === "number"
            ? `${(price * (quantity ?? 1)).toLocaleString()}원 ∙ ${quantity}개`
            : `${price} ∙ ${quantity}개`}
        </p>
      </div>

      {type === "door" && (title === "플랩문" || title === "일반문") && hingeCount && (
        <div>
          <DoorPreviewIcon
            DoorType={title}
            FatOrTall={
              width && height ? (width > height ? "Fat" : width < height ? "Tall" : "Same") : "Tall"
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
        </div>
      )}
    </div>
  );
};

export default OrderConfirmCard;
