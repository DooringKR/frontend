"use client";

import { logout } from "@/api/authApi";
import { MY_PAGE } from "@/constants/pageName";
import { useRouter } from "next/navigation";
import HeadphonesIcon from "public/icons/Headphones";

import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Button from "@/components/Button/Button";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useUserStore from "@/store/userStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

const USER_TYPE_LABELS: Record<string, string> = {
  INTERIOR: "인테리어 업체",
  FACTORY: "공장",
};

function MyPageClient() {
  const router = useRouter();
  const { id, userType, user_phoneNumber, cart_id } = useUserStore();

  if (!user_phoneNumber) {
    return <div>로그인이 필요합니다</div>;
  }

  const onCustomerServiceClick = () => {
    router.push("/customer-service");
  };

  const onOpenSourceLicenseClick = () => {
    router.push("/customer-service/license");
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
              <h3 className="text-gray-500">{formatPhoneNumber(user_phoneNumber)}</h3>
            </div>
            <div className="flex justify-between py-[10px]">
              <h3 className="text-gray-700">업체 유형</h3>
              <h3 className="text-gray-500"> {userType ? USER_TYPE_LABELS[userType] : ""}</h3>
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
            logout();
            router.replace("/login");
          }}
        />
        <Button
          className="w-[80px]"
          text="탈퇴하기"
          type={"GrayMedium"}
          onClick={() => {
            console.log("로그아웃");
            router.replace("/login");
          }}
        />
      </div>
      <BottomNavigation />
    </div>
  );
}

export default MyPageClient;
