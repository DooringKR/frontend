"use client";

import { HARDWARE_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { HardwareCart, useSingleCartStore } from "@/store/singleCartStore";

function HardwarePageContent() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const category = useSingleCartStore(state => (state.cart as HardwareCart).category);

  const [hardware_madeby, setHardware_madeby] = useState(
    useSingleCartStore(state => (state.cart as HardwareCart).hardware_madeby) ?? "",
  );
  const [hardware_size, setHardware_size] = useState(
    useSingleCartStore(state => (state.cart as HardwareCart).hardware_size) ?? "",
  );
  const [request, setRequest] = useState(
    useSingleCartStore(state => (state.cart as HardwareCart).request) ?? "",
  );
  const setCart = useSingleCartStore(state => state.setCart);

  // const category = searchParams.get("category") ?? "";
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
          value={hardware_madeby}
          onChange={e => {
            setHardware_madeby(e.target.value);
          }}
        />
        <BoxedInput
          type="number"
          label="사이즈(mm)"
          placeholder="사이즈를 입력해주세요"
          value={hardware_size}
          onChange={e => {
            setHardware_size(e.target.value);
          }}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div id="hardware-next-button">
        <BottomButton
          type={"1button"}
          button1Text={"다음"}
          className="fixed bottom-0 w-full max-w-[460px]"
          button1Disabled={hardware_madeby === "" || hardware_size === ""}
          onButton1Click={() => {
            setCart({
              type: "hardware",
              category: category ?? null,
              hardware_madeby: hardware_madeby,
              hardware_size: hardware_size,
              request: request ?? null,
            });
            router.push(`/order/hardware/confirm`);
          }}
        />
      </div>
    </div>
  );
}

function HardwarePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HardwarePageContent />
    </Suspense>
  );
}

export default HardwarePage;
