"use client";

import Image from "next/image";
import { useState } from "react";

import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";

import baseSchema from "@/utils/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

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
    <div className="mt-[14px] rounded border bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">받는 분 휴대폰 번호</p>
          <p>{formatPhoneNumber(recipientPhoneNumber)}</p>
        </div>
        <button
          onClick={() => {
            setTempPhoneNumber(recipientPhoneNumber);
            setIsModalOpen(true);
          }}
        >
          <span className="text-base">&gt;</span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col gap-8 w-full max-w-lg h-screen bg-white p-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <Image src="/icons/Arrow_Left.svg" width={24} height={24} alt="뒤로가기" />
              </button>
              <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
            </div>

            <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
              받는 분 휴대전화 번호를 <br /> 입력해주세요
            </h1>

            <div>
              <p className="mb-2 text-sm">휴대폰 번호</p>
              <Input
                type="text"
                name="수령자 전화번호"
                value={formatPhoneNumber(tempPhoneNumber)}
                onChange={handleInputChange}
                placeholder="010-1234-5678"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
              />
              {errorMessage && (
                <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSave}
              disabled={!!errorMessage}
              className="fixed bottom-5 right-5 left-5 text-white bg-black"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
