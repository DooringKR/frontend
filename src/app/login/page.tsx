"use client";

import { checkPhoneDuplicate, signin, signup } from "@/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
import Header from "@/components/Header/Header";
import Input from "@/components/Input/Input";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import Modal from "@/components/Modal/Modal";
import UnderlinedSelect from "@/components/Select/UnderlinedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useUserStore from "@/store/userStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import handlePhoneKeyDown from "@/utils/handlePhoneKeyDown";
import baseSchema, { PhoneFormData } from "@/utils/schema";
import ChildIcon from "public/icons/child";
import Factory from "public/icons/factory";
import PaintBruchVertical from "public/icons/paintbrush_vertical";

function PhoneLoginPage() {
  const router = useRouter();
  const { userType, setUserPhoneNumber, setUserType, id } = useUserStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateStatus, setDuplicateStatus] = useState<'none' | 'checking' | 'duplicate' | 'available'>('none');
  const [showDuplicateBottomSheet, setShowDuplicateBottomSheet] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);
  const [showSignupFlow, setShowSignupFlow] = useState(false);
  const [showUserTypeBottomSheet, setShowUserTypeBottomSheet] = useState(false);
  const [showSignupAgreementModal, setShowSignupAgreementModal] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(baseSchema),
    mode: "onChange",
  });

  // 이미 로그인된 사용자 체크
  useEffect(() => {
    if (id) {
      console.log("이미 로그인된 사용자입니다. 홈 화면으로 이동합니다.");
      router.replace("/");
    }
  }, [id, router]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTypeSelect = (type: "" | "company" | "factory") => {
    if (type) {
      setUserType(type);
    }
    setShowUserTypeBottomSheet(false);
  };

  const handleSignup = async () => {
    try {
      // 전화번호에서 하이픈 제거
      const cleanPhoneNumber = watchedPhoneNumber?.replace(/-/g, "") || "";

      const result = await signup({
        phoneNumber: cleanPhoneNumber,
        userType: userType as "company" | "factory",
      });

      console.log("회원가입 성공:", result.user_id);
      router.replace("/");
    } catch (error) {
      console.error("회원가입 오류:", error);

      // 409 오류는 이미 가입된 회원
      if (error instanceof Error && error.message.includes('409')) {
        alert("이미 가입된 회원입니다. 로그인을 시도해주세요.");
        setShowSignupAgreementModal(false);
        setShowSignupFlow(false);
        setDuplicateStatus('duplicate');
        setShowBottomButton(true);
      } else {
        alert(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.");
      }
    }
  };


  // 전화번호가 11자리가 되면 자동으로 중복 체크
  const handlePhoneChange = async (value: string) => {
    const formatted = formatPhoneNumber(value);
    setValue("user_phoneNumber", formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // 전화번호가 변경되면 상태 초기화
    setShowBottomButton(false);
    setShowDuplicateBottomSheet(false);
    setShowSignupFlow(false);

    // 하이픈 제거 후 11자리인지 확인
    const cleanPhoneNumber = formatted.replace(/-/g, "");
    if (cleanPhoneNumber.length === 11) {
      try {
        setIsCheckingDuplicate(true);
        setDuplicateStatus('checking');
        console.log("자동 중복 체크 시작:", formatted);

        const isDuplicate = await checkPhoneDuplicate(formatted);
        console.log("중복 체크 결과:", isDuplicate ? "중복됨" : "중복아님");

        if (isDuplicate) {
          setDuplicateStatus('duplicate');
          setShowBottomButton(true);
          // 포커스 해제
          inputRef.current?.blur();
        } else {
          setDuplicateStatus('available');
          setShowBottomButton(false);
          setShowSignupFlow(true);
          // 포커스 해제
          inputRef.current?.blur();
        }
      } catch (error) {
        console.error("자동 중복 체크 실패:", error);
        setDuplicateStatus('none');
        // 에러가 발생해도 사용자 입력은 계속 가능하도록 함
      } finally {
        setIsCheckingDuplicate(false);
      }
    } else {
      setDuplicateStatus('none');
      setShowBottomButton(false);
    }
  };

  const watchedPhoneNumber = watch("user_phoneNumber");

  return (
    <div className="flex h-screen w-full flex-col justify-start bg-white">
      <TopNavigator title="" />
      <Header
        title={
          showSignupFlow
            ? (userType ? "입력한 정보를 확인해주세요" : "어떤 업체에서 오셨어요?")
            : "휴대폰 번호를 입력해주세요"
        }
        size="Large"
      />
      <div className="px-5 pt-5">
        <UnderlinedInput
          label="휴대폰 번호"
          value={watchedPhoneNumber || ""}
          placeholder="휴대폰 번호"
          error={!!errors.user_phoneNumber}
          helperText={
            errors.user_phoneNumber?.message ||
            (duplicateStatus === 'checking' && '가입 여부 확인 중...') ||
            (duplicateStatus === 'duplicate' && '가입된 전화번호입니다.') ||
            (duplicateStatus === 'available' && '사용 가능한 전화번호입니다.') ||
            ""
          }
          onChange={handlePhoneChange}
        />

        {/* 회원가입 플로우 */}
        {showSignupFlow && (
          <div className="pt-5">
            <UnderlinedSelect
              label="업체 유형 선택"
              options={[]}
              value={userType === "company" ? "인테리어 업체" : userType === "factory" ? "공장" : ""}
              onClick={() => setShowUserTypeBottomSheet(true)}
              onChange={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        )}
      </div>

      {/* 중복된 전화번호일 때 BottomButton */}
      {showBottomButton && !showDuplicateBottomSheet && (
        <div className="fixed inset-0 flex items-end justify-center z-10 pointer-events-none">
          <div className="w-full max-w-[500px] mx-10 px-5 mb-5 pointer-events-auto">
            <BottomButton
              type="1button"
              button1Text="다음"
              onButton1Click={() => setShowDuplicateBottomSheet(true)}
              className="bg-white"
            />
          </div>
        </div>
      )}

      {/* 회원가입 플로우일 때 BottomButton */}
      {showSignupFlow && userType && !showSignupAgreementModal && !showUserTypeBottomSheet && (
        <div className="fixed inset-0 flex items-end justify-center z-10 pointer-events-none">
          <div className="w-full max-w-[500px] mx-10 px-5 mb-5 pointer-events-auto">
            <BottomButton
              type="1button"
              button1Text="확인"
              onButton1Click={() => setShowSignupAgreementModal(true)}
              className="bg-white"
            />
          </div>
        </div>
      )}

      {/* 로그인하는 경우: 중복된 전화번호 BottomSheet */}
      <BottomSheet
        isOpen={showDuplicateBottomSheet}
        onClose={() => setShowDuplicateBottomSheet(false)}
        title=""
        buttonArea={
          <div className="flex flex-col items-center">
            <div className="py-3">
              <ChildIcon />
            </div>
            <div className="flex flex-col gap-1 pt-2 px-5 items-center">
              <div className="text-[20px]/[28px] font-700 text-center">
                <span className="text-blue-600">{watchedPhoneNumber}</span>님
                <br />
                반가워요, 또 뵙네요!
              </div>
              <div className="font-400 text-center text-[16px]/[24px] text-gray-500">
                안전한 로그인을 위해 휴대폰 번호가 맞는지
                <br />
                한 번 더 확인해주세요.
              </div>
            </div>
            <div className="w-full px-5 pb-5">
              <BottomButton
                type="1button"
                button1Text="로그인하기"
                onButton1Click={async () => {
                  try {
                    const userId = await signin({
                      phoneNumber: watchedPhoneNumber,
                    });
                    console.log("로그인 성공:", userId);
                    router.replace("/");
                  } catch (error) {
                    console.error("로그인 실패:", error);
                    alert("로그인 중 오류가 발생했습니다.");
                  }
                  setShowDuplicateBottomSheet(false);
                }}
              />
            </div>
          </div>
        }
      />

      {/* 업체 유형 선택 BottomSheet */}
      <BottomSheet
        isOpen={showUserTypeBottomSheet}
        title="업체 유형을 선택해 주세요"
        onClose={() => setShowUserTypeBottomSheet(false)}
        children={
          <>
            <div className="flex gap-3 py-5">
              <CompanyTypeButton
                text="인테리어 업체"
                icon={<PaintBruchVertical />}
                onClick={() => handleTypeSelect("company")}
              />
              <CompanyTypeButton
                text="자재 공장"
                icon={<Factory />}
                onClick={() => handleTypeSelect("factory")}
              />
            </div></>

        }
      />

      {/* 회원가입 동의 Modal */}
      <Modal isOpen={showSignupAgreementModal} onClose={() => setShowSignupAgreementModal(false)}>
        <div className="flex flex-col gap-5">
          <h2 className="text-lg font-bold text-gray-800">
            바로가구 회원가입에 <br />꼭 필요한 동의만 추렸어요
          </h2>
          <div>
            <div className="text-sm text-gray-400">필수 동의 총 2개</div>

            <div className="border-1 ml-3 mt-2 flex flex-col gap-3 border-l-[4px] border-[#E2E2E2] pl-3">
              <div className="flex items-center justify-between">
                <p>
                  <span className="font-semibold text-brand-500">필수 </span>
                  <span className="text-gray-700">서비스 이용 동의</span>
                </p>
                <Image
                  src="/icons/Arrow_Right.svg"
                  width={20}
                  alt="왼쪽 더보기 버튼"
                  height={20}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <p>
                  <span className="font-semibold text-brand-500">필수 </span>
                  <span className="text-gray-700">개인정보 수집 및 이용 동의</span>
                </p>
                <Image
                  src="/icons/Arrow_Right.svg"
                  width={20}
                  alt="왼쪽 더보기 버튼"
                  height={20}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <BottomButton
              className=""
              type="1button"
              button1Text="모두 동의하고 회원가입"
              onButton1Click={handleSignup}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PhoneLoginPage;
