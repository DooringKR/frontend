import { Loading } from "@/components/state/StateViews";
import { cn } from "@/lib/utils";

interface DeliveryStatusChipProps {
  isDeliveryPossible: boolean;
  isAddressEntered: boolean;
  onUnavailableClick: () => void;
  isChecking?: boolean;
}

/** 오늘배송 가능 여부 칩 — 불가면 눌러서 이유 화면으로(그때만 버튼) */
function DeliveryStatusChip({ isDeliveryPossible, isAddressEntered, onUnavailableClick, isChecking = false }: DeliveryStatusChipProps) {
  if (!isAddressEntered) return null;
  const cls = "flex h-8 w-fit items-center rounded-lg bg-gray-100 px-[10px] py-[6px] text-[15px] font-500 text-gray-500";

  if (isChecking)
    return (
      <div className={cls}>
        <Loading variant="inline" label="배송 가능 여부 확인 중" />
      </div>
    );

  const body = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={isDeliveryPossible ? "/icons/check-mark.svg" : "/icons/exclamation-mark.svg"} alt="" className="mr-1" />
      <span className="mx-1">{isDeliveryPossible ? "오늘배송 가능한 주소예요" : "오늘배송 불가한 주소예요"}</span>
    </>
  );
  if (isDeliveryPossible) return <div className={cls}>{body}</div>;
  return (
    <button type="button" onClick={onUnavailableClick} className={cn(cls, "hover:bg-gray-200")}>
      {body}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/Arrow_Right.svg" alt="" />
    </button>
  );
}

export default DeliveryStatusChip;
