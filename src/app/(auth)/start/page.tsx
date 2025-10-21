"use client";

import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import Image from "next/image";
import Header from "@/components/Header/Header";
import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
import PaintBruchVertical from "public/icons/paintbrush_vertical";
import Factory from "public/icons/factory";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import useSignupStore from "@/store/signupStore";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useCartStore from "@/store/cartStore";
import useBizClientStore from "@/store/bizClientStore";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
import Button from "@/components/Button/Button";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView, trackClick } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginError = searchParams.get('error');

    const [isLoading, setIsLoading] = useState(true);

    const kakaoSignupUsecase = new KakaoSignupUsecase(
        new KakaoAuthSupabaseRepository(),
        new BizClientSupabaseRepository(),
        new CartSupabaseRepository()
    );

    useEffect(() => {
        // 유저 정보 확인 및 리다이렉트 처리
        const checkUserAndRedirect = async () => {
            try {
                if (loginError === 'user_not_found') {
                    return;
                }
                // 1. 유저 로그인 여부 확인
                const { data: { user }, error } = await supabase.auth.getUser();
                const bizClient = useBizClientStore.getState().bizClient;

                if (user && bizClient) {
                    console.log('📡 유저 로그인 되어있음');
                    router.push(`/`);
                    return;
                } else if (user && !bizClient) {
                    // 1. 유저는 로그인되어 있지만 bizClient가 없는 경우 - 로그아웃 처리
                    console.log('📡 로그인된 유저가 있지만 bizClient가 없음 - 로그아웃 처리');
                    await supabase.auth.signOut();
                    useBizClientStore.setState({ bizClient: null });
                    useCartStore.setState({ cart: null });
                } else {
                    // 2. 유저가 로그인되어 있지 않은 경우 - 로그인 대기 상태
                    console.log('📡 유저 로그인되어 있지 않음 - 로그인 대기');
                }
            } catch (err) {
                console.error("Error checking user:", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAndRedirect();
    }, [router]);

    // 현재 화면명을 마운트 시 1회 설정 (이전 화면명은 보존됨)
    useEffect(() => {
        setScreenName('start');
    }, []);

    // 페이지 진입 View 이벤트 트래킹 (로딩 완료 시 전송)
    useEffect(() => {
        if (!isLoading) {
            try {
                const prev = getPreviousScreenName();
                trackView({
                    object_type: "screen",
                    object_name: null,
                    current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
                    previous_screen: prev,
                });
            } catch (e) {
                // no-op
            }
        }
    }, [isLoading]);

    // 로딩 중일 때는 로딩 화면 표시
    if (isLoading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center">
                    <Image
                        src="/img/logo-192x192.png"
                        alt="로고"
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                    />
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col">
            {/* 메인 콘텐츠: 로고, 버튼, 구분선, 전화주문 */}
            <div className="flex flex-col items-center justify-center px-8 pt-8 gap-[40px]">
                {/* 로고 영역 */}
                <div className="text-center gap-5">
                    <div className="mb-6">
                        <Image
                            src="/img/start-page-image.png"
                            alt="로고"
                            width={window.innerWidth}
                            height={window.innerHeight}
                            className="mx-auto"
                        />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">
                        급하게 가구가 <br />
                        필요한 모든 순간
                    </h1>
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="89" height="24" viewBox="0 0 89 24" fill="none">
                            <g clip-path="url(#clip0_2964_13319)">
                                <path d="M83.8723 1.79692V1.42769H69.9155V4.48H80.3387C80.3096 4.95723 80.2341 5.71024 80.1088 6.74968L80.1085 6.75184L80.1083 6.75403C79.9621 8.10195 79.7264 9.54181 79.4003 11.0739L79.3056 11.52H82.8211L82.8805 11.2232C83.1451 9.89984 83.3763 8.43835 83.5741 6.83917C83.7731 5.23115 83.8723 3.55029 83.8723 1.79692Z" fill="#99A1AF" />
                                <path d="M78.7523 14.8923H88.5V11.8154H66.1493V14.8923H75.2816V24H78.7523V14.8923Z" fill="#99A1AF" />
                                <path d="M56.1381 3.4736L56.1981 3.05232H45.0651V6.10461H52.2085C51.2237 9.37309 48.8315 12.6034 44.9773 15.7893L44.6355 16.072L47.1781 18.2015L47.4144 18.0099C52.4155 13.9559 55.3355 9.10896 56.1381 3.4736Z" fill="#99A1AF" />
                                <path d="M66.1493 8.02461H62.26V0H58.8384V23.5569H62.26V11.2H66.1493V8.02461Z" fill="#99A1AF" />
                                <path d="M29.5955 10.2646H39.1216V2.11692H26.0262V5.12H35.6507V7.26155H26.1246V15.5569H31.0968V17.7477H21.62V20.8246H43.9707V17.7477H34.5923V15.5569H39.5893V12.5538H29.5955V10.2646Z" fill="#99A1AF" />
                                <path d="M17.9523 7.95077H21.8415V11.1262H17.9523V23.5569H14.5308V0H17.9523V7.95077ZM3.87232 7.43384H8.59845V2.88H11.9708V16.7877H0.5V2.88H3.87232V7.43384ZM3.87232 10.4615V13.7354H8.59845V10.4615H3.87232Z" fill="#99A1AF" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2964_13319">
                                    <rect width="88" height="24" fill="white" transform="translate(0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* 로그인 버튼 */}
                <div className="flex flex-col gap-4">
                    <Image
                        src="/img/kakao_login_large_wide.png"
                        alt="카카오 로그인"
                        width={300}
                        height={50}
                        className="cursor-pointer mx-auto"
                        onClick={async () => {
                            // Track click on Kakao login button
                            trackClick({
                                object_type: "button",
                                object_name: "kakao",
                                current_page: getScreenName() ?? 'start',
                                modal_name: null,
                            });
                            
                            try {
                                
                                // 1. 초기화
                                // useBizClientStore.setState({ bizClient: null });
                                // useCartStore.setState({ cart: null });

                                // 2. 현재 유저 로그인 상태 확인
                                // const { data: { user }, error } = await supabase.auth.getUser();
                                // const bizClient = useBizClientStore.getState().bizClient;

                                // if (!user && !bizClient) {
                                // 3. 로그인도 안되어 있고 bizClient도 없는 경우 - 카카오 OAuth 시작
                                // console.log('📡 로그인도 안되어 있고 bizClient도 없음 - 카카오 OAuth 시작');

                                // OAuth 시작 (uid로 bizClient 확인 후 분기처리를 위해 type=check로 설정)
                                const kakaoAuthSupabaseRepository = new KakaoAuthSupabaseRepository();
                                const kakaoResponse = await kakaoAuthSupabaseRepository.checkAndLogin();
                                console.log('OAuth 시작 결과:', kakaoResponse);

                                if (!kakaoResponse.success) {
                                    alert('일시적인 에러입니다. 다시 시도해주세요.');
                                }
                                // } else {
                                // 4. 다른 경우들은 이미 useEffect에서 처리됨
                                // console.log('📡 이미 로그인 상태이거나 bizClient가 존재함');
                                // alert('이미 로그인된 상태입니다.');
                                // }
                            } catch (error) {
                                console.error('카카오 로그인 처리 중 오류:', error);
                                alert('일시적인 에러입니다. 다시 시도해주세요.');
                            }
                        }}
                    />
                    <Button
                        type={"OutlinedMedium"}
                        text={"전화주문"}
                        className="w-[300px] h-[40px]"
                        onClick={() => {
                            trackClick({
                                object_type: "button",
                                object_name: "phone",
                                current_page: getScreenName() ?? 'start',
                                modal_name: null,
                            });
                            window.open("tel:010-9440-1874", "_blank");
                        }} />
                </div>
                <div className="text-center text-m text-black-400"> 고객센터 전화번호 : 031-528-4002
                </div>
                
            </div>

            {/* 하단 안내 텍스트 */}
            <div className="px-8 pb-8 fixed bottom-0 w-full max-w-[460px]">
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        로그인 시{" "}
                        <span
                            className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                            onClick={() => window.open("https://dooring.notion.site/terms-of-use", "_blank")}
                        >
                            서비스 이용약관
                        </span>
                        {" "}및{" "}
                        <span
                            className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                            onClick={() => window.open("https://dooring.notion.site/privacy", "_blank")}
                        >
                            개인정보처리방침
                        </span>
                        에
                    </p>
                    <p className="text-xs text-gray-400">
                        동의하는 것으로 간주됩니다
                    </p>
                </div>
            </div>
        </div>
    );
}

function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center">
                    <Image
                        src="/img/logo-192x192.png"
                        alt="로고"
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                    />
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        }>
            {/* Amplitude 초기화 (클라이언트 전용) */}
            <InitAmplitude />
            <LoginPageContent />
        </Suspense>
    );
}

export default LoginPage;