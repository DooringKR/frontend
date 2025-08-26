interface DeliveryStatusChipProps {
  isDeliveryPossible: boolean;
  isAddressEntered: boolean;
  onUnavailableClick: () => void;
  isChecking?: boolean;
}

function DeliveryStatusChip({
  isDeliveryPossible,
  isAddressEntered,
  onUnavailableClick,
  isChecking = false,
}: DeliveryStatusChipProps) {
  if (!isAddressEntered) return null;

  const handleClick = () => {
    if (!isDeliveryPossible && onUnavailableClick) {
      onUnavailableClick();
    }
  };

  return (
    <div
      className={`flex h-8 w-fit items-center justify-between rounded-lg px-[10px] py-[6px] text-[15px] font-500 ${
        isChecking ? "cursor-not-allowed bg-gray-200 text-gray-400" : "bg-gray-100 text-gray-500"
      } ${!isDeliveryPossible && !isChecking ? "cursor-pointer" : ""} `}
      onClick={handleClick}
    >
      {!isChecking && (
        <img
          src={isDeliveryPossible ? "/icons/check-mark.svg" : "/icons/exclamation-mark.svg"}
          alt="상태 아이콘"
          className="mr-1"
        />
      )}
      <span className="mx-1">
        {isChecking
          ? "배송 가능 여부 확인 중..."
          : isDeliveryPossible
            ? "오늘배송 가능한 주소예요"
            : "오늘배송 불가한 주소예요"}
      </span>
      {!isDeliveryPossible && !isChecking && (
        <img src="/icons/Arrow_Right.svg" alt="오른쪽 화살표 아이콘" />
      )}
    </div>
  );
}

export default DeliveryStatusChip;
