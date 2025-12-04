// import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";

// export class KakaoLoginUsecase {
//     constructor(private readonly kakaoAuthRepository: KakaoAuthRepository) { }

//     async execute() {
//         try {
//             // 1단계: 카카오 OAuth 시작 (리다이렉트 발생)
//             const kakaoSigninResponse = await this.kakaoAuthRepository.login();
//             console.log('OAuth 시작 결과:', kakaoSigninResponse);

//             if (!kakaoSigninResponse.success) {
//                 return {
//                     success: false,
//                     data: undefined as any,
//                     message: kakaoSigninResponse.message,
//                 };
//             }

//             // OAuth는 리다이렉트를 발생시키므로 여기서는 성공만 반환
//             return {
//                 success: true,
//                 message: "카카오 로그인 페이지로 이동합니다",
//                 data: null,
//             };

//         } catch (error) {
//             console.error('execute 에러:', error);
//             return {
//                 success: false,
//                 data: undefined as any,
//                 message: "예상치 못한 오류가 발생했습니다",
//             };
//         }
//     }

// }