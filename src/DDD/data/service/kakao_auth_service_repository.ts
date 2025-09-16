import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";
import { supabase } from "@/lib/supabase";
import { Response } from "../response";

export class KakaoAuthServiceRepository implements KakaoAuthRepository {
    signup(): Promise<Response> {
        throw new Error("Method not implemented.");
    }
    async login(): Promise<Response> {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
        });

        if (error) {
            return {
                success: false,
                message: error.message,
                data: null,
            };
        }

        return {
            success: true,
            message: "카카오 로그인 성공",
            data: data,
        };
    }
}