import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";

export class KakaoLoginUsecase {
    constructor(private readonly kakaoAuthRepository: KakaoAuthRepository) { }

    async execute() {
        // 카카오 로그인
        const kakaoLogin = await this.kakaoAuthRepository.login();

        // 사용자 정보 조회



        return kakaoLogin;
    }
}