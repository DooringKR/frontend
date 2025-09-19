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
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useCartStore from "@/store/cartStore";
import useBizClientStore from "@/store/bizClientStore";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";

function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginError = searchParams.get('error');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push('/');
            } else {
                router.push('/login');
            }
        });
    }, [router]);

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
                const { data: { user }, error } = await supabase.auth.getUser();

                console.log("User check result:", { user, error });
                console.log("login page");

                console.log('✅ 세션 확인됨, 사용자 정보 조회 시작');


                // 유저가 로그인되어 있으면 홈으로 리다이렉트
                if (user && !error) {
                    console.log('12312312312312312');
                    const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
                    const bizClient = await readBizClientUsecase.execute(user!.id);
                    const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
                    const cart = await readCartUsecase.findById(user!.id)!;
                    console.log('📡 API 응답:', bizClient);
                    console.log('456456456456456456');
                    console.log('📡 API 응답cart:', cart);

                    if (bizClient.success && bizClient.data) {
                        useBizClientStore.setState({ bizClient: bizClient.data });
                        useCartStore.setState({ cart: cart! });
                        router.push(`/`);
                    } else {
                        router.push('/login?error=user_not_found');
                    }
                    console.log("User is already logged in, redirecting to home");
                    router.push('/');
                    return;
                }

                // 에러가 있거나 유저가 없으면 로그인 페이지 유지
                console.log("User not logged in, staying on login page");
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
                        onClick={() => {
                            kakaoSignupUsecase.execute();
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

                {/* 회원가입 버튼 */}
                <div className="w-full max-w-sm">
                    <button
                        onClick={() => {
                            router.push('/kakao-login');
                        }}
                        className="w-full py-4 px-6 text-blue-600 font-medium"
                    >
                        새 계정으로 회원가입
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        아직 계정이 없으신가요?
                    </p>
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

export default LoginPage;