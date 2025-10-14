// "use client";

// import BottomButton from "@/components/BottomButton/BottomButton";
// import TopNavigator from "@/components/TopNavigator/TopNavigator";
// import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
// import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
// import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
// import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
// import Image from "next/image";
// import Header from "@/components/Header/Header";
// import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
// import PaintBruchVertical from "public/icons/paintbrush_vertical";
// import Factory from "public/icons/factory";
// import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
// import useSignupStore from "@/store/signupStore";
// import Input from "@/components/Input/Input";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
// import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
// import useBizClientStore from "@/store/bizClientStore";
// import useCartStore from "@/store/cartStore";
// import { useRouter } from "next/navigation";

// function KakaoLoginPage() {
//     // SignupStore 사용
//     const { businessType, setBusinessType, setPhoneNumber } = useSignupStore();
//     const [phoneNumber, setPhoneNumberLocal] = useState("");
//     const [displayPhoneNumber, setDisplayPhoneNumber] = useState(""); // 화면 표시용
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(true);

//     const kakaoSignupUsecase = new KakaoSignupUsecase(
//         new KakaoAuthSupabaseRepository(),
//         new BizClientSupabaseRepository(),
//         new CartSupabaseRepository()
//     );

//     useEffect(() => {
//         // 유저 정보 확인 및 리다이렉트 처리
//         const checkUserAndRedirect = async () => {
//             try {
//                 const { data: { user }, error } = await supabase.auth.getUser();

//                 console.log("User check result:", { user, error });
//                 console.log("login page");

//                 console.log('✅ 세션 확인됨, 사용자 정보 조회 시작');

//                 // 유저가 로그인되어 있으면 홈으로 리다이렉트
//                 if (user && !error) {
//                     const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
//                     const bizClient = await readBizClientUsecase.execute(user!.id);
//                     const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
//                     const cart = await readCartUsecase.findById(user!.id)!;
//                     console.log('📡 API 응답 상태:', bizClient);
//                     console.log('📡 API 응답:', bizClient);

//                     if (bizClient.success && bizClient.data) {
//                         useBizClientStore.setState({ bizClient: bizClient.data });
//                         useCartStore.setState({ cart: cart! });
//                         router.push(`/`);
//                     } else {
//                         router.push('/login?error=user_not_found');
//                     }
//                     console.log("User is already logged in, redirecting to home");
//                     router.push('/');
//                     return;
//                 }

//                 // 에러가 있거나 유저가 없으면 로그인 페이지 유지
//                 console.log("User not logged in, staying on login page");
//             } catch (err) {
//                 console.error("Error checking user:", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         checkUserAndRedirect();
//     }, [router]);

//     // 휴대전화 번호 포맷팅 함수
//     const formatPhoneNumber = (value: string) => {
//         // 숫자만 추출
//         const numbers = value.replace(/[^\d]/g, '');

//         // 길이에 따라 포맷팅
//         if (numbers.length <= 3) {
//             return numbers;
//         } else if (numbers.length <= 7) {
//             return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
//         } else if (numbers.length <= 11) {
//             return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
//         } else {
//             // 11자리 초과 시 11자리까지만
//             return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
//         }
//     };

//     // 휴대전화 번호 입력 핸들러
//     const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const inputValue = e.target.value;
//         const numbersOnly = inputValue.replace(/[^\d]/g, ''); // 숫자만 추출
//         const formatted = formatPhoneNumber(inputValue);

//         setPhoneNumberLocal(numbersOnly); // 로컬 상태에 하이픈 없는 순수 숫자 저장
//         setDisplayPhoneNumber(formatted); // 화면에는 하이픈 포함된 형태로 표시
//         setPhoneNumber(numbersOnly); // 전역 상태에도 하이픈 없는 순수 숫자 저장
//     };

//     const handleKakaoLogin = () => {
//         // 업체 유형 검증
//         if (!businessType) {
//             alert("업체 유형을 선택해주세요");
//             return;
//         }

//         // 휴대전화 번호 검증
//         if (!phoneNumber.trim()) {
//             alert("휴대전화 번호를 입력해주세요");
//             return;
//         }

//         // 휴대전화 번호 형식 검증 (간단한 검증)
//         const phoneRegex = /^01[0-9][0-9]{3,4}[0-9]{4}$/;
//         if (!phoneRegex.test(phoneNumber)) {
//             alert("올바른 휴대전화 번호 형식을 입력해주세요\n예: 010-1234-5678");
//             return;
//         }

//         // 모든 검증 통과 시 카카오 로그인 실행
//         kakaoSignupUsecase.execute();
//     };

//     // 로딩 UI
//     if (isLoading) {
//         return (
//             <div className="flex h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white items-center justify-center">
//                 <div className="flex flex-col items-center gap-4">
//                     {/* 로딩 스피너 */}
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>

//                     {/* 로딩 텍스트 */}
//                     <div className="text-center">
//                         <h2 className="text-lg font-semibold text-gray-800 mb-2">
//                             로딩 중...
//                         </h2>
//                         <p className="text-sm text-gray-600">
//                             사용자 정보를 확인하고 있습니다
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex h-screen w-full flex-col bg-gradient-to-b from-blue-50 to-white">
//             {/* 메인 콘텐츠 */}
//             <div className="flex flex-1 flex-col items-center justify-between px-8 py-8 gap-8">
//                 {/* 로고 영역 */}
//                 <div className="text-center">
//                     <h1 className="mb-2 text-2xl font-bold text-gray-800">
//                         인테리어 자재를 쉽고 빠르게
//                     </h1>
//                     <p className="text-gray-600">
//                         도어링과 함께 시작하세요
//                     </p>
//                 </div>

//                 <div className="w-full flex flex-col items-center justify-center gap-6">
//                     <Header title="업체 유형 선택" />
//                     <div className="flex items-center justify-center gap-4 w-full">
//                         <CompanyTypeButton
//                             text="인테리어 업체"
//                             icon={<PaintBruchVertical />}
//                             onClick={() => setBusinessType(BusinessType.INTERIOR)}
//                         // isSelected={businessType === BusinessType.INTERIOR}
//                         />
//                         <CompanyTypeButton
//                             text="자재 공장"
//                             icon={<Factory />}
//                             onClick={() => setBusinessType(BusinessType.FACTORY)}
//                         // isSelected={businessType === BusinessType.FACTORY}
//                         />
//                     </div>
//                 </div>

//                 {/* 휴대전화 입력창 */}
//                 <div className="w-full max-w-sm">
//                     <Input
//                         type="tel"
//                         name="phone"
//                         label="휴대전화 번호"
//                         placeholder="010-1234-5678"
//                         value={displayPhoneNumber}
//                         onChange={handlePhoneNumberChange}
//                     />
//                 </div>

//                 <div>
//                     <Image
//                         src="/img/kakao_login_large_wide.png"
//                         alt="카카오 로그인"
//                         width={300}
//                         height={50}
//                         className="cursor-pointer"
//                         onClick={handleKakaoLogin}
//                     />

//                     {/* 하단 안내 텍스트 */}
//                     <div className="mt-8 text-center">
//                         <p className="text-sm text-gray-500">
//                             로그인 시{" "}
//                             <span
//                                 className="text-blue-500 underline cursor-pointer hover:text-blue-600"
//                                 onClick={() => window.open("https://dooring.notion.site/terms-of-use", "_blank")}
//                             >
//                                 서비스 이용약관
//                             </span>
//                             {" "}및{" "}
//                             <span
//                                 className="text-blue-500 underline cursor-pointer hover:text-blue-600"
//                                 onClick={() => window.open("https://dooring.notion.site/privacy", "_blank")}
//                             >
//                                 개인정보처리방침
//                             </span>
//                             에
//                         </p>
//                         <p className="text-sm text-gray-500">
//                             동의하는 것으로 간주됩니다
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* 하단 여백 */}
//             <div className="h-8"></div>
//         </div>
//     );
// }

// export default KakaoLoginPage;