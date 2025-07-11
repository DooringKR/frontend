"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import DepthInputSection from "./_components/DepthInputSection";
import HeightInputSection from "./_components/HeightInputSection";

function FinishPageContent() {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const router = useRouter();
  const [depth, setDepth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [request, setRequest] = useState("");
  const [isDepthIncrease, setIsDepthIncrease] = useState(false);
  const [isHeightIncrease, setIsHeightIncrease] = useState(false);
  const [depthIncrease, setDepthIncrease] = useState<number | null>(null);
  const [heightIncrease, setHeightIncrease] = useState<number | null>(null);
  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`마감재 정보를 입력해주세요`} />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="색상"
          options={[]}
          value={color ?? ""}
          onClick={() => router.back()}
          onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
        />
        <DepthInputSection
          depth={depth}
          setDepth={setDepth}
          isDepthIncrease={isDepthIncrease}
          setIsDepthIncrease={setIsDepthIncrease}
          depthIncrease={depthIncrease}
          setDepthIncrease={setDepthIncrease}
        />
        <HeightInputSection
          height={height}
          setHeight={setHeight}
          isHeightIncrease={isHeightIncrease}
          setIsHeightIncrease={setIsHeightIncrease}
          heightIncrease={heightIncrease}
          setHeightIncrease={setHeightIncrease}
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
            const params = new URLSearchParams();
            params.set("height", height?.toString() ?? "");
            params.set("depth", depth?.toString() ?? "");
            params.set("color", color ?? "");
            params.set("depthIncrease", depthIncrease?.toString() ?? "");
            params.set("heightIncrease", heightIncrease?.toString() ?? "");
            params.set("request", request);
            router.push(`/order/finish/confirm?${params.toString()}`);
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
