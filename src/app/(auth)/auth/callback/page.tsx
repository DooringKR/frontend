// src/app/(auth)/auth/callback/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { KakaoAuthSupabaseRepository } from '@/DDD/data/service/kakao_auth_supabase_repository';
import { BizClientSupabaseRepository } from '@/DDD/data/db/User/bizclient_supabase_repository';
import { CartSupabaseRepository } from '@/DDD/data/db/CartNOrder/cart_supabase_repository';
import { KakaoSignupUsecase } from '@/DDD/usecase/auth/kakao_signup_usecase';
import useSignupStore from '@/store/signupStore';
import { BusinessType } from 'dooring-core-domain/dist/enums/UserEnums';
import { KakaoLoginUsecase } from '@/DDD/usecase/auth/kakao_login_usecase';
import { ReadBizClientUsecase } from '@/DDD/usecase/user/read_bizClient_usecase';
import useBizClientStore from '@/store/bizClientStore';

// 콜백 처리 컴포넌트를 분리
function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const type = searchParams.get('type');

            if (type === 'signup') {
                try {
                    console.log('🔄 OAuth 콜백 처리 시작 (회원가입)');

                    // localStorage에서 직접 확인
                    const storedData = localStorage.getItem('signupData');
                    const parsed = JSON.parse(storedData!);
                    console.log('📝 localStorage 전체 데이터:', parsed);
                    console.log('📝 실제 businessType:', parsed.state.businessType);

                    // OAuth 콜백 후 세션 확인
                    const { data, error } = await supabase.auth.getSession();
                    console.log('📝 세션 데이터:', data);
                    console.log('❌ 세션 에러:', error);

                    if (error) {
                        console.error('Auth callback error:', error);
                        router.push('/login?error=auth_failed');
                        return;
                    }

                    if (data.session) {
                        console.log('✅ 세션 확인됨, 회원가입 API 호출 시작');
                        const kakaoSignupUsecase = new KakaoSignupUsecase(
                            new KakaoAuthSupabaseRepository(),
                            new BizClientSupabaseRepository(),
                            new CartSupabaseRepository()
                        );
                        const result = await kakaoSignupUsecase.handleAuthCallback(parsed.state.businessType as BusinessType, parsed.state.phoneNumber as string);
                        console.log('📡 API 응답 상태:', result);
                        console.log('📡 API 응답:', result);

                        if (result.success) {
                            useBizClientStore.setState({ bizClient: result.data.bizClient });
                            router.push('/');
                        } else {
                            router.push('/login?error=signup_failed');
                        }
                    } else {
                        console.log('❌ 세션이 없음, 로그인 페이지로 이동');
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('💥 Unexpected error:', error);
                    router.push('/login?error=unexpected');
                }
            } else if (type === 'login') {
                try {
                    console.log('🔄 OAuth 콜백 처리 시작 (로그인)');

                    // OAuth 콜백 후 세션 확인
                    const { data, error } = await supabase.auth.getSession();
                    console.log('📝 세션 데이터:', data);
                    console.log('❌ 세션 에러:', error);

                    if (error) {
                        console.error('Auth callback error:', error);
                        router.push('/login?error=auth_failed');
                        return;
                    }

                    if (data.session) {
                        console.log('✅ 세션 확인됨, 사용자 정보 조회 시작');
                        const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
                        const user = await readBizClientUsecase.execute(data.session.user.id);
                        console.log('📡 API 응답 상태:', user);
                        console.log('📡 API 응답:', user);

                        if (user.success && user.data) {
                            useBizClientStore.setState({ bizClient: user.data });
                            router.push(`/`);
                        } else {
                            router.push('/login?error=user_not_found');
                        }
                    }
                } catch (error) {
                    console.error('💥 Unexpected error:', error);
                    router.push('/login?error=unexpected');
                }
            } else {
                // type 파라미터가 없는 경우 기본 처리
                console.log('❌ type 파라미터가 없음, 로그인 페이지로 이동');
                router.push('/login');
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-lg">인증 처리 중...</p>
            </div>
        </div>
    );
}

// 로딩 컴포넌트
function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-lg">로딩 중...</p>
            </div>
        </div>
    );
}

// 메인 컴포넌트
export default function AuthCallback() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}