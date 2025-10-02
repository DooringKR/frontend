// "use client";

// import { checkPhoneDuplicate, signin, signup } from "@/api/authApi";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import ChildIcon from "public/icons/child";
// import Factory from "public/icons/factory";
// import PaintBruchVertical from "public/icons/paintbrush_vertical";
// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";

// import BottomButton from "@/components/BottomButton/BottomButton";
// import BottomSheet from "@/components/BottomSheet/BottomSheet";
// import Button from "@/components/Button/Button";
// import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
// import Header from "@/components/Header/Header";
// import UnderlinedInput from "@/components/Input/UnderlinedInput";
// import UnderlinedSelect from "@/components/Select/UnderlinedSelect";
// import TopNavigator from "@/components/TopNavigator/TopNavigator";

// import useUserStore from "@/store/userStore";
// import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
// import baseSchema, { PhoneFormData } from "@/utils/schema";

// function PhoneLoginPage() {
//   const router = useRouter();
//   const { userType, setUserPhoneNumber, setUserType, id } = useUserStore();
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
//   const [duplicateStatus, setDuplicateStatus] = useState<
//     "none" | "checking" | "duplicate" | "available"
//   >("none");
//   const [showDuplicateBottomSheet, setShowDuplicateBottomSheet] = useState(false);
//   const [showBottomButton, setShowBottomButton] = useState(false);
//   const [showSignupFlow, setShowSignupFlow] = useState(false);
//   const [showUserTypeBottomSheet, setShowUserTypeBottomSheet] = useState(false);
//   const [showSignupAgreementBottomSheet, setShowSignupAgreementBottomSheet] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<PhoneFormData>({
//     resolver: zodResolver(baseSchema),
//     mode: "onChange",
//   });

//   // 이미 로그인된 사용자 체크
//   useEffect(() => {
//     if (id) {
//       console.log("이미 로그인된 사용자입니다. 홈 화면으로 이동합니다.");
//       router.replace("/");
//     }
//   }, [id, router]);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   const handleTypeSelect = (type: "" | "INTERIOR" | "FACTORY") => {
//     if (type) {
//       setUserType(type);
//     }
//     setShowUserTypeBottomSheet(false);
//   };

//   // 로그인 처리 함수
//   const handleLogin = async () => {
//     try {
//       const cleanPhoneNumber = watchedPhoneNumber?.replace(/-/g, "") || "";
//       const userId = await signin({
//         phoneNumber: cleanPhoneNumber,
//       });
//       console.log("로그인 성공:", userId);
//       router.replace("/");
//     } catch (error) {
//       console.error("로그인 실패:", error);
//       alert("로그인 중 오류가 발생했습니다.");
//     }
//     setShowDuplicateBottomSheet(false);
//   };

//   const handleSignup = async () => {
//     try {
//       // 전화번호에서 하이픈 제거
//       const cleanPhoneNumber = watchedPhoneNumber?.replace(/-/g, "") || "";

//       const result = await signup({
//         phoneNumber: cleanPhoneNumber,
//         userType: userType as "INTERIOR" | "FACTORY",
//       });

//       console.log("회원가입 성공:", result.user_id);
//       router.replace("/");
//     } catch (error) {
//       console.error("회원가입 오류:", error);

//       // 409 오류는 이미 가입된 회원
//       if (error instanceof Error && error.message.includes("409")) {
//         alert("이미 가입된 회원입니다. 로그인을 시도해주세요.");
//         setShowSignupAgreementBottomSheet(false);
//         setShowSignupFlow(false);
//         setDuplicateStatus("duplicate");
//         setShowBottomButton(true);
//       } else {
//         alert(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.");
//       }
//     }
//   };

//   // 전화번호가 11자리가 되면 자동으로 중복 체크
//   const handlePhoneChange = async (value: string) => {
//     const formatted = formatPhoneNumber(value);
//     setValue("user_phoneNumber", formatted, {
//       shouldValidate: true,
//     });

//     // 전화번호가 변경되면 상태 초기화
//     setShowBottomButton(false);
//     setShowDuplicateBottomSheet(false);
//     setShowSignupFlow(false);

//     // 하이픈 제거 후 11자리인지 확인
//     const cleanPhoneNumber = formatted.replace(/-/g, "");
//     if (cleanPhoneNumber.length === 11) {
//       // 유효성 검사를 위해 잠시 대기 (React 상태 업데이트 대기)
//       setTimeout(async () => {
//         // 유효성 검사가 실패하면 중복 체크를 진행하지 않음
//         if (errors.user_phoneNumber) {
//           setDuplicateStatus("none");
//           setShowBottomButton(false);
//           return;
//         }

//         // 11자리가 되면 즉시 포커스 해제
//         if (document.activeElement instanceof HTMLElement) {
//           document.activeElement.blur();
//         }

//         try {
//           setIsCheckingDuplicate(true);
//           setDuplicateStatus("checking");
//           console.log("자동 중복 체크 시작:", formatted);

//           const isDuplicate = await checkPhoneDuplicate(formatted);
//           console.log("중복 체크 결과:", isDuplicate ? "중복됨" : "중복아님");

//           if (isDuplicate) {
//             setDuplicateStatus("duplicate");
//             setShowBottomButton(true);
//           } else {
//             setDuplicateStatus("available");
//             setShowBottomButton(false);
//             setShowSignupFlow(true);
//             // 업체유형 선택 모달 바로 띄우기
//             setShowUserTypeBottomSheet(true);
//           }
//         } catch (error) {
//           console.error("자동 중복 체크 실패:", error);
//           setDuplicateStatus("none");
//           // 에러가 발생해도 사용자 입력은 계속 가능하도록 함
//         } finally {
//           setIsCheckingDuplicate(false);
//         }
//       }, 0);
//     } else {
//       setDuplicateStatus("none");
//       setShowBottomButton(false);
//     }
//   };

//   const watchedPhoneNumber = watch("user_phoneNumber");

//   return (
//     <div className="flex h-screen w-full flex-col justify-start bg-white">
//       <TopNavigator title="" />
//       <Header
//         title={
//           showSignupFlow
//             ? userType
//               ? "입력한 정보를 확인해주세요"
//               : "어떤 업체에서 오셨어요?"
//             : "휴대폰 번호를 입력해주세요"
//         }
//         size="Large"
//       />
//       <div className="px-5 pt-5">
//         <UnderlinedInput
//           ref={inputRef}
//           label="휴대폰 번호"
//           value={watchedPhoneNumber || ""}
//           placeholder="휴대폰 번호"
//           type="tel"
//           error={!!errors.user_phoneNumber}
//           helperText={
//             errors.user_phoneNumber?.message ||
//             (duplicateStatus === "checking" && "가입 여부 확인 중...") ||
//             (duplicateStatus === "duplicate" && "가입된 전화번호입니다.") ||
//             (duplicateStatus === "available" && "사용 가능한 전화번호입니다.") ||
//             ""
//           }
//           onChange={handlePhoneChange}
//         />

//         {/* 회원가입 플로우 */}
//         {showSignupFlow && (
//           <div className="pt-5">
//             <UnderlinedSelect
//               label="업체 유형 선택"
//               options={[]}
//               value={
//                 userType === "INTERIOR" ? "인테리어 업체" : userType === "FACTORY" ? "공장" : ""
//               }
//               onClick={() => setShowUserTypeBottomSheet(true)}
//               onChange={function (): void {
//                 throw new Error("Function not implemented.");
//               }}
//             />
//           </div>
//         )}
//       </div>

//       {/* 중복된 전화번호일 때 BottomButton */}
//       {showBottomButton && !showDuplicateBottomSheet && (
//         <div className="pointer-events-none fixed inset-0 z-10 flex items-end justify-center">
//           <div className="pointer-events-auto mb-5 w-full max-w-[460px] px-5">
//             <BottomButton
//               type="1button"
//               button1Text="다음"
//               onButton1Click={() => setShowDuplicateBottomSheet(true)}
//               className="w-full max-w-[460px]"
//             />
//           </div>
//         </div>
//       )}

//       {/* 회원가입 플로우일 때 BottomButton */}
//       {showSignupFlow &&
//         userType &&
//         !showSignupAgreementBottomSheet &&
//         !showUserTypeBottomSheet && (
//           <div className="pointer-events-none fixed inset-0 z-10 flex items-end justify-center">
//             <div id="signup-confirm" className="pointer-events-auto w-full max-w-[460px]">
//               <BottomButton
//                 type="1button"
//                 button1Text="확인"
//                 onButton1Click={() => setShowSignupAgreementBottomSheet(true)}
//                 className="w-full max-w-[460px]"
//               />
//             </div>
//           </div>
//         )}

//       {/* 로그인하는 경우: 중복된 전화번호 BottomSheet */}
//       <BottomSheet
//         isOpen={showDuplicateBottomSheet}
//         onClose={() => setShowDuplicateBottomSheet(false)}
//         title=""
//         buttonArea={
//           <div className="flex flex-col items-center">
//             <div className="py-3">
//               <ChildIcon />
//             </div>
//             <div className="flex flex-col items-center gap-1 px-5 pt-2">
//               <div className="text-center text-[20px]/[28px] font-700">
//                 <span className="text-blue-600">{watchedPhoneNumber}</span>님
//                 <br />
//                 반가워요, 또 뵙네요!
//               </div>
//               <div className="text-center text-[16px]/[24px] font-400 text-gray-500">
//                 안전한 로그인을 위해 휴대폰 번호가 맞는지
//                 <br />한 번 더 확인해주세요.
//               </div>
//             </div>
//             <div className="w-full px-5 pb-5">
//               <BottomButton type="1button" button1Text="로그인하기" onButton1Click={handleLogin} />
//             </div>
//           </div>
//         }
//       />

//       {/* 업체 유형 선택 BottomSheet */}
//       <BottomSheet
//         isOpen={showUserTypeBottomSheet}
//         title="업체 유형을 선택해 주세요"
//         onClose={() => setShowUserTypeBottomSheet(false)}
//         children={
//           <>
//             <div className="flex gap-3 py-5">
//               <CompanyTypeButton
//                 text="인테리어 업체"
//                 icon={<PaintBruchVertical />}
//                 onClick={() => handleTypeSelect("INTERIOR")}
//               />
//               <CompanyTypeButton
//                 text="자재 공장"
//                 icon={<Factory />}
//                 onClick={() => handleTypeSelect("FACTORY")}
//               />
//             </div>
//           </>
//         }
//       />
//       <BottomSheet
//         isOpen={showSignupAgreementBottomSheet}
//         title={""}
//         onClose={() => setShowSignupAgreementBottomSheet(false)}
//         children={
//           <div className="flex flex-col gap-5">
//             <h2 className="text-lg font-bold text-gray-800">
//               바로가구 회원가입에 <br />꼭 필요한 동의만 추렸어요
//             </h2>
//             <div className="text-sm text-gray-400">필수 동의 총 2개</div>

//             <div className="border-1 ml-3 mt-2 flex flex-col gap-3 border-l-[4px] border-[#E2E2E2] pl-3">
//               <div className="flex cursor-pointer items-center justify-between"
//                 onClick={() => window.open("https://dooring.notion.site/terms-of-use", "_blank")}>
//                 <p>
//                   <span className="font-semibold text-brand-500">필수 </span>
//                   <span className="text-gray-700">서비스 이용 동의</span>
//                 </p>
//                 <Image
//                   src="/icons/Arrow_Right.svg"
//                   width={20}
//                   alt="왼쪽 더보기 버튼"
//                   height={20}
//                   className="cursor-pointer"
//                 />
//               </div>
//               <div className="flex cursor-pointer items-center justify-between"
//                 onClick={() => window.open("https://dooring.notion.site/privacy", "_blank")}>
//                 <p>
//                   <span className="font-semibold text-brand-500">필수 </span>
//                   <span className="text-gray-700">개인정보 수집 및 이용 동의</span>
//                 </p>
//                 <Image
//                   src="/icons/Arrow_Right.svg"
//                   width={20}
//                   alt="왼쪽 더보기 버튼"
//                   height={20}
//                   className="cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>
//         }
//         buttonArea={
//           <div id="signup-agreement" className="p-5">
//             <Button
//               type="Brand"
//               text="모두 동의하고 회원가입"
//               onClick={handleSignup}
//               className="w-full max-w-[460px]"
//             />
//           </div>
//         }
//       ></BottomSheet>
//     </div>
//   );
// }

// export default PhoneLoginPage;
