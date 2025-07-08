"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

// interface RecipientPhoneNumberProps {
//   recipientPhoneNumber: string;
//   setRecipientPhoneNumber: (phoneNumber: string) => void;
// }

export default function RecipientPhoneNumber() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [tempPhoneNumber, setTempPhoneNumber] = useState(recipientPhoneNumber);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const recipientPhoneNumber = useOrderStore(state => state.recipientPhoneNumber); // ✅ 이렇게 해야 리렌더링됨
  console.log("📦 리렌더된 번호:", recipientPhoneNumber); // ⬅️ 요기

  console.log("📦 원본 번호:", recipientPhoneNumber);
  console.log("📦 포맷된 번호:", formatPhoneNumber(recipientPhoneNumber)); // ⬅️ 요기 추가

  const handleClick = () => {
    router.push("/cart/checkorder/phone");
  };

  return (
    <div className="rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[17px] font-600">받는 분 휴대폰 번호</p>
          <p className="text-[15px] font-400">{formatPhoneNumber(recipientPhoneNumber)}</p>
        </div>
        <button onClick={handleClick}>
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>
    </div>
  );
}
