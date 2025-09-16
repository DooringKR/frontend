// src/app/(auth)/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { KakaoAuthSupabaseRepository } from '@/DDD/data/service/kakao_auth_supabase_repository';
import { BizClientSupabaseRepository } from '@/DDD/data/db/User/bizclient_supabase_repository';
import { CartSupabaseRepository } from '@/DDD/data/db/CartNOrder/cart_supabase_repository';
import { KakaoSignupUsecase } from '@/DDD/usecase/auth/kakao_signup_usecase';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                console.log('🔄 OAuth 콜백 처리 시작');

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
                    const result = await kakaoSignupUsecase.handleAuthCallback();
                    console.log('📡 API 응답 상태:', result);
                    console.log('📡 API 응답:', result);

                    if (result.success) {
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
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900">    </div>
                <p className="mt-4 text-lg">회원가입 처리 중...</p>
            </div>
        </div>
    );
}