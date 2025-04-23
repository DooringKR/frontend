"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/Input/Input";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import handlePhoneKeyDown from "@/utils/handlePhoneKeyDown";
import baseSchema, { PhoneFormData } from "@/utils/schema";

export default function PhoneLoginPage() {
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
    mode: "onBlur",
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (data: PhoneFormData) => {
    console.log("전송된 데이터:", data);

    const fakeToken = "temporary-token-1234";
    document.cookie = `token=${fakeToken}; path=/; max-age=3600`;
    router.push("/");
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "user_phoneNumber" && typeof value.user_phoneNumber === "string") {
        const formatted = formatPhoneNumber(value.user_phoneNumber);

        if (formatted !== value.user_phoneNumber) {
          setValue("user_phoneNumber", formatted, {
            shouldValidate: false,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const phoneRegister = register("user_phoneNumber");

  const watchedPhoneNumber = watch("user_phoneNumber");
  const isPhoneEntered = !!watchedPhoneNumber?.trim();

  return (
    <div className="flex h-screen w-full flex-col justify-center gap-6 bg-white px-5">
      <Image src="/img/Logo.png" alt="도어링 메인 로고" width={60} height={60} />
      <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
        휴대폰번호로 <br /> 도어링 시작하기
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[272px] space-y-6">
        <Input
          type="text"
          label="휴대폰 번호"
          name="user_phoneNumber"
          placeholder="휴대폰 번호를 입력해주세요"
          register={{
            ...phoneRegister,
            ref: el => {
              phoneRegister.ref(el);
              inputRef.current = el;
            },
          }}
          error={errors.user_phoneNumber}
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
