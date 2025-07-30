"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import Input from "@/components/Input/Input";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import baseSchema from "@/utils/schema";

export default function PhoneClientPage() {
  const router = useRouter();
  const { recipientPhoneNumber, setRecipientPhoneNumber } = useOrderStore();

  // const [tempPhoneNumber, setTempPhoneNumber] = useState(recipientPhoneNumber);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(""); // 초기값 비움
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setTempPhoneNumber(recipientPhoneNumber);
  }, [recipientPhoneNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "").slice(0, 11);
    const formatted = formatPhoneNumber(numeric);
    // setTempPhoneNumber(numeric);
    setTempPhoneNumber(formatted); // 이 부분 수정

    const result = baseSchema.safeParse({ user_phoneNumber: formatted });
    setErrorMessage(result.success ? null : result.error.errors[0]?.message);
  };

  const handleSave = () => {
    const result = baseSchema.safeParse({
      user_phoneNumber: formatPhoneNumber(tempPhoneNumber),
    });
    if (result.success) {
      // // setRecipientPhoneNumber(formatPhoneNumber(tempPhoneNumber));
      // setRecipientPhoneNumber(tempPhoneNumber); // 상태 저장
      const formatted = formatPhoneNumber(tempPhoneNumber);
      setRecipientPhoneNumber(formatted);
      router.back();
    } else {
      setErrorMessage(result.error.errors[0]?.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="휴대폰 번호" />
      <div className="flex flex-grow flex-col px-5 py-6">
        <div className="flex-grow">
          <h1 className="pb-5 pt-5 text-[23px] font-700 text-gray-900">받는 분 휴대폰 번호</h1>
          <Input
            label=""
            type="text"
            name="수령자 전화번호"
            value={tempPhoneNumber} // 포맷된 값 그대로 보여줌
            onChange={handleInputChange}
            placeholder="010-1234-5678"
            className="w-full px-4 py-3 text-base"
          />
          {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
        </div>
        <Button
          type="button"
          selected={!errorMessage}
          onClick={handleSave}
          disabled={!!errorMessage}
          className="mt-4"
        >
          {tempPhoneNumber === recipientPhoneNumber ? "확인" : "저장하기"}
        </Button>
      </div>
    </div>
  );
}
