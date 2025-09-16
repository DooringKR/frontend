import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";
import { supabase } from "@/lib/supabase";
import { Response } from "../response";

export class KakaoAuthSupabaseRepository implements KakaoAuthRepository {
    async signup(): Promise<Response> {
        try {
            const supabaseResponse = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
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

    async login(): Promise<Response> {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
        });

        if (error) {
            return {
                success: false,
                data: undefined as any,
                message: error.message,
            };
        }

        return {
            success: true,
            message: "카카오 로그인 성공",
            data: data as any,
        };
    }

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
}