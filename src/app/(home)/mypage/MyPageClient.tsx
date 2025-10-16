"use client";

import { useState } from "react";
import { MY_PAGE } from "@/constants/pageName";
import { useRouter } from "next/navigation";
import HeadphonesIcon from "public/icons/Headphones";

import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Button from "@/components/Button/Button";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import useBizClientStore from "@/store/bizClientStore";
import { supabase } from "@/lib/supabase";
import useCartStore from "@/store/cartStore";

import WithdrawModal from "./_components/WithdrawModal";
import WithdrawConfirmModal from "./_components/WithdrawConfirmModal";
import { WithdrawAccountUsecase } from "@/DDD/usecase/withdraw_account_usecase";

function MyPageClient() {
  const router = useRouter();
  const bizClient = useBizClientStore(state => state.bizClient);

  // 모달 상태 관리
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (!bizClient) {
    return <div>로그인이 필요합니다</div>;
  }

  const onCustomerServiceClick = () => {
    router.push("/customer-service");
  };

  const onOpenSourceLicenseClick = () => {
    router.push("/customer-service/license");
  };

  // 탈퇴 플로우 시작
  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  // 1차 확인 후 → 최종 확인으로
  const handleWithdrawConfirm = () => {
    setShowWithdrawModal(false);
    setShowConfirmModal(true);
  };

  // 최종 탈퇴 처리
  const handleFinalWithdraw = async () => {
    if (!bizClient?.id) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    setIsWithdrawing(true);

    try {
      const usecase = new WithdrawAccountUsecase();
      const result = await usecase.execute(bizClient.id);

      if (result.success) {
        // 로컬 상태 정리
        await supabase.auth.signOut();
        useBizClientStore.setState({ bizClient: null });
        useCartStore.setState({ cart: null });

        // 시작 페이지로 이동
        alert("회원 탈퇴가 완료되었습니다.\n그동안 이용해주셔서 감사합니다.");
        router.replace("/start");
      } else {
        alert(result.message);
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error("탈퇴 처리 오류:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="전체" page={MY_PAGE} />
      <div className="flex flex-col px-5 pt-5">
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex items-center justify-center">
            <div className="w-fit rounded-full border border-gray-200 p-4">
              <img src={"/icons/human.svg"} alt="사람 얼굴 아이콘" className="h-10 w-10" />
            </div>
          </div>
          <div className="text-[17px] font-500">
            <div className="flex justify-between py-[10px]">
              <h3 className="text-gray-700">휴대폰 번호</h3>
              <h3 className="text-gray-500">{formatPhoneNumber(bizClient.phone_number)}</h3>
            </div>
            <div className="flex justify-between py-[10px]">
              <h3 className="text-gray-700">업체 유형</h3>
              <h3 className="text-gray-500"> {bizClient.business_type}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="h-5 bg-gray-50"></div>

      <div className="p-5 text-[17px] font-500 text-gray-700">
        <div className="flex w-fit cursor-pointer gap-3 py-[10px]" onClick={onCustomerServiceClick}>
          <HeadphonesIcon />
          <h3>고객센터</h3>
        </div>
        <div
          className="flex w-fit cursor-pointer gap-3 py-[10px]"
          onClick={onOpenSourceLicenseClick}
        >
          <img src={"/icons/list-paper.svg"} alt="문서 아이콘" />
          <h3>오픈소스 라이선스 보기</h3>
        </div>
      </div>

      <div className="mb-[80px] flex gap-5 px-5">
        <Button
          className="w-[80px]"
          text="로그아웃"
          type={"GrayMedium"}
          onClick={() => {
            console.log("로그아웃");
            supabase.auth.signOut();
            useBizClientStore.setState({ bizClient: null });
            useCartStore.setState({ cart: null });
            router.replace("/start");
          }}
        />
        <Button
          className="w-[80px]"
          text="탈퇴하기"
          type={"GrayMedium"}
          onClick={handleWithdrawClick}
        />
      </div>

      {/* 탈퇴 모달들 */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdrawConfirm}
      />

      <WithdrawConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalWithdraw}
        isLoading={isWithdrawing}
      />

      {/* 모달이 열려있을 때는 BottomNavigation 숨김 */}
      {!showWithdrawModal && !showConfirmModal && <BottomNavigation />}
    </div>
  );
}

export default MyPageClient;
