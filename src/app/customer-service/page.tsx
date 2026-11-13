"use client";

import { CUSTOMER_SERVICE_PAGE } from "@/constants/pageName";
import { useEffect } from "react";

import Notice from "@/components/state/Notice";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ContactStatusChip from "./components/contactStatusChip";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function CustomerServicePage() {
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
            <a
              href="tel:0315284002"
              className="flex justify-between py-[10px]"
              onClick={() =>
                trackClick({
                  object_type: "button",
                  object_name: "call",
                  current_page: getScreenName(),
                  modal_name: null,
                })
              }
            >
              <div className="flex gap-2">
                <img src={"/icons/phone.svg"} alt="전화기 아이콘" />
                <span className="text-[17px] font-600">전화 문의</span>
              </div>
              <ContactStatusChip isContactAvailable={false} />
            </a>
            <a
              href="https://pf.kakao.com/_BlAHG"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between py-[10px]"
              onClick={() =>
                trackClick({
                  object_type: "button",
                  object_name: "kakaotalkchannel",
                  current_page: getScreenName(),
                  modal_name: null,
                })
              }
            >
              <div className="flex gap-2">
                <img src={"/icons/kakaoTalk.svg"} alt="카카오톡 아이콘" />
                <span className="text-[17px] font-600">카카오톡 채널</span>
              </div>
              <ContactStatusChip isContactAvailable />
            </a>
          </div>
        </div>
        <div className="px-5 pb-10">
          <Notice tone="gray" title="전화 문의 ∙ 카카오톡 채널 바로 연결 운영 시간">
            <p>∙ 평일, 토요일 : 09~18시</p>
            <p>∙ 일요일, 공휴일은 운영하지 않아요.</p>
            <p className="mt-2">운영 시간이 아니어도 바로가구와 연락할 수 있어요. 조금 느리더라도 양해해주세요.</p>
          </Notice>
        </div>
      </div>
    </>
  );
}

export default CustomerServicePage;
