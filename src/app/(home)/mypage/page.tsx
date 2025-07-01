import TopNavigator from "@/components/TopNavigator/TopNavigator";

import Footer from "../_components/Footer";

interface MyPageProps {
  userPhone: number;
}

export default function MyPage({ userPhone }: MyPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="마이페이지" page="mypage" />
      <div className="flex flex-1 flex-col px-5 pt-5">
        <h3 className="mb-[5px] text-sm font-400 text-gray-600">가입한 휴대폰 번호</h3>
        {/* 나중에 || 는 삭제 필요 */}
        <h3 className="text-[23px] font-700 text-gray-900">{userPhone || "010-1111-1111"}</h3>
      </div>
      <Footer />
    </div>
  );
}
