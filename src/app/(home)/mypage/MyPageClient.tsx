"use client";

import { useState } from "react";
import Link from "next/link";
import { MY_PAGE } from "@/constants/pageName";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import { EmptyState } from "@/components/state/StateViews";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import useBizClientStore from "@/store/bizClientStore";
import { supabase } from "@/lib/supabase";
import useCartStore from "@/store/cartStore";

import { WithdrawAccountUsecase } from "@/DDD/usecase/withdraw_account_usecase";
import { getScreenName } from "@/utils/screenName";
import { trackClick } from "@/services/analytics/amplitude";
import useCartItemStore from "@/store/cartItemStore";
import { Button } from "@/components/ui/button";

/** 로그아웃·탈퇴 뒤 이 기기에 남은 로그인 정보 비우기 */
function clearLocalSession() {
  useBizClientStore.setState({ bizClient: null });
  useCartStore.setState({ cart: null });
  useCartItemStore.setState({ cartItems: [] });
}

function MyPageClient() {
  const router = useRouter();
  const bizClient = useBizClientStore(state => state.bizClient);

  // 확인 시트 — 로그아웃·탈퇴는 되돌릴 수 없어 한 번 묻는다(탈퇴는 글자까지 쳐야 눌림)
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  if (!bizClient) {
    return (
      <div className="flex min-h-screen flex-col pt-[60px]">
        <TopNavigator title="전체" page={MY_PAGE} />
        <EmptyState text="로그인이 필요해요" action={{ label: "로그인", onClick: () => router.push("/start") }} />
      </div>
    );
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("로그아웃하지 못했어요. 다시 시도해주세요.");
    clearLocalSession();
    router.replace("/start");
  };

  const withdraw = async () => {
    if (!bizClient.id) throw new Error("사용자 정보를 찾을 수 없어요.");
    const result = await new WithdrawAccountUsecase().execute(bizClient.id);
    if (!result.success) throw new Error(result.message || "탈퇴하지 못했어요. 잠시 후 다시 시도해주세요.");
    await supabase.auth.signOut();
    clearLocalSession();
    toast.success("회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
    router.replace("/start");
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
        <Link
          href="https://witty-sundae-3d1.notion.site/305b6a70ff3980a5b2a2ffb5f4694b89"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit cursor-pointer gap-3 py-[10px] hover:opacity-80"
        >
          <img src={"/icons/list-paper.svg"} alt="문서 아이콘" />
          <h3>환불규정</h3>
        </Link>
        <Link
          href="https://witty-sundae-3d1.notion.site/306b6a70ff3980af8654d941e2d34156?source=copy_link"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit cursor-pointer gap-3 py-[10px] hover:opacity-80"
        >
          <img src={"/icons/list-paper.svg"} alt="문서 아이콘" />
          <h3>배송규정</h3>
        </Link>
        <Link href="/customer-service/license" className="flex w-fit cursor-pointer gap-3 py-[10px] hover:opacity-80">
          <img src={"/icons/list-paper.svg"} alt="문서 아이콘" />
          <h3>오픈소스 라이선스 보기</h3>
        </Link>
      </div>

      <div className="mb-[80px] flex gap-5 px-5">
        <Button variant="secondary" size="md" onClick={() => {
            trackClick({
              object_type: "button",
              object_name: "logout",
              current_page: getScreenName(),
              modal_name: null,
            });
            setLogoutOpen(true);
          }} className="w-[80px]">로그아웃</Button>
        <Button variant="secondary" size="md" onClick={() => {
            trackClick({
              object_type: "button",
              object_name: "withdraw",
              current_page: getScreenName(),
              modal_name: null,
            });
            setWithdrawOpen(true);
          }} className="w-[80px]">탈퇴하기</Button>
      </div>

      <ConfirmSheet
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="로그아웃할까요?"
        confirmLabel="로그아웃"
        onConfirm={logout}
      />
      <ConfirmSheet
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        title="정말 탈퇴하시겠어요?"
        description="계정 정보·장바구니 내역·저장된 주소가 바로 삭제되고 복구할 수 없어요. 진행 중인 주문이 있다면 완료 후 탈퇴해주세요. 같은 계정으로 바로 다시 가입할 수 있어요. 아래에 「탈퇴하기」를 입력해주세요."
        confirmLabel="탈퇴하기"
        confirmText="탈퇴하기"
        destructive
        onConfirm={withdraw}
      />

      {/* 시트가 열려 있을 때는 BottomNavigation 숨김 */}
      {!logoutOpen && !withdrawOpen && <BottomNavigation />}
    </div>
  );
}

export default MyPageClient;
