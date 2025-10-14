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
        <div className="flex h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white">
            {/* 메인 콘텐츠 */}
            <div className="flex flex-1 flex-col items-center justify-center px-8 gap-8">
                {/* 로고 영역 */}
                <div className="text-center mb-8">
                    <div className="mb-6">
                        <Image
                            src="/img/logo-192x192.png"
                            alt="로고"
                            width={80}
                            height={80}
                            className="mx-auto"
                        />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">
                        인테리어 자재를 쉽고 빠르게
                    </h1>
                    <p className="text-gray-600">
                        도어링과 함께 시작하세요
                    </p>
                </div>

                {/* 로그인 버튼 */}
                <div className="w-full max-w-sm">
                    <Image
                        src="/img/kakao_login_large_wide.png"
                        alt="카카오 로그인"
                        width={300}
                        height={50}
                        className="cursor-pointer mx-auto"
                        onClick={async () => {
                            try {
                                // 1. 초기화
                                useBizClientStore.setState({ bizClient: null });
                                useCartStore.setState({ cart: null });

                                // 2. 현재 유저 로그인 상태 확인
                                const { data: { user }, error } = await supabase.auth.getUser();
                                const bizClient = useBizClientStore.getState().bizClient;

                                if (!user && !bizClient) {
                                    // 3. 로그인도 안되어 있고 bizClient도 없는 경우 - 카카오 OAuth 시작
                                    console.log('📡 로그인도 안되어 있고 bizClient도 없음 - 카카오 OAuth 시작');

                                    // OAuth 시작 (uid로 bizClient 확인 후 분기처리를 위해 type=check로 설정)
                                    const kakaoAuthSupabaseRepository = new KakaoAuthSupabaseRepository();
                                    const kakaoResponse = await kakaoAuthSupabaseRepository.checkAndLogin();
                                    console.log('OAuth 시작 결과:', kakaoResponse);

                                    if (!kakaoResponse.success) {
                                        alert('일시적인 에러입니다. 다시 시도해주세요.');
                                    }
                                } else {
                                    // 4. 다른 경우들은 이미 useEffect에서 처리됨
                                    console.log('📡 이미 로그인 상태이거나 bizClient가 존재함');
                                    alert('이미 로그인된 상태입니다.');
                                }
                            } catch (error) {
                                console.error('카카오 로그인 처리 중 오류:', error);
                                alert('일시적인 에러입니다. 다시 시도해주세요.');
                            }
                        }}
                    />

                    <p className="mt-4 text-center text-sm text-gray-500">
                        카카오 계정으로 간편하게 로그인하세요
                    </p>
                </div>

                {/* 구분선 */}
                <div className="w-full max-w-sm flex items-center">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">또는</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div>
                    전화주문
                </div>

            </div>

            {/* 하단 안내 텍스트 */}
            <div className="px-8 pb-8">
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
            <LoginPageContent />
        </Suspense>
    );
}

export default LoginPage;