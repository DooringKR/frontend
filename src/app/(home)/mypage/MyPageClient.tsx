"use client";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useUserStore from "@/store/userStore";

import Footer from "../_components/Footer";
import Button from "@/components/Button/Button";
import { logout } from "@/api/authApi";
import { useRouter } from "next/navigation";

function MyPageClient() {
  const router = useRouter();
  const { id, userType, user_phoneNumber, cart_id } = useUserStore();

  if (!user_phoneNumber) {
    return <div>로그인이 필요합니다</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="마이페이지" page="mypage" />
      <div className="flex flex-1 flex-col px-5 pt-5">
        <h3 className="mb-[5px] text-sm font-400 text-gray-600">가입한 휴대폰 번호</h3>
        {/* 나중에 || 는 삭제 필요 */}
        <h3 className="text-[23px] font-700 text-gray-900">
          {user_phoneNumber || "010-1111-1111"}
        </h3>

        {/* 테스트용: 모든 UserStore 정보 표시 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-600 text-gray-700 mb-3">🔍 UserStore 정보 (테스트용)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-500">{id || "null"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User Type:</span>
              <span className="font-500">{userType || "null"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-500">{user_phoneNumber || "null"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cart ID:</span>
              <span className="font-500">{cart_id || "null"}</span>
            </div>
          </div>
        </div>

        <div className="h-[20px]"></div>
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
      </div>
      <div className="h-[60px]"></div>
      <Footer />
    </div>
  );
}

export default MyPageClient;
