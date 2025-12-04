import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";
import { supabase } from "@/lib/supabase";
import { Response } from "../response";

// 환경에 따른 redirect URL 생성 함수
const getRedirectUrl = (type: 'signup' | 'login' | 'check'): string => {
    // 환경 변수에서 기본 URL 가져오기
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        window.location.origin;

    console.log(baseUrl);

    // URL이 http로 시작하지 않으면 https 추가
    const fullUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

    // URL이 /로 끝나지 않으면 / 추가
    const normalizedUrl = fullUrl.endsWith('/') ? fullUrl : `${fullUrl}/`;

    return `${normalizedUrl}auth/callback?type=${type}`;
};

export class KakaoAuthSupabaseRepository implements KakaoAuthRepository {
    async signup(): Promise<Response> {
        try {
            const redirectUrl = getRedirectUrl('signup');

            const supabaseResponse = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
                options: {
                    redirectTo: redirectUrl,
                    scopes: 'phone_number',
                }
            });

            if (supabaseResponse.error) {
                return {
                    success: false,
                    data: undefined as any,
                    message: supabaseResponse.error.message,
                };
            }

            // OAuth는 리다이렉트를 발생시키므로 여기서는 성공만 반환
            return {
                success: true,
                message: "카카오 로그인 페이지로 리다이렉트됩니다",
                data: null,
            };

        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: "예상치 못한 오류가 발생했습니다",
            };
        }
    }

    // async login(): Promise<Response> {
    //     const redirectUrl = getRedirectUrl('login');

    //     const { data, error } = await supabase.auth.signInWithOAuth({
    //         provider: 'kakao',
    //         options: {
    //             redirectTo: redirectUrl
    //         }
    //     });

    //     if (error) {
    //         return {
    //             success: false,
    //             data: undefined as any,
    //             message: error.message,
    //         };
    //     }

    //     return {
    //         success: true,
    //         message: "카카오 로그인 성공",
    //         data: data as any,
    //     };
    // }

    // 별도 메서드로 OAuth 콜백 후 사용자 정보 처리
    async getUserInfo(): Promise<Response> {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                return {
                    success: false,
                    data: undefined as any,
                    message: error.message,
                };
            }

            if (!user) {
                return {
                    success: false,
                    data: undefined as any,
                    message: "사용자 정보를 찾을 수 없습니다",
                };
            }

            return {
                success: true,
                message: "사용자 정보 조회 성공",
                data: { user },
            };
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: "사용자 정보 조회 중 오류가 발생했습니다",
            };
        }
    }

    async logout(): Promise<Response> {
        const { error } = await supabase.auth.signOut();
        console.log('logout error:', error);
        if (error) {
            return { success: false, data: undefined as any, message: error.message };
        }
        return { success: true, data: null, message: "로그아웃 성공" };
    }

    // uid로 bizClient 확인 후 분기처리를 위한 OAuth 시작
    async checkAndLogin(): Promise<Response> {
        try {
            const redirectUrl = getRedirectUrl('check');

            const supabaseResponse = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
                options: {
                    redirectTo: redirectUrl,
                    scopes: 'phone_number',
                }
            });

            if (supabaseResponse.error) {
                return {
                    success: false,
                    data: undefined as any,
                    message: supabaseResponse.error.message,
                };
            }

            return {
                success: true,
                message: "카카오 로그인 페이지로 리다이렉트됩니다",
                data: null,
            };

        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: "예상치 못한 오류가 발생했습니다",
            };
        }
    }
}