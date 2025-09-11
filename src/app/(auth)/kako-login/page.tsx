"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function KakaoLoginPage() {
    return (
        <div className="flex h-screen w-full flex-col justify-start bg-white">
            <TopNavigator title="카카오 로그인" />
            <div className="flex flex-col items-center justify-center">
                <div>화면 중앙에 카카오 로그인 버튼 추가</div>
                <BottomButton
                    type="1button"
                    button1Text="카카오 로그인"
                    onButton1Click={() => alert("카카오 로그인 클릭!")}
                />
            </div>
        </div>
    );
}

export default KakaoLoginPage;