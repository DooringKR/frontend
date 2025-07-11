"use client";

import Door from "@/app/(home)/cart/_components/Door";
import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import DoorPreview from "@/components/DoorPreview/DoorPreview";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { useSingleCartStore } from "@/store/singleCartStore";

function DoorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 초기값을 쿼리스트링에서 읽어오기
  const [boringNum, setBoringNum] = useState<2 | 3 | 4>(
    (Number(searchParams.get("boringNum")) as 2 | 3 | 4) || 2
  );
  const [boringDirection, setBoringDirection] = useState<"left" | "right">(
    (searchParams.get("boringDirection") as "left" | "right") || "left"
  );
  const [DoorWidth, setDoorWidth] = useState<number | null>(
    searchParams.get("width") ? Number(searchParams.get("width")) : null
  );
  const [DoorHeight, setDoorHeight] = useState<number | null>(
    searchParams.get("height") ? Number(searchParams.get("height")) : null
  );
  const [boringSize, setBoringSize] = useState<(number | null)[]>(
    searchParams.get("boringSize")
      ? JSON.parse(searchParams.get("boringSize")!)
      : []
  );
  const [request, setRequest] = useState(
    searchParams.get("request") ?? ""
  );

  // const color = searchParams.get("color") ?? "";
  const category = searchParams.get("category") ?? "";

  const color = useSingleCartStore(state => state.color);

  const doorCategory = DOOR_CATEGORY_LIST.find(item => item.slug === category);

  // boringNum이 바뀔 때 boringSize 길이 자동 조정
  useEffect(() => {
    setBoringSize(prev => Array.from({ length: boringNum }, (_, i) => prev[i] ?? null));
    // boringNum 변경 시 URL 동기화
    const params = new URLSearchParams(searchParams);
    params.set("boringNum", String(boringNum));
    params.set("boringSize", JSON.stringify(Array.from({ length: boringNum }, (_, i) => boringSize[i] ?? null)));
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line
  }, [boringNum]);

  // boringSize가 바뀔 때 URL 동기화
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("boringSize", JSON.stringify(boringSize));
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line
  }, [boringSize]);

  // boringDirection이 바뀔 때 URL 동기화
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("boringDirection", boringDirection);
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line
  }, [boringDirection]);

  // DoorWidth, DoorHeight, request가 바뀔 때 URL 동기화
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (DoorWidth !== null) params.set("width", String(DoorWidth));
    else params.delete("width");
    if (DoorHeight !== null) params.set("height", String(DoorHeight));
    else params.delete("height");
    params.set("request", request);
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line
  }, [DoorWidth, DoorHeight, request]);

  return (
    <div>
      <TopNavigator />
      <Header
        title={
          doorCategory ? `${doorCategory.header} 정보를 입력해주세요` : "문짝 정보를 입력해주세요"
        }
      />
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="색상"
          options={[]}
          value={color ?? ""}
          onClick={() => router.back()}
          onChange={() => { }}
        />
        <BoxedInput
          type="text"
          label="가로 길이(mm)"
          placeholder="가로 길이를 입력해주세요"
          value={DoorWidth !== null ? `${DoorWidth}mm` : ""}
          onChange={e => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setDoorWidth(value ? Number(value) : null);
          }}
        />
        <BoxedInput
          type="text"
          label="세로 길이(mm)"
          placeholder="세로 길이를 입력해주세요"
          value={DoorHeight !== null ? `${DoorHeight}mm` : ""}
          onChange={e => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setDoorHeight(value ? Number(value) : null);
          }}
        />
        <div className="flex flex-col gap-2">
          <div className="w-full text-[14px] font-400 text-gray-600"> 경첩</div>
          <div className="flex flex-row gap-2">
            <Button
              type={boringNum == 2 ? "BrandInverse" : "GrayLarge"}
              text={"2개"}
              onClick={() => setBoringNum(2)}
            />
            <Button
              type={boringNum == 3 ? "BrandInverse" : "GrayLarge"}
              text={"3개"}
              onClick={() => setBoringNum(3)}
            />
            <Button
              type={boringNum == 4 ? "BrandInverse" : "GrayLarge"}
              text={"4개"}
              onClick={() => setBoringNum(4)}
            />
          </div>
        </div>
        <SegmentedControl
          options={["좌경", "우경"]}
          value={boringDirection === "left" ? 0 : 1}
          onChange={index => setBoringDirection(index === 0 ? "left" : "right")}
        />
        <div className="flex items-center justify-center pt-5">
          <DoorPreview
            DoorWidth={DoorWidth}
            DoorHeight={DoorHeight}
            boringDirection={boringDirection}
            boringNum={boringNum}
            boringSize={boringSize}
            onChangeBoringSize={setBoringSize}
          />
        </div>
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
        className="px-5 pb-5"
        button1Disabled={
          DoorWidth === null || DoorHeight === null || boringSize.some(v => v === null)
        }
        onButton1Click={() => {
          const params = new URLSearchParams(searchParams);
          params.set("width", DoorWidth?.toString() ?? "");
          params.set("height", DoorHeight?.toString() ?? "");
          params.set("boringDirection", boringDirection);
          params.set("boringSize", JSON.stringify(boringSize));
          params.set("request", request);
          router.push(`/order/door/confirm?${params.toString()}`);
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
