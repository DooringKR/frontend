"use client";

import Door from "@/app/(home)/cart/_components/Door";
import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import DoorPreview from "@/components/DoorPreview/DoorPreview";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { DoorCart, useSingleCartStore } from "@/store/singleCartStore";

// 일반문 폼 컴포넌트
function NormalDoorForm({
  DoorWidth,
  setDoorWidth,
  DoorHeight,
  setDoorHeight,
  boringNum,
  setBoringNum,
  boringDirection,
  setBoringDirection,
  boringSize,
  setBoringSize,
  request,
  setRequest,
}: {
  DoorWidth: number | null;
  setDoorWidth: (value: number | null) => void;
  DoorHeight: number | null;
  setDoorHeight: (value: number | null) => void;
  boringNum: 2 | 3 | 4;
  setBoringNum: (value: 2 | 3 | 4) => void;
  boringDirection: "left" | "right";
  setBoringDirection: (value: "left" | "right") => void;
  boringSize: (number | null)[];
  setBoringSize: (value: (number | null)[]) => void;
  request: string;
  setRequest: (value: string) => void;
}) {
  return (
    <>
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
    </>
  );
}

// 플랩문 폼 컴포넌트
function FlapDoorForm({
  DoorWidth,
  setDoorWidth,
  DoorHeight,
  setDoorHeight,
  request,
  setRequest,
}: {
  DoorWidth: number | null;
  setDoorWidth: (value: number | null) => void;
  DoorHeight: number | null;
  setDoorHeight: (value: number | null) => void;
  request: string;
  setRequest: (value: string) => void;
}) {
  return (
    <>
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
        <div className="w-full text-[14px] font-400 text-gray-600">플랩문 특성</div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-600">• 위로 열리는 방식</p>
          <p className="text-sm text-gray-600">• 경첩이 필요하지 않음</p>
          <p className="text-sm text-gray-600">• 가스 스프링 또는 힌지 시스템 사용</p>
        </div>
      </div>
    </>
  );
}

// 서랍문 폼 컴포넌트
function DrawerDoorForm({
  DoorWidth,
  setDoorWidth,
  DoorHeight,
  setDoorHeight,
  request,
  setRequest,
}: {
  DoorWidth: number | null;
  setDoorWidth: (value: number | null) => void;
  DoorHeight: number | null;
  setDoorHeight: (value: number | null) => void;
  request: string;
  setRequest: (value: string) => void;
}) {
  return (
    <>
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
        <div className="w-full text-[14px] font-400 text-gray-600">서랍문 특성</div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-600">• 밀어서 열리는 방식</p>
          <p className="text-sm text-gray-600">• 레일 시스템 사용</p>
          <p className="text-sm text-gray-600">• 핸들 또는 홈이 필요</p>
        </div>
      </div>
    </>
  );
}

function DoorPageContent() {
  const router = useRouter();

  // 초기값을 쿼리스트링에서 읽어오기
  const [boringNum, setBoringNum] = useState<2 | 3 | 4>(
    (useSingleCartStore(state => (state.cart as DoorCart).boringNum) as 2 | 3 | 4) || 2,
  );
  const [boringDirection, setBoringDirection] = useState<"left" | "right">(
    (useSingleCartStore(state => (state.cart as DoorCart).boringDirection) as "left" | "right") ||
      "left",
  );
  const [DoorWidth, setDoorWidth] = useState<number | null>(
    (useSingleCartStore(state => (state.cart as DoorCart).width) as number | null) ?? null,
  );
  const [DoorHeight, setDoorHeight] = useState<number | null>(
    (useSingleCartStore(state => (state.cart as DoorCart).height) as number | null) ?? null,
  );
  const [boringSize, setBoringSize] = useState<(number | null)[]>(
    (useSingleCartStore(state => (state.cart as DoorCart).boringSize) as (number | null)[]) ?? [],
  );
  const [request, setRequest] = useState(
    (useSingleCartStore(state => (state.cart as DoorCart).request) as string) ?? "",
  );

  const category = useSingleCartStore(state => (state.cart as DoorCart).category);
  const color = useSingleCartStore(state => (state.cart as DoorCart).color);

  const doorCategory = DOOR_CATEGORY_LIST.find(item => item.slug === category);

  // boringNum이 바뀔 때 boringSize 길이 자동 조정 (일반문에만 적용)
  useEffect(() => {
    if (category === "normal") {
      setBoringSize(prev => Array.from({ length: boringNum }, (_, i) => prev[i] ?? null));
      // boringNum 변경 시 URL 동기화
      useSingleCartStore.setState({
        cart: {
          ...(useSingleCartStore.getState().cart as DoorCart),
          boringNum,
          boringSize: Array.from({ length: boringNum }, (_, i) => boringSize[i] ?? null),
        },
      });
    }
  }, [boringNum, category]);

  // boringSize가 바뀔 때 URL 동기화 (일반문에만 적용)
  useEffect(() => {
    if (category === "normal") {
      useSingleCartStore.setState({
        cart: {
          ...(useSingleCartStore.getState().cart as DoorCart),
          boringSize,
        },
      });
    }
  }, [boringSize, category]);

  // boringDirection이 바뀔 때 URL 동기화 (일반문에만 적용)
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

  // DoorWidth, DoorHeight, request가 바뀔 때 URL 동기화
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
          />
        );
      case "flap":
        return (
          <FlapDoorForm
            DoorWidth={DoorWidth}
            setDoorWidth={setDoorWidth}
            DoorHeight={DoorHeight}
            setDoorHeight={setDoorHeight}
            request={request}
            setRequest={setRequest}
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
          />
        );
    }
  };

  // 카테고리별 유효성 검사
  const isFormValid = () => {
    switch (category) {
      case "normal":
        return DoorWidth === null || DoorHeight === null || boringSize.some(v => v === null);
      case "flap":
      case "drawer":
        return DoorWidth === null || DoorHeight === null;
      default:
        return DoorWidth === null || DoorHeight === null || boringSize.some(v => v === null);
    }
  };

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
          onChange={() => {}}
        />
        {renderFormByCategory()}
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
        button1Disabled={isFormValid()}
        onButton1Click={() => {
          useSingleCartStore.setState({
            cart: {
              ...(useSingleCartStore.getState().cart as DoorCart),
              width: DoorWidth,
              height: DoorHeight,
              boringDirection: category === "normal" ? boringDirection : null,
              boringSize: category === "normal" ? boringSize : [],
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
