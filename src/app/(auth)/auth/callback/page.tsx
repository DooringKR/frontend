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
import { ReadBizClientUsecase } from '@/DDD/usecase/user/read_bizClient_usecase';
import useBizClientStore from '@/store/bizClientStore';
import useCartStore from '@/store/cartStore';
import { CrudCartUsecase } from '@/DDD/usecase/crud_cart_usecase';
import { setAmplitudeUserId, setAmplitudeUserProperties, trackSignup } from '@/services/analytics/amplitude';
import { formatBusinessTypeToEnglish } from '@/utils/formatBusinessType';
import { takeAfterLogin } from '@/utils/afterLogin';

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

                    // useSignupStore에서 직접 확인
                    const businessType = useSignupStore.getState().businessType;
                    const phoneNumber = useSignupStore.getState().phoneNumber;
                    console.log('📝 useSignupStore 데이터:', businessType, phoneNumber);

                    const { data, error } = await supabase.auth.getSession();

                    if (error) {
                        console.error('Auth callback error:', error);
                        router.push('/start');
                        useSignupStore.setState({ businessType: null, phoneNumber: null });
                        supabase.auth.signOut();
                        useBizClientStore.setState({ bizClient: null });
                        useCartStore.setState({ cart: null });
                        alert('일시적인 네트워크 오류입니다. 처음부터 다시 시도해주세요.');
                        return;
                    }
                    console.log('data12312312312321312312312:', data);
                    if (data.session) {
                        console.log('✅ 세션 확인됨, 회원가입 API 호출 시작');
                        const kakaoSignupUsecase = new KakaoSignupUsecase(
                            new KakaoAuthSupabaseRepository(),
                            new BizClientSupabaseRepository(),
                            new CartSupabaseRepository()
                        );

                        try {
                            const result = await kakaoSignupUsecase.handleAuthCallback(businessType as BusinessType, phoneNumber as string);
                            console.log('📡 API 응답 상태:', result);
                            console.log('📡 API 응답:', result);
                            console.log('✅ 회원가입 성공, 스토어에 데이터 저장 후 홈으로 이동');

                            // 1. 스토어 업데이트
                            useBizClientStore.setState({ bizClient: result.data.bizClient });
                            useCartStore.setState({ cart: result.data.cart });

                            // 2. Amplitude User ID 설정
                            setAmplitudeUserId(result.data.bizClient.id);

                            // 3. Supabase에서 provider 정보 가져오기
                            const { data: { user } } = await supabase.auth.getUser();
                            const provider = user?.app_metadata?.provider || user?.identities?.[0]?.provider || 'unknown';

                            // 4. Amplitude User Properties 설정
                            setAmplitudeUserProperties({
                                business_type: formatBusinessTypeToEnglish(result.data.bizClient.business_type),
                                providers: provider,
                            });

                            // 5. Signup 이벤트 전송
                            await trackSignup({
                                business_type: formatBusinessTypeToEnglish(result.data.bizClient.business_type),
                                providers: provider,
                            });

                            useSignupStore.setState({ businessType: null, phoneNumber: null });
                            console.log('🔄 / (홈) 페이지로 이동 시작');
                            router.push(takeAfterLogin() ?? '/');
                        } catch (error) {
                            console.error('💥 Unexpected error:', error);
                            useSignupStore.setState({ businessType: null, phoneNumber: null });
                            supabase.auth.signOut();
                            useBizClientStore.setState({ bizClient: null });
                            useCartStore.setState({ cart: null });
                            router.push('/start');
                            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                        }
                    } else {
                        console.log('❌ 세션이 없음, 로그인 페이지로 이동');
                        useSignupStore.setState({ businessType: null, phoneNumber: null });
                        supabase.auth.signOut();
                        useBizClientStore.setState({ bizClient: null });
                        useCartStore.setState({ cart: null });
                        router.push('/start');
                        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                    }
                } catch (error) {
                    console.error('💥 Unexpected error:', error);
                    useSignupStore.setState({ businessType: null, phoneNumber: null });
                    supabase.auth.signOut();
                    useBizClientStore.setState({ bizClient: null });
                    useCartStore.setState({ cart: null });
                    router.push('/start');
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                }
                // } else if (type === 'login') {
                //     try {
                //         console.log('🔄 OAuth 콜백 처리 시작 (로그인)');

                //         // OAuth 콜백 후 세션 확인
                //         const { data, error } = await supabase.auth.getSession();
                //         console.log('📝 세션 데이터:', data);
                //         console.log('❌ 세션 에러:', error);

                //         if (error) {
                //             console.error('Auth callback error:', error);
                //             router.push('/login?error=auth_failed');
                //             return;
                //         }

                //         if (data.session) {
                //             console.log('✅ 세션 확인됨, 사용자 정보 조회 시작');
                //             const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
                //             const user = await readBizClientUsecase.execute(data.session.user.id);
                //             const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
                //             const cart = await readCartUsecase.findById(data.session.user.id)!;
                //             console.log('📡 API 응답 상태:', user);
                //             console.log('📡 API 응답:', user);

                //             if (user.success && user.data) {
                //                 useBizClientStore.setState({ bizClient: user.data });
                //                 useCartStore.setState({ cart: cart! });
                //                 router.push(`/`);
                //             } else {
                //                 router.push('/login?error=user_not_found');
                //             }
                //         }
                //     } catch (error) {
                //         console.error('💥 Unexpected error:', error);
                //         router.push('/login?error=unexpected');
                //     }
            } else if (type === 'check') {
                try {
                    console.log('🔄 OAuth 콜백 처리 시작 (bizClient 확인)');

                    // OAuth 콜백 후 세션 확인
                    console.log('🔄 check 타입 세션 확인 시작...');
                    const { data, error } = await supabase.auth.getSession();

                    if (error) {
                        console.error('Auth callback error:', error);
                        router.push('/start?error=auth_failed');
                        return;
                    }

                    if (data.session) {
                        console.log('✅ 세션 확인됨, uid로 bizClient 존재 여부 확인 시작');
                        const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
                        const bizClientResponse = await readBizClientUsecase.execute(data.session.user.id);
                        console.log('📡 bizClient 조회 결과:', bizClientResponse);

                        if (bizClientResponse.success && bizClientResponse.data) {
                            // bizClient가 존재하면 로그인 처리
                            const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
                            const cart = await readCartUsecase.findById(data.session.user.id);

                            // 1. 스토어 업데이트
                            useBizClientStore.setState({ bizClient: bizClientResponse.data });
                            useCartStore.setState({ cart: cart! });

                            // 2. Amplitude User ID 설정
                            setAmplitudeUserId(bizClientResponse.data.id);

                            // 3. Supabase에서 provider 정보 가져오기
                            const provider = data.session.user.app_metadata?.provider
                                || data.session.user.identities?.[0]?.provider
                                || 'unknown';

                            // 4. Amplitude User Properties 설정 (로그인 시에도 최신 정보 유지)
                            setAmplitudeUserProperties({
                                business_type: formatBusinessTypeToEnglish(bizClientResponse.data.business_type),
                                providers: provider,
                            });

                            router.push(takeAfterLogin() ?? '/');
                        } else {
                            // bizClient가 존재하지 않으면 회원가입 페이지로
                            router.push('/signup');
                        }
                    } else {
                        console.log('❌ 세션이 없음, 회원가입 페이지로 이동');
                        //이건 사파리에서 이 로직으로 실행돼서 여기다가 추가할게요.
                        router.push('/signup');
                    }
                } catch (error) {
                    console.error('💥 Unexpected error:', error);
                    alert('일시적인 네트워크 오류입니다. 처음부터 다시 시도해주세요.');
                    router.push('/start?error=unexpected');
                }
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