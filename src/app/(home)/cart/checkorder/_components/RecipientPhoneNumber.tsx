"use client";

import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import baseSchema from "@/utils/schema";

interface RecipientPhoneNumberProps {
  recipientPhoneNumber: string;
  setRecipientPhoneNumber: (phoneNumber: string) => void;
}

export default function RecipientPhoneNumber({
  recipientPhoneNumber,
  setRecipientPhoneNumber,
}: RecipientPhoneNumberProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(recipientPhoneNumber);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = () => {
    const result = baseSchema.safeParse({ user_phoneNumber: formatPhoneNumber(tempPhoneNumber) });
    if (result.success) {
      setRecipientPhoneNumber(formatPhoneNumber(tempPhoneNumber));
      setIsModalOpen(false);
    } else {
      setErrorMessage(result.error.errors[0]?.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "").slice(0, 11);
    const formatted = formatPhoneNumber(numeric);
    setTempPhoneNumber(numeric);

    // 즉시 유효성 검사
    const result = baseSchema.safeParse({ user_phoneNumber: formatted });
    setErrorMessage(result.success ? null : result.error.errors[0]?.message);
  };

  return (
    <div className="rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[17px] font-600">받는 분 휴대폰 번호</p>
          <p className="text-[15px] font-400">{formatPhoneNumber(recipientPhoneNumber)}</p>
        </div>
        <button
          onClick={() => {
            setTempPhoneNumber(recipientPhoneNumber);
            setIsModalOpen(true);
          }}
        >
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex h-screen w-full max-w-lg flex-col bg-white pb-5">
            <TopNavigator />
            {/* <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <Image src="/icons/Arrow_Left.svg" width={24} height={24} alt="뒤로가기" />
              </button>
              <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
            </div> */}

            {/* <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
              받는 분 휴대전화 번호를 <br /> 입력해주세요
            </h1> */}

            <div className="flex-grow px-5">
              <h1 className="pb-5 pt-5 text-[23px] font-700 text-gray-900">받는 분 휴대폰 번호</h1>
              <Input
                label=""
                type="text"
                name="수령자 전화번호"
                value={formatPhoneNumber(tempPhoneNumber)}
                onChange={handleInputChange}
                placeholder="010-1234-5678"
                className="w-full px-4 py-3 text-base"
              />
              {errorMessage && <p className="-mt-4 text-sm text-red-500">{errorMessage}</p>}
            </div>

            <Button
              type="button"
              selected={!errorMessage}
              onClick={handleSave}
              disabled={!!errorMessage}
              className="mx-5"
            >
              저장하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
