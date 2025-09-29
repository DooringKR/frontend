"use client";

import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { AccessoryCart, useSingleCartStore } from "@/store/singleCartStore";

function AccessoryPageContent() {
  const router = useRouter();
  // const searchParams = useSearchParams();

  const category = useSingleCartStore(state => (state.cart as AccessoryCart).category);

  const [accessory_madeby, setAccessory_madeby] = useState(
    useSingleCartStore(state => (state.cart as AccessoryCart).accessory_madeby) ?? "",
  );
  const [accessory_model, setAccessory_model] = useState(
    useSingleCartStore(state => (state.cart as AccessoryCart).accessory_model) ?? "",
  );
  const [request, setRequest] = useState(
    useSingleCartStore(state => (state.cart as AccessoryCart).request) ?? "",
  );

  const setCart = useSingleCartStore(state => state.setCart);

  // const category = searchParams.get("category") ?? "";
  // category(slug)에 맞는 header 값 찾기
  const currentCategory = ACCESSORY_CATEGORY_LIST.find(item => item.slug === category);
  const headerTitle = currentCategory?.type || category;

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`${headerTitle} 종류를 선택해주세요`} />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedInput
          type="text"
          label="제조사"
          placeholder="제조사를 입력해주세요"
          value={accessory_madeby}
          onChange={e => {
            setAccessory_madeby(e.target.value);
          }}
        />
        <BoxedInput
          type="text"
          label="모델명"
          placeholder="모델명을 입력해주세요"
          value={accessory_model}
          onChange={e => {
            setAccessory_model(e.target.value);
          }}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div id="accessory-next-button">
        <BottomButton
          type={"1button"}
          button1Text={"다음"}
          className="fixed bottom-0 w-full max-w-[460px]"
          button1Disabled={accessory_madeby === "" || accessory_model === ""}
          onButton1Click={() => {
            setCart({
              type: "accessory",
              category: category ?? null,
              accessory_madeby: accessory_madeby,
              accessory_model: accessory_model,
              request: request ?? null,
            });
            router.push(`/order/accessory/confirm`);
          }}
        />
      </div>
    </div>
  );
}

function AccessoryPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AccessoryPageContent />
    </Suspense>
  );
}

export default AccessoryPage;
