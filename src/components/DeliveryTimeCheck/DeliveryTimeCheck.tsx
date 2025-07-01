import { useRouter } from "next/navigation";

interface DeliveryTimeCheckProps {
  isDeliveryPossible: boolean;
  isAddressEntered: boolean;
}

function DeliveryTimeCheck({ isDeliveryPossible, isAddressEntered }: DeliveryTimeCheckProps) {
  const router = useRouter();

  if (!isAddressEntered) return null;

  const handleClick = () => {
    if (!isDeliveryPossible) {
      router.push("/address-check/unavailable"); // 이동할 페이지 경로
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

export default DeliveryTimeCheck;
