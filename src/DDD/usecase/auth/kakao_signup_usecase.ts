import { CartRepository } from "@/DDD/repository/db/CartNOrder/cart_repository";
import { KakaoAuthRepository } from "@/DDD/repository/service/kakao_auth_repository";
import { BizClientRepository } from "@/DDD/repository/db/User/bizclient_repository";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";
import { Response } from "@/DDD/data/response";
import { Cart } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Cart";
import useSignupStore from "@/store/signupStore";

export class KakaoSignupUsecase {
    constructor(
        private readonly kakaoAuthRepository: KakaoAuthRepository,
        private readonly bizClientRepository: BizClientRepository,
        private readonly cartRepository: CartRepository) { }

    async execute() {
        try {
            // 1단계: 카카오 OAuth 시작 (리다이렉트 발생)
            const kakaoSignupResponse = await this.kakaoAuthRepository.signup();
            console.log('OAuth 시작 결과:', kakaoSignupResponse);

            if (!kakaoSignupResponse.success) {
                return {
                    success: false,
                    data: undefined as any,
                    message: kakaoSignupResponse.message,
                };
            }

            // OAuth는 리다이렉트를 발생시키므로 여기서는 성공만 반환
            return {
                success: true,
                message: "카카오 로그인 페이지로 이동합니다",
                data: null,
            };

        } catch (error) {
            console.error('execute 에러:', error);
            return {
                success: false,
                data: undefined as any,
                message: "예상치 못한 오류가 발생했습니다",
            };
        }
    }

    // 별도 메서드: OAuth 콜백 후 사용자 정보 처리
    async handleAuthCallback(userType: BusinessType, phoneNumber: string): Promise<Response> {
        try {
            console.log('OAuth 콜백 처리 시작');

            // 2단계: OAuth 콜백 후 사용자 정보 가져오기
            const userInfo = await this.kakaoAuthRepository.getUserInfo();
            console.log('사용자 정보:', userInfo);

            if (!userInfo.success) {
                return {
                    success: false,
                    data: undefined as any,
                    message: "사용자 정보를 가져올 수 없습니다",
                };
            }

            // 복잡해서 diagram 그려봤는데 이 부분 삭제해야됨.
            // const kakaoLoginUsecase = new KakaoLoginUsecase(this.kakaoAuthRepository);
            // const loginResponse = await kakaoLoginUsecase.execute();
            // console.log('로그인 결과:', loginResponse);
            useSignupStore.getState().resetBusinessType();
            useSignupStore.getState().resetPhoneNumber();

            // 3단계: BizClient 생성
            const bizClient = new BizClient({
                id: userInfo.data.user.id,
                created_at: new Date(),
                business_type: userType,
                nick_name: userInfo.data.user.user_metadata?.nickname || "test",
                phone_number: phoneNumber,
            });
            console.log('BizClient:', bizClient);

            const bizClientResponse = await this.bizClientRepository.createUser(bizClient);
            console.log('BizClient 생성 결과:', bizClientResponse);

            // 4단계: Cart 생성
            // Cart 생성자에 필요한 인자가 1개임을 반영하여 수정
            const cart = new Cart({
                id: undefined,
                created_at: new Date(),
                user_id: userInfo.data.user.id,
                cart_count: 0
                // 필요하다면 추가 필드 작성
            });

            const cartResponse = await this.cartRepository.createCart(cart);
            console.log('Cart 생성 결과:', cartResponse);

            if (bizClientResponse.success && cartResponse.success) {
                useSignupStore.getState().resetBusinessType();
                useSignupStore.getState().resetPhoneNumber();
            }


            return {
                success: true,
                data: {
                    bizClient: bizClientResponse.data,
                    cart: cartResponse.data,
                },
                message: "회원가입이 완료되었습니다",
            };

        } catch (error) {
            console.error('handleAuthCallback 에러:', error);
            return {
                success: false,
                data: undefined as any,
                message: "예상치 못한 오류가 발생했습니다",
            };
        }
    }
}