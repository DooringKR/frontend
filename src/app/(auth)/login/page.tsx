"use client";

import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
function LoginPage() {
    const router = useRouter();

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
                        로그인 시 서비스 이용약관 및 개인정보처리방침에
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