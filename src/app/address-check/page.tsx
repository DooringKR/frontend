"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function AddressPage() {
  return (
    <div>
      <TopNavigator title="주소 입력" />
      <Header
        title={
          <>
            배송받을 주소를 <br />
            입력해주세요
          </>
        }
        size="Large"
      />
      <div className="gap-2 px-[20px] pt-[20px]">
        <BoxedInput label={"주소"} placeholder="건물, 지번 또는 도로명 검색" />
        <BoxedInput placeholder="상세주소 (예: 101동 501호 / 단독주택)" />
      </div>
      <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2">
        <BottomButton type="1button" button1Text="다음" button1Type="Brand" />
      </div>
    </div>
  );
}

export default AddressPage;
