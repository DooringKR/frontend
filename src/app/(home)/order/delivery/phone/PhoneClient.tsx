"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import Input from "@/components/Input/Input";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useBizClient from "@/store/bizClientStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import baseSchema from "@/utils/schema";
import { useOrderStore } from "@/store/orderStore";
import BottomButton from "@/components/BottomButton/BottomButton";

export default function PhoneClientPage() {
  const router = useRouter();
  const recipientPhoneNumber = useBizClient.getState().getPhoneNumber() || "";

  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const formatted = formatPhoneNumber(recipientPhoneNumber);
    setTempPhoneNumber(formatted);
  }, [recipientPhoneNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "").slice(0, 11);
    const formatted = formatPhoneNumber(numeric);

    setTempPhoneNumber(formatted);

    const result = baseSchema.safeParse({ user_phoneNumber: formatted });
    setErrorMessage(result.success ? null : result.error.errors[0]?.message);
  };

  const handleSave = () => {
    const result = baseSchema.safeParse({
      user_phoneNumber: formatPhoneNumber(tempPhoneNumber),
    });
    if (result.success) {
      const phoneNumber = result.data.user_phoneNumber.replace(/-/g, "");
      useOrderStore.getState().updateOrder({ recipient_phone: phoneNumber });
      router.back();
    } else {
      setErrorMessage(result.error.errors[0]?.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="휴대폰 번호" />
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-6">
        <h1 className="pb-5 pt-5 text-[23px] font-700 text-gray-900">받는 분 휴대폰 번호</h1>
        <Input
          label=""
          type="tel"
          name="수령자 전화번호"
          value={tempPhoneNumber}
          onChange={handleInputChange}
          placeholder="010-1234-5678"
          className="w-full px-4 py-3 text-base"
        />

        {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
      </div>
      <div className="fixed bottom-0 w-full max-w-[460px] p-5">
        <BottomButton
          type="1button"
          button1Text={tempPhoneNumber === recipientPhoneNumber ? "확인" : "저장하기"}
          onButton1Click={handleSave}
          button1Disabled={!!errorMessage}
          className="w-full"
        >
        </BottomButton>
      </div>
    </div>
  );
}
