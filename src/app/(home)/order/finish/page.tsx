"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import { Switch } from "@/components/Switches/Switches";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function FinishPage() {
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
        <div className="flex flex-col gap-2">
          <BoxedInput
            label="깊이"
            placeholder="깊이를 입력해주세요"
            value={depth !== null ? `${depth}mm` : ""}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setDepth(value ? Number(value) : null);
            }}
          />
          <div className="flex gap-2">
            <GrayVerticalLine isExpanded={isDepthIncrease} expandedMinHeight="144px" />
            <div className="flex w-full flex-col">
              <SelectToggleButton
                checked={isDepthIncrease}
                customIcon={<Switch checked={isDepthIncrease} />}
                label={"깊이 키우기"}
                onClick={() => {
                  if (isDepthIncrease) {
                    setDepthIncrease(null); // false가 될 때 초기화
                  }
                  setIsDepthIncrease(!isDepthIncrease);
                }}
              />
              {isDepthIncrease && (
                <div className="flex flex-col items-center">
                  <BoxedInput
                    type="text"
                    placeholder="추가할 깊이를 입력해주세요"
                    className="w-full"
                    value={depthIncrease !== null ? `${depthIncrease}mm` : ""}
                    onChange={e => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setDepthIncrease(value ? Number(value) : null);
                    }}
                  />
                  <SelectToggleButton
                    checked={isDepthIncrease}
                    customIcon={
                      <div className="text-[17px]/[24px] font-600 text-[#3B82F6]">
                        {depthIncrease !== null && depth !== null
                          ? `${depthIncrease + depth}mm`
                          : "값을 입력해주세요"}
                      </div>
                    }
                    label={"합산 깊이"}
                    onClick={() => { }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <BoxedInput
            label="높이"
            placeholder="높이를 입력해주세요"
            value={height !== null ? `${height}mm` : ""}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setHeight(value ? Number(value) : null);
            }}
          />
          <div className="flex gap-2">
            <GrayVerticalLine isExpanded={isHeightIncrease} expandedMinHeight="144px" />
            <div className="flex w-full flex-col">
              <SelectToggleButton
                checked={isHeightIncrease}
                customIcon={<Switch checked={isHeightIncrease} />}
                label={"높이 키우기"}
                onClick={() => {
                  if (isHeightIncrease) {
                    setHeightIncrease(null); // false가 될 때 초기화
                  }
                  setIsHeightIncrease(!isHeightIncrease);
                }}
              />
              {isHeightIncrease && (
                <div className="flex flex-col items-center">
                  <BoxedInput
                    type="text"
                    placeholder="추가할 높이를 입력해주세요"
                    className="w-full"
                    value={heightIncrease !== null ? `${heightIncrease}mm` : ""}
                    onChange={e => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setHeightIncrease(value ? Number(value) : null);
                    }}
                  />
                  <SelectToggleButton
                    checked={isHeightIncrease}
                    customIcon={
                      <div className="text-[17px]/[24px] font-600 text-[#3B82F6]">
                        {heightIncrease !== null && height !== null
                          ? `${heightIncrease + height}mm`
                          : "값을 입력해주세요"}
                      </div>
                    }
                    label={"합산 높이"}
                    onClick={() => { }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
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

export default FinishPage;
