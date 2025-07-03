"use client";

import { useRouter } from "next/navigation";
import Factory from "public/icons/factory";
import KakaoIcon from "public/icons/kakao";
import PaintBruchVertical from "public/icons/paintbrush_vertical";
import React, { useState } from "react";

import AddressIndicator from "@/components/AddressIndicator/AddressIndicator";
import Banner from "@/components/Banner/Banner";
import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import CompanyTypeButton from "@/components/Button/CompanyTypeButton";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import DoorPreview from "@/components/DoorPreview/DoorPreview";
import GradientText from "@/components/GradientEffectText/GradientEffectText";
import GradientEffectText from "@/components/GradientEffectText/GradientEffectText";
import Header from "@/components/Header/Header";
import HomeNavigator from "@/components/HomeNavigator/HomeNavigator";
import HomeProductContainer from "@/components/HomeProductContaines/HomeProductContainer";
import BoxedInput from "@/components/Input/BoxedInput";
import UnderlinedInput from "@/components/Input/UnderlinedInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import BoxedSelect from "@/components/Select/BoxedSelect";
import UnderlinedSelect from "@/components/Select/UnderlinedSelect";
import SwitchDemo from "@/components/Switches/Switches";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

// SectionWrapper 컴포넌트 추가
const SectionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-4 flex flex-col gap-2 rounded border-2 p-4">
    <h2 className="mb-2 text-xl font-semibold">{title}</h2>
    {children}
  </section>
);

const Page = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [segmentValue, setSegmentValue] = useState(0);

  // UnderlinedSelect & BottomSheet 연동 상태
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const selectOptions = [
    { value: "company", label: "인테리어 업체" },
    { value: "factory", label: "자재 공장" },
  ];

  const handleSelect = (value: string) => {
    setSelectValue(value);
    setIsBottomSheetOpen(false);
  };

  const handleChange = (value: string) => {
    setValue(value);
    setError(value.length < 3 ? "3글자 이상 입력하세요." : undefined);
  };

  const router = useRouter();

  return (
    <div className="flex flex-col gap-10 p-5">
      <h1 className="mb-4 text-2xl font-bold">컴포넌트 쇼케이스</h1>
      <SectionWrapper title="Underlined Inputs">
        <UnderlinedInput
          label={"예시레이블"}
          value={value}
          onChange={handleChange}
          error={!!error}
          helperText={error}
        />
      </SectionWrapper>
      <SectionWrapper title="Headers">
        <Header size="Large" title="Large 헤더 타이틀" subtitle="라지 헤더 서브 타이틀" />
        <Header size="Medium" title="Medium 헤더 타이틀" subtitle="미디엄 헤더 서브 타이틀" />
      </SectionWrapper>
      <SectionWrapper title="Top Navigations">
        <TopNavigator title="탑 네비게이터" />
        <TopNavigator />
      </SectionWrapper>
      <SectionWrapper title="Underlined Selects & Bottom Sheets & Company Type Buttons Comboes">
        <div>
          pc와 모바일 모두 bottom sheet의 좌우 마진이 생기는 게 안되네요. 일단 모바일에서만 좌우
          마진이 생기도록 했습니다.
        </div>
        <UnderlinedSelect
          label="옵션 선택"
          options={selectOptions}
          value={selectValue}
          onChange={handleSelect}
          onClick={() => setIsBottomSheetOpen(true)}
        />
        <BottomSheet
          isOpen={isBottomSheetOpen}
          title="업체 유형을 선택해주세요"
          description="업체 유형 선택 서브 타이틀"
          onClose={() => setIsBottomSheetOpen(false)}
        >
          <div className="flex gap-3 py-5">
            <CompanyTypeButton
              text={"인테리어 업체"}
              icon={<PaintBruchVertical />}
              onClick={() => handleSelect("company")}
            />
            <CompanyTypeButton
              text={"자재 공장"}
              icon={<Factory />}
              onClick={() => handleSelect("factory")}
            />
          </div>
        </BottomSheet>
      </SectionWrapper>
      <SectionWrapper title="Buttons">
        <Button type={"Brand"} text={"Brand"} />
        <Button type={"GrayLarge"} text={"GrayLarge"} />
        <Button type={"OutlinedLarge"} text={"OutlinedLarge"} icon={<KakaoIcon />} />
        <Button type={"BrandInverse"} text={"BrandInverse"} />
        <Button type={"GrayMedium"} text={"GrayMedium"} />
        <Button type={"OutlinedMedium"} text={"OutlinedMedium"} />
      </SectionWrapper>
      <SectionWrapper title="Bottom Button Comboes">
        <BottomButton
          type="1button"
          button1Text="레이블1"
          onButton1Click={() => alert("레이블1 클릭!")}
        />
        <BottomButton
          type="2buttons"
          button1Text="레이블2"
          button2Text="레이블3"
          onButton1Click={() => alert("레이블2 클릭!")}
          onButton2Click={() => alert("레이블3 클릭!")}
          button1Type="GrayLarge"
        />
        <BottomButton
          type="textcombo+button"
          button1Text="레이블4"
          textComboText={{ title: "타이틀", subtitle: "서브타이틀" }}
          onButton1Click={() => alert("레이블4 클릭!")}
        />
      </SectionWrapper>
      <SectionWrapper title="Boxed Inputs">
        <BoxedInput
          label={"예시레이블"}
          value={value}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          placeholder="placeholder 텍스트"
        />
      </SectionWrapper>
      <SectionWrapper title="Shopping Cart Cards(Steppers, Door Preview Icons 포함)">
        <ShoppingCartCard
          title={""}
          color={""}
          width={""}
          height={""}
          hingeCount={0}
          hingeDirection={""}
          boring={""}
          quantity={0}
          trashable={false}
        />
        <Button
          type={"Brand"}
          text={"쇼핑카트 화면에서 확인"}
          onClick={() => router.push("/shopping-cart")}
        />
      </SectionWrapper>
      <SectionWrapper title="Select Toggle Button">
        <SelectToggleButton
          label={"레이블"}
          checked={true}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <SelectToggleButton
          label={"레이블"}
          checked={false}
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <SelectToggleButton
          imageSrc="/img/color-list/hansol-cream-white.png"
          label={"레이블"}
          checked={true}
          description="설명 텍스트"
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <SelectToggleButton
          imageSrc="/img/color-list/hansol-cream-white.png"
          label={"레이블"}
          checked={false}
          description="설명 텍스트"
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </SectionWrapper>
      <SectionWrapper title="Segmented Controls">
        <SegmentedControl
          options={["옵션1", "옵션2"]}
          value={segmentValue}
          onChange={setSegmentValue}
        />
      </SectionWrapper>
      <SectionWrapper title="Door Preview(Boring Input Fields 포함)">
        <div></div>
      </SectionWrapper>
      <DoorPreview
        DoorWidth={100}
        DoorHeight={200}
        boringDirection="left"
        boringNum={3}
        boringSize={[]}
      />
      <SectionWrapper title="Boxed Selects">
        <BoxedSelect
          options={[]}
          value={""}
          onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          label="박스형 셀렉트"
        />
        <BoxedSelect
          options={[]}
          value={""}
          error="잘못된 입력"
          onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          label="박스형 셀렉트(오류 발생 시)"
        />
      </SectionWrapper>
      <SectionWrapper title="Switches">
        <SwitchDemo />
      </SectionWrapper>
      <SectionWrapper title="Home Product Containes">
        <HomeProductContainer />
      </SectionWrapper>
      <SectionWrapper title="Home Navigator">
        <HomeNavigator />
      </SectionWrapper>
      <SectionWrapper title="Banner">
        PC에서 매끄럽게 슬라이드 되지 않는 문제가 있습니다. 원인을 찾아보고 수정해야 합니다.
        <Banner />
      </SectionWrapper>
      <SectionWrapper title="Gradient Effect Text">
        <GradientEffectText text="주소를 입력해주세요." />
      </SectionWrapper>
      <SectionWrapper title="Address Indicator">
        주소 입력 & 오늘 배송
        <AddressIndicator
          address="서울시 강남구 역삼동 123-45"
          deliverySchedule="today"
          timeLimit="1시간 10분 내 주문시"
        />
        주소 입력 & 내일 배송
        <AddressIndicator
          address="서울시 강남구 역삼동 123-45"
          deliverySchedule="tomorrow"
          timeLimit="밤 12시 전 주문시"
        />
        주소 입력 & 내일 영업일 X
        <AddressIndicator
          address="서울시 강남구 역삼동 123-45"
          deliverySchedule="other"
          timeLimit="12/24(일) 밤 12시 전 주문시"
          arrivalDate="12/25(월)"
        />
        주소 미입력
        <AddressIndicator address="" deliverySchedule="" timeLimit="" arrivalDate="" />
      </SectionWrapper>
    </div>
  );
};

export default Page;
