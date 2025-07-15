"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import DepthInputSection from "./_components/DepthInputSection";
import HeightInputSection from "./_components/HeightInputSection";
import { FinishCart, useSingleCartStore } from "@/store/singleCartStore";

function FinishPageContent() {
  const color = useSingleCartStore(state => (state.cart as FinishCart).color);
  const setCart = useSingleCartStore(state => state.setCart);
  const router = useRouter();
  const [depth, setDepth] = useState<string | null>(useSingleCartStore(state => (state.cart as FinishCart).depth) ?? null);
  const [height, setHeight] = useState<string | null>(useSingleCartStore(state => (state.cart as FinishCart).height) ?? null);
  const [request, setRequest] = useState<string | null>(useSingleCartStore(state => (state.cart as FinishCart).request) ?? null);
  const [depthIncrease, setDepthIncrease] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).depthIncrease) ?? null
  );
  const [heightIncrease, setHeightIncrease] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).heightIncrease) ?? null
  );
  const [isDepthIncrease, setIsDepthIncrease] = useState(false);
  const [isHeightIncrease, setIsHeightIncrease] = useState(false);

  // 동기화
  useEffect(() => {
    setIsDepthIncrease(
      depthIncrease !== null &&
      depthIncrease !== undefined &&
      depthIncrease !== "" &&
      Number(depthIncrease) !== 0
    );
  }, [depthIncrease]);

  useEffect(() => {
    setIsHeightIncrease(
      heightIncrease !== null &&
      heightIncrease !== undefined &&
      heightIncrease !== "" &&
      Number(heightIncrease) !== 0
    );
  }, [heightIncrease]);

  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`마감재 정보를 입력해주세요`} />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="색상"
          value={color ?? ""}
          onClick={() => router.back()}
        />
        <DepthInputSection
          depth={depth ? parseInt(depth) : null}
          setDepth={e => setDepth(e?.toString() ?? null)}
          isDepthIncrease={isDepthIncrease}
          setIsDepthIncrease={setIsDepthIncrease}
          depthIncrease={depthIncrease ? parseInt(depthIncrease) : null}
          setDepthIncrease={e => setDepthIncrease(e?.toString() ?? null)}
        />
        <HeightInputSection
          height={height ? parseInt(height) : null}
          setHeight={e => setHeight(e?.toString() ?? null)}
          isHeightIncrease={isHeightIncrease}
          setIsHeightIncrease={setIsHeightIncrease}
          heightIncrease={heightIncrease ? parseInt(heightIncrease) : null}
          setHeightIncrease={e => setHeightIncrease(e?.toString() ?? null)}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
        <BottomButton
          type={"1button"}
          button1Text={"다음"}
          className="w-full max-w-[500px] bg-white pb-5"
          button1Disabled={height === null || depth === null}
          onButton1Click={() => {
            setCart({
              type: "finish",
              color: color,
              depth: depth,
              height: height,
              depthIncrease: depthIncrease,
              heightIncrease: heightIncrease,
              request: request,
            });
            router.push(`/order/finish/confirm`);
          }}
        />
      </div>
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
