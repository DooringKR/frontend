import { CHECK_ORDER_PAGE } from "@/constants/pageName";

interface PriceCheckCardProps {
  page?: string;
}

function PriceCheckCard({ page }: PriceCheckCardProps) {
  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="text-xl font-600 text-gray-800">
        예상 주문금액을 확인해주세요
      </div>
      <div className="flex w-full flex-col gap-3 rounded-2xl border-2 border-gray-200 p-5">
        <div className="flex justify-between text-[17px] font-600 text-gray-800">
          <span>예상 주문금액</span>
          <span>{page === CHECK_ORDER_PAGE ? "1000원~" : "100,000,000원"}</span>
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
          <div className="flex justify-between">
            <span>문짝</span>
            <span>99,000,000원</span>
          </div>
          <div className="flex justify-between">
            <span>하드웨어</span>
            <span>100원</span>
          </div>
          <div className="flex justify-between">
            <span>문짝</span>
            <span>250원</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceCheckCard;
