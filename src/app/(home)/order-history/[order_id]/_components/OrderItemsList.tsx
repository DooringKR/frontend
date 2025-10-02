import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { FINISH_CATEGORY_LIST } from "@/constants/category";
import { formatPrice } from "../../utils/formatters";
import OrderItemDetail from "./OrderItemDetail";

interface OrderItemsListProps {
  orderItems: any[];
}

export default function OrderItemsList({ orderItems }: OrderItemsListProps) {

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="text-[17px]/[24px] font-600 text-gray-800">주문 상품</div>
      <div className="space-y-5">
        {orderItems.map((item: any) => {

          return (
            <div key={item.id}>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 text-[17px]/[24px] font-600 text-gray-900">
                    {item.detail_product_type}
                  </div>
                  <div className="text-[14px]/[20px] font-500 text-gray-500">
                    {item.item_count}개 × {item.unit_price === 0 ? "별도견적" : `${formatPrice(item.unit_price)}원`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[17px]/[24px] font-600 text-gray-900">
                    {item.unit_price === 0 ? "별도견적" : `${formatPrice(item.unit_price * item.item_count)}원`}
                  </div>
                </div>
              </div>
              <OrderItemDetail item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
