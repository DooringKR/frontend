"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { HARDWARE_CATEGORY_LIST } from "@/constants/category";

function HardwarePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [manufacturer, setManufacturer] = useState("");
  const [size, setSize] = useState("");
  const [request, setRequest] = useState("");


  const category = searchParams.get("category") ?? "";
  // category(slug)에 맞는 header 값 찾기
  const currentCategory = HARDWARE_CATEGORY_LIST.find(item => item.slug === category);
  const headerTitle = currentCategory?.header || category;


  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`${headerTitle} 종류를 선택해주세요`} />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedInput
          type="text"
          label="제조사"
          placeholder="제조사를 입력해주세요"
          value={manufacturer}
          onChange={e => {
            setManufacturer(e.target.value);
          }}
        />
        <BoxedInput
          type="number"
          label="사이즈(mm)"
          placeholder="사이즈를 입력해주세요"
          value={size}
          onChange={e => {
            setSize(e.target.value);
          }}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <BottomButton
        type={"1button"}
        button1Text={"다음"}
        className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5 bg-white"
        button1Disabled={
          manufacturer === "" || size === ""
        }
        onButton1Click={() => {
          const params = new URLSearchParams(searchParams);
          params.set("manufacturer", manufacturer);
          params.set("size", size);
          params.set("request", request);
          router.push(`/order/hardware/confirm?${params.toString()}`);
        }}
      />
    </div>
  );
}

export default HardwarePage;
