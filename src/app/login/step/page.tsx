"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Factory from "public/icons/factory";
import PaintBruchVertical from "public/icons/paintbrush_vertical";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
import Header from "@/components/Header/Header";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import Modal from "@/components/Modal/Modal";
import UnderlinedSelect from "@/components/Select/UnderlinedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useUserStore from "@/store/userStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import baseSchema, { PhoneFormData } from "@/utils/schema";

function LoginStepPage() {
  const { userType, user_phoneNumber, setUserType, setUserPhoneNumber } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(baseSchema),
    mode: "onChange",
  });

  const handleTypeSelect = (type: "" | "company" | "factory") => {
    if (type) {
      setUserType(type);
    }
    setIsUserTypeModalOpen(false); // 선택 시 모달 닫기
  };

  const handleStart = async () => {
    try {
      // userType을 백엔드 형식으로 변환
      const backendUserType = userType === "company" ? "INTERIOR" : "FACTORY";

      // 전화번호에서 하이픈 제거
      const cleanPhoneNumber = user_phoneNumber?.replace(/-/g, "") || "";

      const response = await fetch("http://localhost:3001/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_phone: cleanPhoneNumber,
          user_type: backendUserType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입에 실패했습니다.");
      }

      const result = await response.json();
      console.log("회원가입 성공:", result);

      // 회원가입 성공 후 홈으로 이동
      router.push("/");
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col gap-5 bg-white">
      <TopNavigator />
      <Header
        title={userType ? "입력한 정보를 확인해주세요" : "어떤 업체에서 오셨어요?"}
        size="Large"
      />
      <div className="px-5">
        <UnderlinedInput
          label={"휴대폰 번호"}
          type="tel"
          value={user_phoneNumber || ""}
          placeholder="휴대폰 번호"
          error={!!errors.user_phoneNumber}
          helperText={errors.user_phoneNumber?.message || ""}
          // required={true}
          onChange={value => {
            const formatted = formatPhoneNumber(value);
            setValue("user_phoneNumber", formatted, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
        {/* <Input
        label="휴대폰 번호"
        type="text"
        name="user_phoneNumber"
        value={user_phoneNumber || ""}
        onChange={e => setUserPhoneNumber(e.target.value)}
        placeholder="010-1234-5678"
        className="h-12 w-full text-2xl"
      /> */}
        <div className="pt-5">
          <UnderlinedSelect
            label={"업체 유형 선택"}
            options={[]}
            value={userType === "company" ? "인테리어 업체" : userType === "factory" ? "공장" : ""}
            onClick={() => setIsUserTypeModalOpen(true)}
            onChange={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
        <div className="">
          <BottomButton
            className="absolute bottom-0 left-0 right-0 mb-5"
            type="1button"
            button1Text="확인"
            button1Type="Brand"
            onButton1Click={() => setIsModalOpen(true)}
          />
        </div>

        {/* {userType && (
          <Button
            onClick={() => setIsModalOpen(true)}
            selected={true}
            className="absolute bottom-5 left-5 right-5"
          >
            확인
          </Button>
        )} */}
        <BottomSheet
          isOpen={isUserTypeModalOpen}
          title={"업체 유형을 선택해 주세요"}
          onClose={() => setIsUserTypeModalOpen(false)}
          children={
            <div className="flex gap-3 py-5">
              <CompanyTypeButton
                text={"인테리어 업체"}
                icon={<PaintBruchVertical />}
                onClick={() => handleTypeSelect("company")}
              />
              <CompanyTypeButton
                text={"자재 공장"}
                icon={<Factory />}
                onClick={() => handleTypeSelect("factory")}
              />
            </div>
          }
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-gray-800">
              바로가구 회원가입에 <br />꼭 필요한 동의만 추렸어요
            </h2>
            <div>
              <div className="text-sm text-gray-400">필수 동의 총 2개</div>

              <div className="border-1 ml-3 mt-2 flex flex-col gap-3 border-l-[4px] border-[#E2E2E2] pl-3">
                <div className="flex items-center justify-between">
                  <p>
                    <span className="font-semibold text-brand-500">필수 </span>
                    <span className="text-gray-700">서비스 이용 동의</span>
                  </p>
                  <Image
                    src="/icons/Arrow_Right.svg"
                    width={20}
                    alt="왼쪽 더보기 버튼"
                    height={20}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p>
                    <span className="font-semibold text-brand-500">필수 </span>
                    <span className="text-gray-700">개인정보 수집 및 이용 동의</span>
                  </p>
                  <Image
                    src="/icons/Arrow_Right.svg"
                    width={20}
                    alt="왼쪽 더보기 버튼"
                    height={20}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <BottomButton
                className=""
                type="1button"
                button1Text="모두 동의하고 회원가입"
                onButton1Click={handleStart}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default LoginStepPage;
