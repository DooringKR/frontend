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
import { getScreenName } from "@/utils/screenName";
import { trackClick } from "@/services/analytics/amplitude";
import useCartItemStore from "@/store/cartItemStore";

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
        useCartItemStore.setState({ cartItems: [] });

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
    <div className="flex min-h-screen flex-col pt-[60px]">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H16V9C16 7.93913 15.5783 6.92202 14.8281 6.17188C14.078 5.42173 13.0609 5 12 5C10.9391 5 9.92202 5.42173 9.17188 6.17188C8.42173 6.92202 8 7.93913 8 9V12H5V9C5 7.14349 5.73705 5.36256 7.0498 4.0498C8.36256 2.73705 10.1435 2 12 2C13.8565 2 15.6374 2.73705 16.9502 4.0498C18.2629 5.36256 19 7.14348 19 9V12Z" fill="#D1D5DC" />
            <path d="M12 19C11.1716 19 10.5 19.6716 10.5 20.5C10.5 21.3284 11.1716 22 12 22V19ZM15 20.5V22C15.3978 22 15.7794 21.842 16.0607 21.5607L15 20.5ZM12 20.5V22H15V20.5V19H12V20.5ZM15 20.5L16.0607 21.5607L20.0607 17.5607L19 16.5L17.9393 15.4393L13.9393 19.4393L15 20.5Z" fill="#D1D5DC" />
            <path d="M6 9C7.10457 9 8 9.89543 8 11V16C8 17.1046 7.10457 18 6 18H5C3.34315 18 2 16.6569 2 15V12C2 10.3431 3.34315 9 5 9H6ZM19 9C20.6569 9 22 10.3431 22 12V15C22 16.6569 20.6569 18 19 18H18C16.8954 18 16 17.1046 16 16V11C16 9.89543 16.8954 9 18 9H19Z" fill="#44BE83" />
          </svg>
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
            trackClick({
              object_type: "button",
              object_name: "logout",
              current_page: getScreenName(),
              modal_name: null,
            });
            console.log("로그아웃");
            supabase.auth.signOut();
            useBizClientStore.setState({ bizClient: null });
            useCartStore.setState({ cart: null });
            useCartItemStore.setState({ cartItems: [] });
            router.replace("/start");
          }}
        />
        <Button
          className="w-[80px]"
          text="탈퇴하기"
          type={"GrayMedium"}
          onClick={() => {
            trackClick({
              object_type: "button",
              object_name: "withdraw",
              current_page: getScreenName(),
              modal_name: null,
            });
            handleWithdrawClick();
          }}
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
