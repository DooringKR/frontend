"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Modal from "@/components/Modal/Modal";

import AddressModal from "./AddressModal";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

interface DeliveryAddressCardProps {
  address: { address1: string; address2: string };
  requestMessage: string;
  setRequestMessage: (message: string) => void;
  setAddress: (address: { address1: string; address2: string }) => void;
  foyerAccessType: {
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  };
  setFoyerAccessType: (data: {
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  }) => void;
}

export default function DeliveryAddressCard({
  address,
  requestMessage,
  foyerAccessType,
  setFoyerAccessType,
  setRequestMessage,
  setAddress,
}: DeliveryAddressCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState(foyerAccessType.gatePassword || "");

  const handleSelect = (type: "gate" | "call" | "doorfront") => {
    setFoyerAccessType({
      type,
      gatePassword: type === "gate" ? tempPassword : null,
    });
  };

  const handleAddressSelect = (addr1: string, addr2: string) => {
    setAddress({ address1: addr1, address2: addr2 });
  };

  const handleSave = () => {
    if (foyerAccessType.type === "gate") {
      setFoyerAccessType({
        type: "gate",
        gatePassword: tempPassword,
      });
      setRequestMessage("공동현관으로 올라오세요");
    } else if (foyerAccessType.type === "call") {
      setRequestMessage("전화주시면 마중 나갈게요");
    } else if (foyerAccessType.type === "doorfront") {
      setRequestMessage("문 앞에 두면 가져갈게요");
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    setTempPassword(foyerAccessType.gatePassword || "");
  }, [foyerAccessType]);

  return (
    <div className="rounded border bg-gray-50 p-4">
      {/* 배송주소 섹션 */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">배송주소</p>
            <p className="font-bold">{address.address1}</p> <p>{address.address2}</p>
          </div>
          <button onClick={() => setIsAddressModalOpen(true)}>
            <span className="text-xl">{">"}</span>
          </button>
        </div>
        {isAddressModalOpen && (
          <AddressModal
            onClose={() => setIsAddressModalOpen(false)}
            onAddressSelect={handleAddressSelect}
          />
        )}
      </div>

      <hr className="my-2" />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">배송기사 요청사항</p>
          <button onClick={() => setIsModalOpen(true)} className="text-blue-500">
            {requestMessage || "선택해주세요"}
          </button>
        </div>
        <button onClick={() => setIsModalOpen(true)}>
          <span className="text-sm text-blue-500">요청 선택 &gt;</span>
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

            {/* 타이틀 */}
            <h1 className="text-xl font-semibold">배송기사 요청사항을 <br/>선택해주세요</h1>

            {/* 선택 버튼 */}
            <div className="flex flex-col gap-[10px]">
              <Button
                className={`border border-black ${
                  foyerAccessType.type === "call"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleSelect("call")}
              >
                전화주시면 마중 나갈게요
              </Button>
              <Button
                className={`border border-black ${
                  foyerAccessType.type === "doorfront"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleSelect("doorfront")}
              >
                문 앞에 두면 가져갈게요
              </Button>
              <Button
                className={`border border-black ${
                  foyerAccessType.type === "gate"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => handleSelect("gate")}
              >
                공동현관으로 올라오세요
              </Button>
            </div>
                <div className="my-[-15px] flex flex-col gap-[10px]">


            {foyerAccessType.type === "gate" && (
              <div >
                <label className="mb-1 block text-base font-medium">공동현관 비밀번호</label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={e => setTempPassword(e.target.value)}
                  placeholder="#123123123123"
                  className="w-full rounded-md border border-gray-300 h-10 px-4 py-2 text-base"
                  />
              </div>
            )}
            {/* <Input label="추가 배송 요청사항" name="추가 배송 요청사항" type="text" value={requestMessage} onChange={e => setRequestMessage(e.target.value)} placeholder="배송 요청사항을 입력해주세요." className="w-full rounded-md border border-gray-300 px-4 text-base" /> */}
            </div>

            {/* 저장 버튼 */}
            <Button
              type="button"
              onClick={handleSave}
              className="w-full rounded-md bg-black  text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
