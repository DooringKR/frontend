"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { FinishCart, useSingleCartStore } from "@/store/singleCartStore";

import DepthInputSection from "./_components/DepthInputSection";
import HeightInputSection from "./_components/HeightInputSection";
// Hooks
import { useFinishValidation } from "./hooks/useFinishValidation";

function FinishPageContent() {
  const color = useSingleCartStore(state => (state.cart as FinishCart).color);
  const setCart = useSingleCartStore(state => state.setCart);
  const router = useRouter();
  const [depth, setDepth] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).depth?.toString() ?? null),
  );
  const [height, setHeight] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).height?.toString() ?? null),
  );
  const [request, setRequest] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).request) ?? null,
  );
  const [depthIncrease, setDepthIncrease] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).depthIncrease?.toString() ?? null),
  );
  const [heightIncrease, setHeightIncrease] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).heightIncrease?.toString() ?? null),
  );
  const [isDepthIncrease, setIsDepthIncrease] = useState(false);
  const [isHeightIncrease, setIsHeightIncrease] = useState(false);

  // 유효성 검사 훅 사용
  const { depthError, heightError, isFormValid } = useFinishValidation({
    depth: depth ? Number(depth) : null,
    height: height ? Number(height) : null,
    depthIncrease: depthIncrease ? Number(depthIncrease) : null,
    heightIncrease: heightIncrease ? Number(heightIncrease) : null,
  });

  // 동기화
  useEffect(() => {
    setIsDepthIncrease(
      depthIncrease !== null &&
        depthIncrease !== undefined &&
        depthIncrease !== "" &&
        Number(depthIncrease) !== 0,
    );
  }, [depthIncrease]);

  useEffect(() => {
    setIsHeightIncrease(
      heightIncrease !== null &&
        heightIncrease !== undefined &&
        heightIncrease !== "" &&
        Number(heightIncrease) !== 0,
    );
  }, [heightIncrease]);

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`마감재 정보를 입력해주세요`} />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect label="색상" value={color ?? ""} onClick={() => router.back()} />
        <DepthInputSection
          depth={depth ? Number(depth) : null}
          setDepth={e => setDepth(e?.toString() ?? null)}
          isDepthIncrease={isDepthIncrease}
          setIsDepthIncrease={setIsDepthIncrease}
          depthIncrease={depthIncrease ? Number(depthIncrease) : null}
          setDepthIncrease={e => setDepthIncrease(e?.toString() ?? null)}
          depthError={depthError}
        />
        <HeightInputSection
          height={height ? Number(height) : null}
          setHeight={e => setHeight(e?.toString() ?? null)}
          isHeightIncrease={isHeightIncrease}
          setIsHeightIncrease={setIsHeightIncrease}
          heightIncrease={heightIncrease ? Number(heightIncrease) : null}
          setHeightIncrease={e => setHeightIncrease(e?.toString() ?? null)}
          heightError={heightError}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div className="h-[100px]" />
      <BottomButton
        type={"1button"}
        button1Text={"다음"}
        className="fixed bottom-0 w-full max-w-[460px]"
        button1Disabled={isFormValid()}
        onButton1Click={() => {
          setCart({
            type: "finish",
            color: color,
            depth: depth ? Number(depth) : null,
            height: height ? Number(height) : null,
            depthIncrease: depthIncrease ? Number(depthIncrease) : null,
            heightIncrease: heightIncrease ? Number(heightIncrease) : null,
            request: request,
          });
          router.push(`/order/finish/confirm`);
        }}
      />
    </div>
  );
}

function FinishPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FinishPageContent />
    </Suspense>
  );
}

export default FinishPage;
