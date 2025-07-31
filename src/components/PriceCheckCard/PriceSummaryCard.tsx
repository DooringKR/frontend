import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import React from "react";

import useCartStore from "@/store/cartStore";

// type OrderItem = {
//   price?: number;
//   count?: number;
// } | null;
type OrderItem = {
  price?: number | null;
  count?: number | null;
};

interface PriceSummaryCardProps {
  // cartGroups: Record<string, (OrderItem | null)[]>;

  getTotalPrice: () => number;
  categoryMap: Record<string, string>;
  page?: string;
}

const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  getTotalPrice,
  categoryMap,
  page,
}) => {
  const cartItems = useCartStore(state => state.cartItems);
  const groupedItems = (cartItems ?? []).reduce<Record<string, OrderItem[]>>((acc, item) => {
    const category = (item.category ?? "기타").toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="text-xl font-600 text-gray-800">
        {page === CHECK_ORDER_PAGE ? "예상 주문금액을 확인해주세요" : "주문금액을 확인해주세요"}
      </div>
      <div className="flex w-full flex-col gap-3 rounded-2xl border-2 border-gray-200 p-5">
        <div className="flex justify-between text-[17px] font-600 text-gray-800">
          <span>{page === CHECK_ORDER_PAGE ? "예상 주문금액" : "주문금액"}</span>
          <span>
            {page === CHECK_ORDER_PAGE ? (
              <>{getTotalPrice().toLocaleString()}원~</>
            ) : (
              <>{getTotalPrice().toLocaleString()}원</>
            )}
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
          {/* {Object.entries(groupedItems).map(([category, items]) => {
            const categoryTotal = items.reduce((sum, item) => {
              return sum + (item.price ?? 0) * (item.count ?? 1);
            }, 0);

            return (
              <div key={category} className="mb-1 flex justify-between">
                <span>{categoryMap[category] ?? category}</span>
                <span>{categoryTotal.toLocaleString()}원</span>
              </div>
            );
          })} */}

          {Object.entries(groupedItems).map(([category, items]) =>
            items.map((item, index) => (
              <div
                key={`${category}-${index}`}
                className="mb-1 flex justify-between text-[15px] font-400 text-gray-500"
              >
                <span>
                  {items.length > 1
                    ? `${categoryMap[category] ?? category}`
                    : (categoryMap[category] ?? category)}
                </span>
                <span>{((item.price ?? 0) * (item.count ?? 1)).toLocaleString()}원</span>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceSummaryCard;
