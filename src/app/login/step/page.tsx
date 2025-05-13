"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

import useUserStore from "@/store/userStore";

function LoginStepPage() {
  const { userType, user_phoneNumber, setUserType, setUserPhoneNumber } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  const handleTypeSelect = (type: "company" | "factory") => {
    setUserType(type);
    setIsModalOpen(true);
  };

  const toggleAgreement = () => {
    setIsAgreed(prev => !prev);
  };

  const handleStart = async () => {
    // const response = await fetch("/api/register", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     phoneNumber: user_phoneNumber,
    //     userType: userType,
    //   }),
    // });
    // const result = await response.json();
    console.log("백엔드 응답");
    router.push("/");
  };

  return (
    <div className="relative flex h-screen w-full flex-col gap-5 bg-white p-5">
      <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
        어떤 업체에서 오셨어요?
      </h1>
      <div className="flex flex-col gap-3">
        <Input
          label="휴대폰 번호"
          type="text"
          name="user_phoneNumber"
          value={user_phoneNumber || ""}
          onChange={e => setUserPhoneNumber(e.target.value)}
          placeholder="010-1234-5678"
          className="h-12 w-full"
        />
        <p className="text-sm leading-[1.4] text-gray-400">업체 유형 선택</p>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => handleTypeSelect("company")}
            className={`h-10 flex-1 rounded-md border transition ${
              userType === "company"
                ? "bg-black text-white"
                : "border-[#767676] bg-[#e3e3e3] text-black"
            }`}
          >
            인테리어 업체
          </Button>
          <Button
            type="button"
            onClick={() => handleTypeSelect("factory")}
            className={`h-10 flex-1 rounded-md border transition ${
              userType === "factory"
                ? "bg-black text-white"
                : "border-[#767676] bg-[#e3e3e3] text-neutral-700"
            }`}
          >
            공장
          </Button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex justify-between">
          <span className="flex items-center">
            <input
              type="checkbox"
              className="mr-3 h-4 w-4"
              checked={isAgreed}
              onChange={toggleAgreement}
            />
            <h2 className="text-base font-semibold">약관 전체 동의</h2>
          </span>
          <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
            닫기
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="pl-7 text-base text-[#757575]"> - 약관 1</p>
          <p className="pl-7 text-base text-[#757575]"> - 약관 2</p>
        </div>
        <div>
          <Button
            type="button"
            className={`w-full rounded-md ${isAgreed ? "bg-black" : "bg-[#e3e3e3]"} mt-5 text-white`}
            onClick={handleStart}
            disabled={!isAgreed}
          >
            모두 동의하고 시작하기
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginStepPage;
