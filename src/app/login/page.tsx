"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/Input/Input";

import useUserStore from "@/store/userStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import handlePhoneKeyDown from "@/utils/handlePhoneKeyDown";
import baseSchema, { PhoneFormData } from "@/utils/schema";
import { signin } from "@/api/authApi";

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

  // const onSubmit = async (data: PhoneFormData) => {
  //   try {
  //     const result = await signin({
  //       phoneNumber: data.user_phoneNumber,
  //     });
  
  //     if (result.isRegistered) {
  //       router.push("/");
  //     } else {
  //       setUserPhoneNumber(data.user_phoneNumber);
  //       router.push("/login/step");
  //     }
  //   } catch (error) {
  //     console.error("로그인 요청 실패:", error);
  //     alert("로그인 중 오류가 발생했습니다.");
  //   }
  // };

  const onSubmit = (data: PhoneFormData) => {
    const fakeToken = "temporary-token-1234";
    document.cookie = `token=${fakeToken}; path=/; max-age=3600`;
    if (true) {
      setUserPhoneNumber(data.user_phoneNumber);
      router.push("/login/step");
    } else {
      router.push("/");
    }
  };

  const phoneRegister = register("user_phoneNumber");

  const watchedPhoneNumber = watch("user_phoneNumber");
  const isPhoneEntered = !!watchedPhoneNumber?.trim();

  return (
    <div className="flex h-screen w-full flex-col justify-center gap-6 bg-white px-5">
      <Image src="/img/Logo.png" alt="도어링 메인 로고" width={60} height={60} />
      <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
        휴대폰번호로 <br /> 바로가구 시작하기
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[272px] space-y-6">
        <Input
          type="text"
          label="휴대폰 번호"
          name="user_phoneNumber"
          placeholder="휴대폰 번호를 입력해주세요"
          register={phoneRegister}
          error={errors.user_phoneNumber}
          onChange={e => {
            const formatted = formatPhoneNumber(e.target.value);
            setValue("user_phoneNumber", formatted, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          onKeyDown={handlePhoneKeyDown}
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
