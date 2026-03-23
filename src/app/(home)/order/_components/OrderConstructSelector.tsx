"use client";

import SelectableOptionCard from "@/components/SelectableOptionCard";
import { useOrderStore } from "@/store/orderStore";

export default function OrderConstructSelector({ isLoading }: { isLoading?: boolean }) {
  const order = useOrderStore(state => state.order);
  const updateOrder = useOrderStore(state => state.updateOrder);

  return (
    <section className="flex flex-col gap-3 py-5">
      <div className="w-full text-[14px] font-400 text-gray-600">추가선택</div>
      <div className="w-full rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start overflow-hidden">
        <SelectableOptionCard
          title="시공도 필요해요"
          description="세부 내용은 상담으로 안내해드려요."
          showImage={true}
          imageUrl="/img/door_construction.png"
          showChip={false}
          showExpandableContent={false}
          checked={Boolean(order?.order_construct)}
          onChange={(checked: boolean) => {
            if (isLoading) return;
            updateOrder({ order_construct: checked });
          }}
        />
      </div>
    </section>
  );
}
