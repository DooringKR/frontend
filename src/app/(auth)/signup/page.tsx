"use client";

import { Chip } from "@/components/Chip/Chip";
import Header from "@/components/Header/Header";
import { useState, useEffect, useRef } from "react";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import Button from "@/components/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Checkbox from "@/components/Checkbox";
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
import { supabase } from "@/lib/supabase";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

export default function SignupPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isLoadingPhoneNumber, setIsLoadingPhoneNumber] = useState(true);
    const [isIndividualCustomer, setIsIndividualCustomer] = useState<boolean | null>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const businessTypeSelectRef = useRef<HTMLButtonElement>(null);

    // 개인고객 링크 (사용자가 나중에 채워넣을 수 있도록 빈 문자열)
    const INDIVIDUAL_CUSTOMER_LINK = "https://www.gaesudae.com/"; // 개수대연구소 링크

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

    // 카카오 API로 전화번호 가져오기
    useEffect(() => {
        const fetchKakaoPhoneNumber = async () => {
            try {
                setIsLoadingPhoneNumber(true);
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    console.log('세션이 없습니다.');
                    setIsLoadingPhoneNumber(false);
                    return;
                }

                const kakaoToken = session.provider_token;

                if (kakaoToken) {
                    // 카카오 API 직접 호출
                    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
                        headers: { Authorization: `Bearer ${kakaoToken}` }
                    });

                    if (!response.ok) {
                        console.error('카카오 API 호출 실패:', response.status, response.statusText);
                        setIsLoadingPhoneNumber(false);
                        return;
                    }

                    const kakaoData = await response.json();
                    const kakaoPhoneNumber = kakaoData.kakao_account?.phone_number;

                    console.log('카카오에서 받은 전화번호:', kakaoPhoneNumber);

                    if (kakaoPhoneNumber) {
                        console.log('🔍 원본 카카오 전화번호:', kakaoPhoneNumber);

                        // 전화번호 형식 변환 (카카오는 +82-10-1234-5678 형식으로 올 수 있음)
                        let cleanPhoneNumber = kakaoPhoneNumber.replace(/[^0-9]/g, '');
                        console.log('🔍 숫자만 추출:', cleanPhoneNumber);

                        // 82로 시작하면 0으로 변환
                        if (cleanPhoneNumber.startsWith('82')) {
                            cleanPhoneNumber = '0' + cleanPhoneNumber.slice(2);
                        }
                        console.log('🔍 82 제거 후:', cleanPhoneNumber);

                        // 전화번호를 상태에 설정 (자동 포맷팅)
                        const formatted = formatPhoneNumber(cleanPhoneNumber);
                        console.log('🔍 포맷팅된 전화번호:', formatted);
                        console.log('🔍 phoneNumber 상태 업데이트 전:', phoneNumber);

                        setPhoneNumber(formatted);

                        // 상태 업데이트 확인을 위한 추가 로그
                        setTimeout(() => {
                            console.log('🔍 phoneNumber 상태 업데이트 후:', phoneNumber);
                        }, 100);
                    } else {
                        console.log('⚠️ 카카오 계정에서 전화번호를 찾을 수 없습니다.');
                    }
                } else {
                    console.log('카카오 토큰이 없습니다.');
                }
            } catch (error) {
                console.error('카카오 전화번호 가져오기 오류:', error);
            } finally {
                setIsLoadingPhoneNumber(false);
            }
        };

        fetchKakaoPhoneNumber();
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

    // 11자리 입력 완료 시 포커스 해제 및 업체 유형 선택으로 포커스 이동
    useEffect(() => {
        if (isValidLength) {
            // 전화번호 입력 필드 포커스 해제
            if (phoneInputRef.current) {
                phoneInputRef.current.blur();
            }

            // 업체 유형 선택 버튼으로 포커스 이동
            // 약간의 지연을 두어 DOM 업데이트 후 포커스 이동
            const timer = setTimeout(() => {
                if (businessTypeSelectRef.current) {
                    businessTypeSelectRef.current.focus();
                }
            }, 100);

            return () => clearTimeout(timer);
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
        // '기타'가 아닌 경우 개인고객 체크 초기화
        if (type !== BusinessType.ETC) {
            setIsIndividualCustomer(null);
        }
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
                    placeholder={isLoadingPhoneNumber ? "카카오에서 전화번호를 가져오는 중..." : "010-1234-5678"}
                    value={phoneNumber}
                    type="tel"
                    error={showError}
                    helperText={helperText}
                    onChange={setPhoneNumber}
                    disabled={isLoadingPhoneNumber || (phoneNumber.length > 0 && isValidLength)}
                />
            </div>

            {/* 전화번호 11자리 입력 시 업체 유형 선택 버튼 표시 */}
            {isValidLength && (
                <div className="px-5 mt-8 gap-2 flex flex-col">
                    <BoxedSelect
                        ref={businessTypeSelectRef}
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
            {/* 기타 선택 시 개인고객 여부 체크 */}
            {isValidLength && selectedBusinessType === BusinessType.ETC && (
                <div className="px-5 mt-4">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-3 text-[16px] font-600 text-gray-800">개인고객이신가요?</div>
                        <div className="flex items-center gap-4">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsIndividualCustomer(true)}
                            >
                                <Checkbox
                                    checked={isIndividualCustomer === true}
                                    onChange={(checked) => {
                                        setIsIndividualCustomer(checked ? true : null);
                                    }}
                                />
                                <div className="text-[14px] font-400 text-gray-700">네, 개인고객이에요</div>
                            </div>
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsIndividualCustomer(false)}
                            >
                                <Checkbox
                                    checked={isIndividualCustomer === false}
                                    onChange={(checked) => {
                                        setIsIndividualCustomer(checked ? false : null);
                                    }}
                                />
                                <div className="text-[14px] font-400 text-gray-700">아니에요</div>
                            </div>
                        </div>
                        {isIndividualCustomer === true && INDIVIDUAL_CUSTOMER_LINK && (
                            <>
                                <div className="mt-3 mb-3 text-[14px] font-400 text-gray-600">
                                    가구 제작, 도면상담, 인테리어 문의 등을 희망하는 개인 고객이시라면 아래 링크로 이동해주세요.
                                </div>
                                <Button
                                    type="BrandInverse"
                                    text="개수대연구소로 이동"
                                    onClick={() => {
                                        window.open(INDIVIDUAL_CUSTOMER_LINK, '_blank');
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {isValidLength && selectedBusinessType && (
                <div className="fixed bottom-0 w-full max-w-[460px]">
                    <BottomButton
                        type="1button"
                        button1Text="확인"
                        button1Disabled={
                            selectedBusinessType === BusinessType.ETC &&
                            (isIndividualCustomer === true || isIndividualCustomer === null)
                        }
                        onButton1Click={async () => {
                            // 개인고객이거나 선택하지 않은 경우 진행 차단
                            if (selectedBusinessType === BusinessType.ETC &&
                                (isIndividualCustomer === true || isIndividualCustomer === null)) {
                                return;
                            }

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
                        }}
                    />
                </div>
            )}

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
