"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";

function KakaoLoginPage() {
    const kakaoSignupUsecase = new KakaoSignupUsecase(
        new KakaoAuthSupabaseRepository(),
        new BizClientSupabaseRepository(),
        new CartSupabaseRepository()
    );
    return (
        <div className="flex h-screen w-full flex-col justify-start bg-white">
            <TopNavigator title="카카오 로그인" />
            <div className="flex flex-col items-center justify-center">
                <div>화면 중앙에 카카오 로그인 버튼 추가</div>
                <BottomButton
                    type="1button"
                    button1Text="카카오 로그인"
                    onButton1Click={() => {
                        kakaoSignupUsecase.execute();
                    }}
                />
            </div>
        </div>
    );
}

export default KakaoLoginPage;