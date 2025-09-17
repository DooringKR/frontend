"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import Image from "next/image";
import Header from "@/components/Header/Header";
import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
import PaintBruchVertical from "public/icons/paintbrush_vertical";
import Factory from "public/icons/factory";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import useSignupStore from "@/store/signupStore";

function KakaoLoginPage() {
    // SignupStore 사용
    const { businessType, setBusinessType } = useSignupStore();

    const kakaoSignupUsecase = new KakaoSignupUsecase(
        new KakaoAuthSupabaseRepository(),
        new BizClientSupabaseRepository(),
        new CartSupabaseRepository()
    );

    return (
        <div className="flex h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white">
            {/* 메인 콘텐츠 */}
            <div className="flex flex-1 flex-col items-center justify-between px-8 py-8 gap-12">
                {/* 로고 영역 */}
                <div className="text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">
                        인테리어 자재를 쉽고 빠르게
                    </h1>
                    <p className="text-gray-600">
                        도어링과 함께 시작하세요
                    </p>
                </div>

                <div className="w-full flex flex-col items-center justify-center">
                    <Header title="업체 유형 선택" />
                    <div className="flex items-center justify-center gap-4 w-full">
                        <CompanyTypeButton
                            text="인테리어 업체"
                            icon={<PaintBruchVertical />}
                            onClick={() => setBusinessType(BusinessType.INTERIOR)}
                        // isSelected={businessType === BusinessType.INTERIOR}
                        />
                        <CompanyTypeButton
                            text="자재 공장"
                            icon={<Factory />}
                            onClick={() => setBusinessType(BusinessType.FACTORY)}
                        // isSelected={businessType === BusinessType.FACTORY}
                        />
                    </div>
                </div>

                <div>
                    <Image
                        src="/img/kakao_login_large_wide.png"
                        alt="카카오 로그인"
                        width={300}
                        height={50}
                        className="cursor-pointer"
                        onClick={() => {
                            if (businessType) {
                                kakaoSignupUsecase.execute();
                            } else {
                                alert("업체 유형을 선택해주세요");
                            }
                        }}
                    />

                    {/* 하단 안내 텍스트 */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            로그인 시{" "}
                            <span
                                className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                                onClick={() => window.open("https://dooring.notion.site/terms-of-use", "_blank")}
                            >
                                서비스 이용약관
                            </span>
                            {" "}및{" "}
                            <span
                                className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                                onClick={() => window.open("https://dooring.notion.site/privacy", "_blank")}
                            >
                                개인정보처리방침
                            </span>
                            에
                        </p>
                        <p className="text-sm text-gray-500">
                            동의하는 것으로 간주됩니다
                        </p>
                    </div>
                </div>
            </div>

            {/* 하단 여백 */}
            <div className="h-8"></div>
        </div>
    );
}

export default KakaoLoginPage;