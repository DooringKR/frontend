interface DeliveryStatusChipProps {
  isDeliveryPossible: boolean;
  isAddressEntered: boolean;
  onUnavailableClick: () => void;
}

function DeliveryStatusChip({
  isDeliveryPossible,
  isAddressEntered,
  onUnavailableClick,
}: DeliveryStatusChipProps) {
  if (!isAddressEntered) return null;

  const handleClick = () => {
    if (!isDeliveryPossible && onUnavailableClick) {
      onUnavailableClick();
    }
  };

  return (
    <>
      <div
        className={`flex h-8 w-fit items-center justify-between rounded-lg bg-gray-100 px-[10px] py-[6px] text-[15px] font-500 text-gray-500 ${
          !isDeliveryPossible ? "cursor-pointer" : ""
        }`}
        onClick={handleClick}
      >
        <img
          src={isDeliveryPossible ? "/icons/check-mark.svg" : "/icons/exclamation-mark.svg"}
          alt={isDeliveryPossible ? "체크 아이콘" : "경고 아이콘"}
        />
        <span className="mx-1">
          {isDeliveryPossible ? "오늘배송 가능한 주소예요" : "오늘배송 불가한 주소예요"}
        </span>
        {isDeliveryPossible ? (
          ""
        ) : (
          <img src={"/icons/Arrow_Right.svg"} alt="오른쪽 화살표 아이콘" />
        )}
      </div>
    </>
  );
}

export default DeliveryStatusChip;
