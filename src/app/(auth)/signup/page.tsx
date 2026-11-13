"use client";

import Header from "@/components/Header/Header";
import { useState, useEffect, useRef } from "react";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import useSignupStore from "@/store/signupStore";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView, trackClickAndWait } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import { supabase } from "@/lib/supabase";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import PhoneInput from "@/components/form/PhoneInput";
import { useRequired } from "@/components/form/useRequired";
import BottomBar from "@/components/overlay/BottomBar";
import Notice from "@/components/state/Notice";
import { Loading } from "@/components/state/StateViews";

// 업체 유형 → 애널리틱스 object_name(예전 시트 줄과 같은 값)
const BUSINESS_TYPES: { value: BusinessType; track: string }[] = [
    { value: BusinessType.INTERIOR, track: "interior" },
    { value: BusinessType.FACTORY, track: "factory" },
    { value: BusinessType.CONSTRUCTION, track: "construction" },
    { value: BusinessType.INDIVIDUAL_SALES, track: "individual_sales" },
    { value: BusinessType.ETC, track: "etc" },
];

// 개인고객 링크
const INDIVIDUAL_CUSTOMER_LINK = "https://www.gaesudae.com/"; // 개수대연구소 링크

/**
 * 가입 마지막 단계 — 휴대폰 번호·업체 유형(기타면 개인고객 여부)을 받고 카카오 가입(OAuth type=signup)을 다시 시작한다.
 * 「확인」은 늘 눌리고, 빈 칸·틀린 칸은 누를 때 그 칸 밑에 알린다(예전엔 칸을 숨기고 버튼을 막았다).
 */
export default function SignupPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
    const [isLoadingPhoneNumber, setIsLoadingPhoneNumber] = useState(true);
    const [isIndividualCustomer, setIsIndividualCustomer] = useState<boolean | null>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const submit = useAction({ holdOnSuccess: true });

    const numbersOnly = phoneNumber.replace(/[^0-9]/g, '');
    const isValidLength = numbersOnly.length === 11;
    const isEtc = selectedBusinessType === BusinessType.ETC;

    // 화면 위 → 아래 순서
    const req = useRequired({
        phone: !numbersOnly ? false : isValidLength || "휴대폰 번호 11자리를 모두 입력해주세요.",
        businessType: !!selectedBusinessType,
        individual: !isEtc || (isIndividualCustomer === null ? false : !isIndividualCustomer || "개인고객은 위 링크로 이동해주세요."),
    });

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
                    return;
                }

                const kakaoToken = session.provider_token;
                if (!kakaoToken) {
                    console.log('카카오 토큰이 없습니다.');
                    return;
                }

                // 카카오 API 직접 호출
                const response = await fetch('https://kapi.kakao.com/v2/user/me', {
                    headers: { Authorization: `Bearer ${kakaoToken}` }
                });
                if (!response.ok) {
                    console.error('카카오 API 호출 실패:', response.status, response.statusText);
                    return;
                }

                const kakaoData = await response.json();
                const kakaoPhoneNumber = kakaoData.kakao_account?.phone_number;
                if (!kakaoPhoneNumber) {
                    console.log('⚠️ 카카오 계정에서 전화번호를 찾을 수 없습니다.');
                    return;
                }

                // 전화번호 형식 변환 (카카오는 +82-10-1234-5678 형식으로 올 수 있음) — 82로 시작하면 0으로
                let cleanPhoneNumber = kakaoPhoneNumber.replace(/[^0-9]/g, '');
                if (cleanPhoneNumber.startsWith('82')) {
                    cleanPhoneNumber = '0' + cleanPhoneNumber.slice(2);
                }
                setPhoneNumber(formatPhoneNumber(cleanPhoneNumber));
            } catch (error) {
                console.error('카카오 전화번호 가져오기 오류:', error);
            } finally {
                setIsLoadingPhoneNumber(false);
            }
        };

        fetchKakaoPhoneNumber();
    }, []);

    // 번호를 다 읽은 뒤 번호 칸에 포커스(카카오에서 못 받았으면 바로 입력하게)
    useEffect(() => {
        if (!isLoadingPhoneNumber && !phoneNumber) phoneInputRef.current?.focus();
        // 읽기 끝날 때 한 번만
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingPhoneNumber]);

    // 사업체 유형 선택 핸들러
    const handleBusinessTypeSelect = (type: BusinessType) => {
        setSelectedBusinessType(type);
        // '기타'가 아닌 경우 개인고객 체크 초기화
        if (type !== BusinessType.ETC) {
            setIsIndividualCustomer(null);
        }
        trackClick({
            object_type: "button",
            object_name: BUSINESS_TYPES.find((b) => b.value === type)?.track ?? null,
            current_page: getScreenName() ?? 'signup',
            modal_name: "business_type_selection",
        });
    };

    const handleConfirm = () => {
        if (!req.check()) return;
        submit.run(async () => {
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
            const result = await kakaoSignupUsecase.execute();
            if (!result.success) throw new Error("일시적인 에러입니다. 다시 시도해주세요.");
        });
    };

    return (
        <div className="flex min-h-screen w-full flex-col justify-start bg-white">
            {/* Amplitude 초기화 (클라이언트 전용) */}
            <InitAmplitude />
            <div className="px-5 pt-5">
                <Badge color="gray">가입을 위한 마지막 단계예요!</Badge>
            </div>
            <Header title={isValidLength ? "어떤 업체에서 오셨나요?" : "휴대폰 번호를 입력해주세요"} />
            <div className="flex flex-col gap-8 px-5 pt-5">
                <Field label="휴대폰 번호" required fieldRef={req.ref("phone")} error={req.error("phone")}>
                    {isLoadingPhoneNumber ? (
                        <Loading variant="inline" label="카카오에서 전화번호를 가져오는 중" className="h-[50px]" />
                    ) : (
                        <PhoneInput ref={phoneInputRef} aria-invalid={!!req.error("phone")} value={phoneNumber} onChange={setPhoneNumber} />
                    )}
                </Field>

                <Field label="업체 유형" required fieldRef={req.ref("businessType")} error={req.error("businessType")}>
                    <Choose
                        aria-label="업체 유형"
                        options={BUSINESS_TYPES.map((b) => ({ value: b.value, label: b.value }))}
                        value={selectedBusinessType}
                        onChange={handleBusinessTypeSelect}
                    />
                </Field>

                {/* 기타 선택 시 개인고객 여부 */}
                {isEtc && (
                    <Field label="개인고객이신가요?" required fieldRef={req.ref("individual")} error={req.error("individual")}>
                        <Choose
                            aria-label="개인고객이신가요?"
                            options={[
                                { value: "yes", label: "네, 개인고객이에요" },
                                { value: "no", label: "아니에요" },
                            ]}
                            value={isIndividualCustomer === null ? null : isIndividualCustomer ? "yes" : "no"}
                            onChange={(v) => setIsIndividualCustomer(v === "yes")}
                        />
                        {isIndividualCustomer === true && (
                            <>
                                <Notice tone="gray">
                                    가구 제작, 도면상담, 인테리어 문의 등을 희망하는 개인 고객이시라면 아래 링크로 이동해주세요.
                                </Notice>
                                <Button asChild variant="inverse" className="w-full">
                                    <a href={INDIVIDUAL_CUSTOMER_LINK} target="_blank" rel="noopener noreferrer">
                                        개수대연구소로 이동
                                    </a>
                                </Button>
                            </>
                        )}
                    </Field>
                )}
            </div>
            <div className="h-[120px]" />

            <BottomBar top={<ActionError error={submit.error} className="mb-3" />}>
                <Button busy={submit.busy} onClick={handleConfirm}>
                    확인
                </Button>
            </BottomBar>
        </div>
    );
}
