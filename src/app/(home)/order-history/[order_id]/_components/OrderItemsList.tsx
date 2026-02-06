import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { FINISH_CATEGORY_LIST } from "@/constants/category";
import { formatPrice } from "../../utils/formatters";
import OrderItemDetail from "./OrderItemDetail";
import { Chip } from "@/components/Chip/Chip";

interface OrderItemsListProps {
  orderItems: any[];
}

export default function OrderItemsList({ orderItems }: OrderItemsListProps) {
  const sortedItems = [...orderItems].sort((a, b) => {
    const aNum = Number.parseInt(a?.nick_name ?? "", 10);
    const bNum = Number.parseInt(b?.nick_name ?? "", 10);
    const aValid = Number.isFinite(aNum);
    const bValid = Number.isFinite(bNum);
    if (aValid && bValid) return aNum - bNum;
    if (aValid) return -1;
    if (bValid) return 1;
    return String(a?.id ?? "").localeCompare(String(b?.id ?? ""));
  });

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="text-[17px]/[24px] font-600 text-gray-800">주문 상품</div>
      <div className="space-y-5">
        {sortedItems.map((item: any) => {

          return (
            <div key={item.id}>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2 text-[17px]/[24px] font-600 text-gray-900">
                    {item.nick_name && (
                      <Chip
                        text={`${item.nick_name}`}
                        color="gray"
                        weight="weak"
                        className="text-[12px]/[16px] px-[6px] py-[1px]"
                      />
                    )}
                    <span>
                      {item.detail_product_type === DetailProductType.DOOR && item.materialDetails?.is_pair_door 
                        ? `${item.detail_product_type} (양문 세트)` 
                        : item.detail_product_type}
                    </span>
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
