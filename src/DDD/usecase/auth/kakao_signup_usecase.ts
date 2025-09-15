import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";

export class KakaoSignupUsecase {
    constructor(private readonly kakaoAuthRepository: KakaoAuthRepository) { }

    async execute() {
        //카카오 계정으로 회원가입
        const kakaoSignup = await this.kakaoAuthRepository.signup();

        //성공 시 BizClient, Cart 생성

        // 전역 상태 업데이트 = userid 반환

        return kakaoSignup;
    }
}