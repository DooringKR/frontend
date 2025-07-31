"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { DoorCart, useSingleCartStore } from "@/store/singleCartStore";

import DrawerDoorForm from "./_components/DrawerDoorForm";
import FlapDoorForm from "./_components/FlapDoorForm";
// Components
import NormalDoorForm from "./_components/NormalDoorForm";
// Hooks
import { useDoorValidation } from "./hooks/useDoorValidation";

function DoorPageContent() {
  const router = useRouter();

  // store에서 현재 상태 가져오기
  const currentCart = useSingleCartStore(state => state.cart) as DoorCart;

  // 초기값을 store에서 읽어오기
  const [boringNum, setBoringNum] = useState<2 | 3 | 4>(currentCart?.boringNum || 2);
  const [boringDirection, setBoringDirection] = useState<"left" | "right">(
    (currentCart?.boringDirection as "left" | "right") || "left",
  );
  const [DoorWidth, setDoorWidth] = useState<number | null>(currentCart?.width ?? null);
  const [DoorHeight, setDoorHeight] = useState<number | null>(currentCart?.height ?? null);

  // boringSize 초기값 설정
  const [boringSize, setBoringSize] = useState<(number | null)[]>(currentCart?.boringSize ?? []);

  const [request, setRequest] = useState(currentCart?.request ?? "");

  const category = useSingleCartStore(state => (state.cart as DoorCart).category);
  const color = useSingleCartStore(state => (state.cart as DoorCart).color);

  const doorCategory = DOOR_CATEGORY_LIST.find(item => item.slug === category);

  // 유효성 검사 훅 사용
  const { widthError, heightError, boringError, isFormValid } = useDoorValidation({
    DoorWidth,
    DoorHeight,
    boringSize,
    boringNum,
    category,
  });

  // boringNum이 바뀔 때 boringSize 길이 자동 조정 (일반문, 플랩문에만 적용)
  useEffect(() => {
    if (category === "normal" || category === "flap") {
      // 기존 값을 유지하면서 새로운 길이에 맞게 조정
      const newBoringSize = Array.from({ length: boringNum }, (_, i) =>
        boringSize && boringSize[i] !== undefined ? boringSize[i] : null,
      );
      setBoringSize(newBoringSize);

      // boringNum 변경 시 store 동기화
      useSingleCartStore.setState({
        cart: {
          ...(useSingleCartStore.getState().cart as DoorCart),
          boringNum,
          boringSize: newBoringSize,
        },
      });
    }
  }, [boringNum, category]);

  // boringSize가 바뀔 때 store 동기화 (일반문, 플랩문에만 적용)
  useEffect(() => {
    if (category === "normal" || category === "flap") {
      const currentCart = useSingleCartStore.getState().cart as DoorCart;

      const updatedCart = {
        ...currentCart,
        boringSize,
      };

      useSingleCartStore.setState({
        cart: updatedCart,
      });
    }
  }, [boringSize, category]);

  // boringDirection이 바뀔 때 store 동기화 (일반문에만 적용)
  useEffect(() => {
    if (category === "normal") {
      useSingleCartStore.setState({
        cart: {
          ...(useSingleCartStore.getState().cart as DoorCart),
          boringDirection,
        },
      });
    }
  }, [boringDirection, category]);

  // DoorWidth, DoorHeight, request가 바뀔 때 store 동기화
  useEffect(() => {
    useSingleCartStore.setState({
      cart: {
        ...(useSingleCartStore.getState().cart as DoorCart),
        width: DoorWidth,
        height: DoorHeight,
        request,
      },
    });
  }, [DoorWidth, DoorHeight, request]);

  // 카테고리별 폼 렌더링
  const renderFormByCategory = () => {
    switch (category) {
      case "normal":
        return (
          <NormalDoorForm
            DoorWidth={DoorWidth}
            setDoorWidth={setDoorWidth}
            DoorHeight={DoorHeight}
            setDoorHeight={setDoorHeight}
            boringNum={boringNum}
            setBoringNum={setBoringNum}
            boringDirection={boringDirection}
            setBoringDirection={setBoringDirection}
            boringSize={boringSize}
            setBoringSize={setBoringSize}
            request={request}
            setRequest={setRequest}
            widthError={widthError}
            heightError={heightError}
            boringError={boringError}
          />
        );
      case "flap":
        return (
          <FlapDoorForm
            DoorWidth={DoorWidth}
            setDoorWidth={setDoorWidth}
            DoorHeight={DoorHeight}
            setDoorHeight={setDoorHeight}
            boringNum={boringNum}
            setBoringNum={setBoringNum}
            boringSize={boringSize}
            setBoringSize={setBoringSize}
            request={request}
            setRequest={setRequest}
            widthError={widthError}
            heightError={heightError}
            boringError={boringError}
          />
        );
      case "drawer":
        return (
          <DrawerDoorForm
            DoorWidth={DoorWidth}
            setDoorWidth={setDoorWidth}
            DoorHeight={DoorHeight}
            setDoorHeight={setDoorHeight}
            request={request}
            setRequest={setRequest}
            widthError={widthError}
            heightError={heightError}
          />
        );
      default:
        return (
          <NormalDoorForm
            DoorWidth={DoorWidth}
            setDoorWidth={setDoorWidth}
            DoorHeight={DoorHeight}
            setDoorHeight={setDoorHeight}
            boringNum={boringNum}
            setBoringNum={setBoringNum}
            boringDirection={boringDirection}
            setBoringDirection={setBoringDirection}
            boringSize={boringSize}
            setBoringSize={setBoringSize}
            request={request}
            setRequest={setRequest}
            widthError={widthError}
            heightError={heightError}
            boringError={boringError}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator />
      <Header
        title={
          doorCategory ? `${doorCategory.header} 정보를 입력해주세요` : "문짝 정보를 입력해주세요"
        }
      />
      <div className="flex flex-1 flex-col gap-5 px-5">
        <BoxedSelect
          label="색상"
          options={[]}
          value={color ?? ""}
          onClick={() => router.back()}
          onChange={() => { }}
          truncate={true}
        />
        {renderFormByCategory()}
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div className="h-[100px]"></div>
      <BottomButton
        type={"1button"}
        button1Text={"다음"}
        className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5"
        button1Disabled={isFormValid()}
        onButton1Click={() => {
          useSingleCartStore.setState({
            cart: {
              ...(useSingleCartStore.getState().cart as DoorCart),
              width: DoorWidth,
              height: DoorHeight,
              boringDirection: category === "normal" ? boringDirection : null,
              boringSize: category === "normal" || category === "flap" ? boringSize : undefined,
              request,
            },
          });
          router.push("/order/door/confirm");
        }}
      />
    </div>
  );
}

function DoorPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DoorPageContent />
    </Suspense>
  );
}

export default DoorPage;
