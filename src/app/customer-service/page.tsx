"use client";

import { CUSTOMER_SERVICE_PAGE } from "@/constants/pageName";
import { useState } from "react";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ContactStatusChip from "./components/contactStatusChip";

function CustomerServicePage() {
  const [isContactAvailable, setIsContactAvailable] = useState(true);

  return (
    <>
      <TopNavigator page={CUSTOMER_SERVICE_PAGE} />
      <div className="flex min-h-screen flex-col">
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
                window.open("tel:010-9440-1874", "_blank");
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
