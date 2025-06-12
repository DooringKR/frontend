"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

interface CustomerRequestProps {
  customerRequest: string;
  setCustomerRequest: (customerRequest: string) => void;
}

export default function CustomerRequest({
  customerRequest,
  setCustomerRequest,
}: CustomerRequestProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempRequest, setTempRequest] = useState(customerRequest);

  const handleSave = () => {
    setCustomerRequest(tempRequest);
    setIsModalOpen(false);
  };

  return (
    <div className="mt-[14px] rounded border bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">도어링 요청사항</p>
          <p>{customerRequest || "요청사항 없음"}</p>
        </div>
        <button
          onClick={() => {
            setTempRequest(customerRequest);
            setIsModalOpen(true);
          }}
        >
          <span className="text-base">
            <span className="text-blue-500">요청입력</span> &gt;
          </span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex h-screen w-full max-w-lg flex-col gap-8 bg-white p-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <Image src="/icons/Arrow_Left.svg" width={24} height={24} alt="뒤로가기" />
              </button>
              <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
            </div>

            <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
              요청사항을 입력해주세요
            </h1>
            <Input
              label="요청사항"
              type="text"
              name="고객 요청사항"
              value={tempRequest}
              onChange={e => setTempRequest(e.target.value)}
              placeholder="요청사항을 입력해주세요"
              className="w-full text-base"
            />
            <Button
              type="button"
              onClick={handleSave}
              selected={!!tempRequest.trim()}
              disabled={!tempRequest.trim()}
              className="fixed bottom-5 left-5 right-5 mx-auto max-w-[460px]"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
