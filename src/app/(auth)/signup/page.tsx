"use client";

import { Chip } from "@/components/Chip/Chip";
import Header from "@/components/Header/Header";
import { useState } from "react";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import Button from "@/components/Button/Button";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import BottomButton from "@/components/BottomButton/BottomButton";
import router from "next/router";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import useSignupStore from "@/store/signupStore";
export default function SignupPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);

    // 전화번호 숫자만 추출하여 길이 체크
    const getNumbersOnly = (phone: string) => phone.replace(/[^0-9]/g, '');
    const numbersOnly = getNumbersOnly(phoneNumber);
    const isValidLength = numbersOnly.length === 11;
    const hasInput = phoneNumber.length > 0;

    // 에러 상태와 헬퍼 텍스트 결정
    const showError = hasInput && !isValidLength;
    const helperText = showError
        ? "휴대폰 번호 11자리를 모두 입력해주세요."
        : "";

    // 사업체 유형 선택 핸들러
    const handleBusinessTypeSelect = (type: BusinessType) => {
        setSelectedBusinessType(type);
        // TODO: 회원가입 로직 실행
        console.log("선택된 사업체 유형:", type, "전화번호:", phoneNumber);
    };

    return (
        <div className="flex h-screen w-full flex-col justify-start bg-white">
            <div className="px-5 pt-5">
                <Chip text="가입을 위한 마지막 단계예요!" color="gray" />
            </div>
            <Header title={isValidLength ? "어떤 업체에서 오셨나요?" : "휴대폰 번호를 입력해주세요"} />
            <div className="px-5">
                <UnderlinedInput
                    label="휴대폰 번호"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    type="tel"
                    error={showError}
                    helperText={helperText}
                    onChange={setPhoneNumber}
                />
            </div>

            {/* 전화번호 11자리 입력 시 사업체 유형 선택 버튼 표시 */}
            {isValidLength && (
                <div className="px-5 mt-8 gap-2 flex flex-col">
                    <div className="text-gray-600 font-400 text-[14px]/[20px]">업체 유형</div>
                    <div className="flex gap-2">
                        <Button
                            type={selectedBusinessType === BusinessType.INTERIOR ? "BrandInverse" : "OutlinedLarge"}
                            text="인테리어 업체"
                            onClick={() => handleBusinessTypeSelect(BusinessType.INTERIOR)}
                        />
                        <Button
                            type={selectedBusinessType === BusinessType.FACTORY ? "BrandInverse" : "OutlinedLarge"}
                            text="가구 공장"
                            onClick={() => handleBusinessTypeSelect(BusinessType.FACTORY)}
                        />
                    </div>
                </div>
            )}
            {isValidLength && selectedBusinessType && <div className="fixed bottom-0 w-full max-w-[460px]">
                <BottomButton type="1button" button1Text="확인" onButton1Click={() => {
                    useSignupStore.setState({ businessType: selectedBusinessType, phoneNumber: phoneNumber.replace(/-/g, '') });
                    const kakaoSignupUsecase = new KakaoSignupUsecase(
                        new KakaoAuthSupabaseRepository(),
                        new BizClientSupabaseRepository(),
                        new CartSupabaseRepository()
                    );
                    kakaoSignupUsecase.execute();
                }} />
            </div>}
        </div>

    );
}


