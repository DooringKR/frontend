import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import React from "react";

import useCartItemStore from "@/store/cartItemStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";



type PriceSummaryCardProps = {
  getTotalPrice: () => number;
  page?: string;
};

const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  getTotalPrice,
  page,
}) => {
  // DDD: cartItems come from cartItemStore, not cartStore
  const cartItems = useCartItemStore(state => state.cartItems) ?? [];

  // DDD: group by detail_product_type (enum value, which is already a user-friendly string)
  const groupedItems = cartItems.reduce<Record<string, typeof cartItems>>((acc, item) => {
    const category = item.detail_product_type ?? "기타";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // DDD: check if all items are accessory or hardware by detail_product_type (enum value)
  const onlyExtraPriceItems =
    cartItems.length > 0 &&
    cartItems.every(item => {
      const type = item.detail_product_type;
      return [
        DetailProductType.ACCESSORY,
        DetailProductType.HINGE,
        DetailProductType.RAIL,
        DetailProductType.PIECE
      ].includes(type);
    });

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="text-xl font-600 text-gray-800">
        {page === CHECK_ORDER_PAGE ? "예상 주문금액을 확인해주세요" : "주문금액을 확인해주세요"}
      </div>
      <div className="flex w-full flex-col gap-3 rounded-2xl border-2 border-gray-200 p-5">
        <div className="flex justify-between text-[17px] font-600 text-gray-800">
          <span>{page === CHECK_ORDER_PAGE ? "예상 주문금액" : "주문금액"}</span>
          <span>
            {onlyExtraPriceItems
              ? "별도 견적"
              : page === CHECK_ORDER_PAGE
                ? <>{getTotalPrice().toLocaleString()}원&nbsp;<span className="text-gray-600">부터~</span></>
                : <>{getTotalPrice().toLocaleString()}원&nbsp;<span className="text-gray-600">부터~</span></>}
          </span>
        </div>
        {page === CHECK_ORDER_PAGE ? (
          <p className="text-[15px] font-400 text-gray-500">
            주문 이후에 전화로 정확한 견적을 알려드려요.
          </p>
        ) : (
          ""
        )}

        <div className="h-[2px] w-full bg-gray-200"></div>
        <div className="flex flex-col gap-1 text-[15px] font-400 text-gray-500">
          {Object.entries(groupedItems).flatMap(([category, items]) =>
            items.map((item, index) => {
              // label: just use the enum value (already 한글)
              const label = category;
              // extra price for accessory/hardware types (by enum)
              const isExtraPriceCategory = [
                DetailProductType.ACCESSORY,
                DetailProductType.HINGE,
                DetailProductType.RAIL,
                DetailProductType.PIECE
              ].includes(item.detail_product_type);
              const displayPrice = isExtraPriceCategory
                ? "별도 견적"
                : `${((item.unit_price ?? 0) * (item.item_count ?? 1)).toLocaleString()}원 부터~`;

              return (
                <div
                  key={`${category}-${index}`}
                  className="mb-1 flex justify-between text-[15px] text-gray-500"
                >
                  <span>{label}</span>
                  <span>{displayPrice}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceSummaryCard;
