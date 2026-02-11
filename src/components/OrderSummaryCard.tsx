import React from "react";

import QuantitySelector from "./QuantitySelector/QuantitySelector";

interface OrderSummaryCardProps {
  quantity: number;
  unitPrice: number;
  onIncrease: () => void;
  onDecrease: () => void;
  trashable?: boolean;
  disabled?: boolean;
  showQuantitySelector?: boolean;
  totalPrice?: number; // 총 가격 (지정 시 unitPrice * quantity 대신 사용)
  hideFromText?: boolean; // "부터~" 텍스트 숨김 여부 (롱문 등 세트상품용)
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  quantity,
  unitPrice,
  onIncrease,
  onDecrease,
  trashable = false,
  disabled = false,
  showQuantitySelector = true,
  totalPrice,
  hideFromText = false,
}) => {
  return (
    <div className="flex flex-col gap-[16px] rounded-[16px] bg-gray-50 p-5">
      {/* 금액 */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex">
            <span className="text-[16px]/[22px] font-500 text-brand-500">{quantity}</span>
            <span className="text-[16px]/[22px] font-500 text-gray-500">개 상품 금액</span>
          </div>
          <span className="text-[20px]/[28px] font-600 text-gray-800">
            {totalPrice !== undefined
              ? (totalPrice === 0 ? "별도 견적" : (
                <>
                  {`${totalPrice.toLocaleString()}원`}
                  {!hideFromText && <span className="text-gray-600"> 부터~</span>}
                </>
              ))
              : (unitPrice === 0 ? "별도 견적" : (
                <>
                  {`${(quantity * unitPrice).toLocaleString()}원`}
                  {!hideFromText && <span className="text-gray-600"> 부터~</span>}
                </>
              ))
            }
          </span>
        </div>
        <div className="flex items-center justify-end text-[13px]/[18px] font-400 text-gray-400">
          배송비 별도
        </div>
      </div>
      {/* 개수 */}
      {showQuantitySelector && (
        <div className="flex items-center justify-between">
          <span className="text-[16px]/[22px] font-500 text-gray-500">주문 개수</span>
          <QuantitySelector
            trashable={trashable}
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;
