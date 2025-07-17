"use client";

import { checkPhoneDuplicate, signin } from "@/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useUserStore from "@/store/userStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import handlePhoneKeyDown from "@/utils/handlePhoneKeyDown";
import baseSchema, { PhoneFormData } from "@/utils/schema";

function PhoneLoginPage() {
  const router = useRouter();
  const { setUserPhoneNumber } = useUserStore();
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (data: PhoneFormData) => {
    try {
      // 전화번호 중복 확인
      const isDuplicate = await checkPhoneDuplicate(data.user_phoneNumber);

      if (isDuplicate) {
        console.log("중복됨");
        // 기존 사용자 - 로그인 처리
        // const result = await signin({
        //   phoneNumber: data.user_phoneNumber,
        // });
        // if (result.isRegistered) {
        //   router.push("/");
      } else {
        console.log("중복아님");
        setUserPhoneNumber(data.user_phoneNumber);
        router.push("/login/step");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const phoneRegister = register("user_phoneNumber");

  const watchedPhoneNumber = watch("user_phoneNumber");
  const isPhoneEntered = !!watchedPhoneNumber?.trim();

  return (
    <div className="flex h-screen w-full flex-col justify-start gap-6 bg-white px-5">
      {/* <Image src="/img/Logo.png" alt="도어링 메인 로고" width={60} height={60} /> */}
      <TopNavigator title="테스트" />
      <Header title="휴대폰 번호를 입력해주세요" size="Large" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 px-5">
        <UnderlinedInput
          label="휴대폰 번호"
          value={watchedPhoneNumber || ""}
          placeholder="휴대폰 번호"
          error={!!errors.user_phoneNumber}
          helperText={errors.user_phoneNumber?.message || ""}
          onChange={value => {
            const formatted = formatPhoneNumber(value);
            setValue("user_phoneNumber", formatted, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />

        <button
          type="submit"
          className={`w-full rounded-md bg-black py-3 text-white transition-opacity duration-200 ${
            isPhoneEntered ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          시작하기
        </button>
      </form>
    </div>
  );
}

export default PhoneLoginPage;
