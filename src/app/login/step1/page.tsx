"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";

import useUserStore from "@/store/userStore";

export default function LoginStep1Page() {
  const { userType, user_phoneNumber, setUserType, setUserPhoneNumber } = useUserStore();

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);

  const handleTypeSelect = (type: "company" | "factory") => {
    setUserType(type); // ✅ zustand로 저장
  };

  const openTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const handleAgreeChange = () => {
    setAgreeAll(prev => !prev);
  };

  const canSubmit = userType && user_phoneNumber && agreeAll;

  return (
    <div className="relative flex h-screen w-full flex-col bg-white p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold leading-tight">
          반가워요, <br /> 어떤 업체이신가요?
        </h1>
          <p className="text-base text-neutral-700">업체 유형</p>
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

          {/* 휴대폰 번호 입력 */}
          <div className="space-y-2">
            <label className="text-base font-medium text-neutral-800">휴대폰 번호</label>
            <input
              type="text"
              value={user_phoneNumber || ""}
              onChange={e => setUserPhoneNumber(e.target.value)} // ✅ zustand로 저장
              placeholder="010-1234-5678"
              className="h-12 w-full rounded-md border border-neutral-300 px-4 text-black"
            />
          </div>
        <div className="mt-10">
          <button
            type="button"
            onClick={openTermsModal}
            className="h-12 w-full rounded-md bg-black text-white"
          >
            약관 동의하고 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
