"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

import useUserStore from "@/store/userStore";

function LoginStepPage() {
  const { userType, user_phoneNumber, setUserType, setUserPhoneNumber } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();

  const handleTypeSelect = (type: "company" | "factory") => {
    setUserType(type);
    setIsUserTypeModalOpen(false); // 선택 시 모달 닫기
  };

  const toggleAgreement = () => {
    setIsAgreed(prev => !prev);
  };

  const handleStart = async () => {
    // const response = await fetch("/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ phoneNumber: user_phoneNumber, userType }),
    // });
    // const result = await response.json();
    console.log("백엔드 응답");
    router.push("/");
  };

  return (
    <div className="relative flex h-screen w-full flex-col gap-5 bg-white p-5">
      <h1 className="text-2xl font-semibold leading-[1.2] text-black">어떤 업체에서 오셨어요?</h1>
      <Input
        label="휴대폰 번호"
        type="text"
        name="user_phoneNumber"
        value={user_phoneNumber || ""}
        onChange={e => setUserPhoneNumber(e.target.value)}
        placeholder="010-1234-5678"
        className="h-12 w-full text-2xl"
      />
      <ModalButton
        label="업체 유형 선택"
        value={userType === "company" ? "인테리어 업체" : userType === "factory" ? "공장" : ""}
        placeholder="업체 유형을 선택해 주세요"
        onClick={() => setIsUserTypeModalOpen(true)}
        className="text-2xl"
      />{" "}
      {userType && (
        <Button
          onClick={() => setIsModalOpen(true)}
          selected={true}
          className="absolute bottom-5 left-5 right-5"
        >
          확인
        </Button>
      )}
      <Modal isOpen={isUserTypeModalOpen} onClose={() => setIsUserTypeModalOpen(false)}>
        <div>
          <h2 className="pb-5 pt-2 text-xl font-bold">업체 유형을 선택해주세요</h2>
          <div className="flex w-full gap-3">
            <Button
              type="button"
              onClick={() => handleTypeSelect("company")}
              selected={userType === "company"}
              className="flex h-[100px] w-full flex-col items-center justify-center gap-3 border"
            >
              <Image
                src={userType === "company" ? "/icons/company.svg" : "/icons/company_disabled.svg"}
                width={40}
                height={40}
                alt="인테리어 업체"
              />
              인테리어 업체
            </Button>
            <Button
              type="button"
              onClick={() => handleTypeSelect("factory")}
              selected={userType === "factory"}
              className="flex h-[100px] w-full flex-col items-center justify-center gap-3 border"
            >
              <Image
                src={userType === "factory" ? "/icons/factory.svg" : "/icons/factory_disabled.svg"}
                width={40}
                height={40}
                alt="공장"
              />
              공장
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-bold text-gray-800">
            바로가구 회원가입에 <br />꼭 필요한 동의만 추렸어요
          </h2>
          <div>
            <div className="text-sm text-gray-400">필수 동의 총 2개</div>

            <div className="border-1 ml-3 mt-2 flex flex-col gap-3 border-l border-[#E2E2E2] pl-3">
              <div className="flex items-center justify-between">
                <p>
                  <span className="font-semibold text-brand-500">필수</span>{" "}
                  <span className="text-gray-700">서비스 이용 동의</span>
                </p>
                <Image src="/icons/Arrow_Right.svg" width={20} alt="왼쪽 더보기 버튼" height={20} />
              </div>
              <div className="flex items-center justify-between">
                <p>
                  <span className="font-semibold text-brand-500">필수</span>{" "}
                  <span className="text-gray-700">개인정보 수집 및 이용 동의</span>
                </p>
                <Image src="/icons/Arrow_Right.svg" width={20} alt="왼쪽 더보기 버튼" height={20} />
              </div>
            </div>
          </div>
          <Button selected={true} type="button" onClick={handleStart}>
            모두 동의하고 회원가입
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginStepPage;
