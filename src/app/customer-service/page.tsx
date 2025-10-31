"use client";

import { CUSTOMER_SERVICE_PAGE } from "@/constants/pageName";
import { useEffect, useState } from "react";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ContactStatusChip from "./components/contactStatusChip";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import { track } from "@amplitude/analytics-browser";

function CustomerServicePage() {
  const [isContactAvailable, setIsContactAvailable] = useState(true);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName('customer_service');
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);
  return (
    <>
    <div className="pt-[60px]"></div>
      <TopNavigator page={CUSTOMER_SERVICE_PAGE} />
      <div className="flex min-h-screen flex-col">
        {/* Amplitude 초기화 (클라이언트 전용) */}
        <InitAmplitude />
        <div className="px-5 pt-5">
          <div className="flex flex-col gap-4">
            <img src={"/icons/human.svg"} alt="사람 아이콘" className="h-[60px] w-[60px]" />
            <h1 className="text-[23px] font-700">
              바로가구입니다. <br />
              무엇을 도와드릴까요?
            </h1>
          </div>
          <div className="pb-[100px] pt-10">
            <div
              className="flex cursor-pointer justify-between py-[10px]"
              onClick={() => {
                window.open("tel:031-528-4002", "_blank");
                trackClick({
                  object_type: "button",
                  object_name: "call",
                  current_page: getScreenName(),
                  modal_name: null,
                });
              }}
            >
              <div className="flex gap-2">
                <img src={"/icons/phone.svg"} alt="전화기 아이콘" />
                <span className="text-[17px] font-600">전화 문의</span>
              </div>
              <ContactStatusChip isContactAvailable={false} />
            </div>
            <div
              className="flex cursor-pointer justify-between py-[10px]"
              onClick={() => {
                window.open(
                  "https://pf.kakao.com/_BlAHG",
                  "_blank",
                );

                trackClick({
                  object_type: "button",
                  object_name: "kakaotalkchannel",
                  current_page: getScreenName(),
                  modal_name: null,
                });
              }}
            >
              <div className="flex gap-2">
                <img src={"/icons/kakaoTalk.svg"} alt="카카오톡 아이콘" />
                <span className="text-[17px] font-600">카카오톡 채널</span>
              </div>
              <ContactStatusChip isContactAvailable={isContactAvailable} />
            </div>
          </div>
        </div>
        <div className="h-full grow bg-gray-50 px-5 py-5 font-400 text-gray-500">
          <h4>전화 문의 ∙ 카카오톡 채널 바로 연결 운영 시간</h4>
          <h5>∙ 평일, 토요일 : 09~18시 </h5>
          <h5>∙ 일요일, 공휴일은 운영하지 않아요.</h5>
          <br />
          <p>* 운영 시간이 아니어도 바로가구와 연락할 수 있어요. 조금 느리더라도 양해해주세요.</p>
        </div>
      </div>
    </>
  );
}

export default CustomerServicePage;
