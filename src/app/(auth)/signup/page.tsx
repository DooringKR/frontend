"use client";

import { Chip } from "@/components/Chip/Chip";
import Header from "@/components/Header/Header";
import { useState, useEffect, useRef } from "react";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import Button from "@/components/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import router from "next/router";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import useSignupStore from "@/store/signupStore";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import InitAmplitudeUnstable from "@/app/(client-helpers)/init-amplitude-unstable";
import { trackClick, trackView, trackClickAndWait } from "@/services/analytics/amplitude";
import { trackClickUnstable, trackViewUnstable, trackClickAndWaitUnstable } from "@/services/analytics/amplitude-unstable";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";

export default function SignupPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // 전화번호 숫자만 추출하여 길이 체크
    const getNumbersOnly = (phone: string) => phone.replace(/[^0-9]/g, '');
    const numbersOnly = getNumbersOnly(phoneNumber);
    const isValidLength = numbersOnly.length === 11;

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('signup');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 화면 진입 시 포커스, 11자리 입력 완료 시 포커스 해제
    useEffect(() => {
        // 화면 진입 시 포커스
        const timer = setTimeout(() => {
            if (phoneInputRef.current) {
                phoneInputRef.current.focus();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // 11자리 입력 완료 시 포커스 해제
    useEffect(() => {
        if (isValidLength && phoneInputRef.current) {
            phoneInputRef.current.blur();
        }
    }, [isValidLength]);
    const hasInput = phoneNumber.length > 0;

    // 에러 상태와 헬퍼 텍스트 결정
    const showError = hasInput && !isValidLength;
    const helperText = showError
        ? "휴대폰 번호 11자리를 모두 입력해주세요."
        : "";

    // 사업체 유형 선택 핸들러
    const handleBusinessTypeSelect = (type: BusinessType) => {
        setSelectedBusinessType(type);
        setIsBottomSheetOpen(false);
        console.log("선택된 사업체 유형:", type, "전화번호:", phoneNumber);
    };

    // 업체 유형 선택 버튼 클릭 핸들러
    const handleSelectBusinessType = () => {
        setIsBottomSheetOpen(true);
    };

    return (
        <div className="flex h-screen w-full flex-col justify-start bg-white">
            {/* Amplitude 초기화 (클라이언트 전용) */}
            <InitAmplitude />
            <div className="px-5 pt-5">
                <Chip text="가입을 위한 마지막 단계예요!" color="gray" />
            </div>
            <Header title={isValidLength ? "어떤 업체에서 오셨나요?" : "휴대폰 번호를 입력해주세요"} />
            <div className="px-5">
                <UnderlinedInput
                    ref={phoneInputRef}
                    label="휴대폰 번호"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    type="tel"
                    error={showError}
                    helperText={helperText}
                    onChange={setPhoneNumber}
                />
            </div>

            {/* 전화번호 11자리 입력 시 업체 유형 선택 버튼 표시 */}
            {isValidLength && (
                <div className="px-5 mt-8 gap-2 flex flex-col">
                    <BoxedSelect
                        default_label="업체 유형을 선택해주세요"
                        label="업체 유형"
                        // options={[
                        //     { value: BusinessType.INTERIOR, label: BusinessType.INTERIOR },
                        //     { value: BusinessType.FACTORY, label: BusinessType.FACTORY },
                        //     { value: BusinessType.CONSTRUCTION, label: BusinessType.CONSTRUCTION },
                        //     { value: BusinessType.INDIVIDUAL_SALES, label: BusinessType.INDIVIDUAL_SALES },
                        //     { value: BusinessType.ETC, label: BusinessType.ETC },
                        // ]}
                        value={selectedBusinessType ?? ""}
                        onClick={handleSelectBusinessType}
                    />
                </div>
            )}
            {isValidLength && selectedBusinessType && <div className="fixed bottom-0 w-full max-w-[460px]">
                <BottomButton type="1button" button1Text="확인" onButton1Click={async () => {
                    // Ensure the Click event is delivered before OAuth redirect (mobile/WebView safety)
                    await trackClickAndWait({
                        object_type: "button",
                        object_name: "confirm",
                        current_page: getScreenName() ?? 'signup',
                        modal_name: null,
                    });
                    useSignupStore.setState({ businessType: selectedBusinessType, phoneNumber: phoneNumber.replace(/-/g, '') });
                    const kakaoSignupUsecase = new KakaoSignupUsecase(
                        new KakaoAuthSupabaseRepository(),
                        new BizClientSupabaseRepository(),
                        new CartSupabaseRepository()
                    );
                    kakaoSignupUsecase.execute();
                }} />
            </div>}

            {/* 업체 유형 선택 BottomSheet */}
            <BottomSheet
                isOpen={isBottomSheetOpen}
                title="업체 유형을 선택해주세요"
                description="어떤 업체에서 오셨나요?"
                onClose={() => setIsBottomSheetOpen(false)}
                contentPadding="px-5 pb-5"
            >
                <div className="mt-4">
                    <SelectToggleButton
                        label={BusinessType.INTERIOR}
                        checked={selectedBusinessType === BusinessType.INTERIOR}
                        onClick={() => {
                            handleBusinessTypeSelect(BusinessType.INTERIOR);
                            trackClick({
                                object_type: "button",
                                object_name: "interior",
                                current_page: getScreenName() ?? 'signup',
                                modal_name: "business_type_selection",
                            });
                        }}
                    />
                    <SelectToggleButton
                        label={BusinessType.FACTORY}
                        checked={selectedBusinessType === BusinessType.FACTORY}
                        onClick={() => {
                            handleBusinessTypeSelect(BusinessType.FACTORY);
                            trackClick({
                                object_type: "button",
                                object_name: "factory",
                                current_page: getScreenName() ?? 'signup',
                                modal_name: "business_type_selection",
                            });
                        }}
                    />
                    <SelectToggleButton
                        label={BusinessType.CONSTRUCTION}
                        checked={selectedBusinessType === BusinessType.CONSTRUCTION}
                        onClick={() => {
                            handleBusinessTypeSelect(BusinessType.CONSTRUCTION);
                            trackClick({
                                object_type: "button",
                                object_name: "construction",
                                current_page: getScreenName() ?? 'signup',
                                modal_name: "business_type_selection",
                            });
                        }}
                    />
                    <SelectToggleButton
                        label={BusinessType.INDIVIDUAL_SALES}
                        checked={selectedBusinessType === BusinessType.INDIVIDUAL_SALES}
                        onClick={() => {
                            handleBusinessTypeSelect(BusinessType.INDIVIDUAL_SALES);
                            trackClick({
                                object_type: "button",
                                object_name: "individual_sales",
                                current_page: getScreenName() ?? 'signup',
                                modal_name: "business_type_selection",
                            });
                        }}
                    />
                    <SelectToggleButton
                        label={BusinessType.ETC}
                        checked={selectedBusinessType === BusinessType.ETC}
                        onClick={() => {
                            handleBusinessTypeSelect(BusinessType.ETC);
                            trackClick({
                                object_type: "button",
                                object_name: "etc",
                                current_page: getScreenName() ?? 'signup',
                                modal_name: "business_type_selection",
                            });
                        }}
                    />
                </div>
            </BottomSheet>
        </div>
    );
}
