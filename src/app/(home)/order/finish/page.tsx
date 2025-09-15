"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import formatLocation from "@/utils/formatLocation";

import { FinishCart, useSingleCartStore } from "@/store/singleCartStore";

import DepthInputSection from "./_components/DepthInputSection";
import HeightInputSection from "./_components/HeightInputSection";
// Hooks
import { useFinishValidation } from "./hooks/useFinishValidation";
import { FINISH_CATEGORY_LIST } from "@/constants/category";

function FinishPageContent() {
  const category = useSingleCartStore(state => (state.cart as FinishCart).category);
  const color = useSingleCartStore(state => (state.cart as FinishCart).color);
  const setCart = useSingleCartStore(state => state.setCart);
  const router = useRouter();
  const [depth, setDepth] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).depth?.toString() ?? null),
  );
  const [height, setHeight] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).height?.toString() ?? null),
  );
  const [edgeCount, setEdgeCount] = useState<string | null>(
    useSingleCartStore(state => (state.cart as FinishCart).edge_count?.toString() ?? null),
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
  const [finish_location, setFinishLocation] = useState(
    useSingleCartStore(state => (state.cart as FinishCart).finish_location ?? ""),
  );
  const [isDepthIncrease, setIsDepthIncrease] = useState(false);
  const [isHeightIncrease, setIsHeightIncrease] = useState(false);
  const [isFinishLocationSheetOpen, setIsFinishLocationSheetOpen] = useState(false);
  const [isEdgeCountSheetOpen, setIsEdgeCountSheetOpen] = useState(false);

  // 유효성 검사 훅 사용
  const { depthError, heightError, isFormValid } = useFinishValidation({
    edgeCount: edgeCount ? Number(edgeCount) : null,
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
      <Header
        size="Large"
        title={`${FINISH_CATEGORY_LIST.find(item => item.slug === category)?.header ?? ""
          } 정보를 입력해주세요`}
      />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect label="색상" value={color ?? ""} onClick={() => router.back()} />
        <BoxedSelect
          label="엣지 면 수"
          value={edgeCount ? (edgeCount === "2" ? "2면" : "4면") : ""}
          onClick={() => setIsEdgeCountSheetOpen(true)}
        />

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
        <BoxedSelect
          label="용도 ∙ 장소"
          options={[]}
          value={finish_location ? formatLocation(finish_location) : ""}
          onClick={() => setIsFinishLocationSheetOpen(true)}
          onChange={() => { }}
        />
        <FinishLocationSheet
          isOpen={isFinishLocationSheetOpen}
          onClose={() => setIsFinishLocationSheetOpen(false)}
          value={finish_location}
          onChange={setFinishLocation}
        />
        <EdgeCountSheet
          isOpen={isEdgeCountSheetOpen}
          onClose={() => setIsEdgeCountSheetOpen(false)}
          value={edgeCount}
          onChange={setEdgeCount}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div className="h-[100px]" />
      {!isFinishLocationSheetOpen && !isEdgeCountSheetOpen && (
        <div id="finish-next-button">
          <BottomButton
            type={"1button"}
            button1Text={"다음"}
            className="fixed bottom-0 w-full max-w-[460px]"
            button1Disabled={isFormValid()}
            onButton1Click={() => {
              setCart({
                type: "finish",
                category: category,
                color: color,
                edge_count: edgeCount ? Number(edgeCount) : null,
                depth: depth ? Number(depth) : null,
                height: height ? Number(height) : null,
                depthIncrease: depthIncrease ? Number(depthIncrease) : null,
                heightIncrease: heightIncrease ? Number(heightIncrease) : null,
                request: request,
                finish_location: finish_location,
              });
              router.push(`/order/finish/confirm`);
            }}
          />
        </div>
      )}
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

// 용도 및 장소 선택 시트 컴포넌트
function FinishLocationSheet({
  isOpen,
  onClose,
  value,
  onChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "KITCHEN", label: "주방" },
    { value: "SHOES", label: "신발장" },
    { value: "BUILT_IN", label: "붙박이장" },
    { value: "BALCONY", label: "발코니 창고문" },
    { value: "ETC", label: "기타 수납장" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      title="용도 및 장소를 선택해주세요"
      contentPadding="px-1"
      children={
        <div>
          <div>
            {options.map(option => (
              <SelectToggleButton
                key={option.value}
                label={option.label}
                checked={value === option.value}
                onClick={() => onChange(option.value)}
              />
            ))}
            <div className="p-5">
              <Button
                type="Brand"
                text="다음"
                onClick={() => {
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}

// 엣지 면 수 선택 시트 컴포넌트
function EdgeCountSheet({
  isOpen,
  onClose,
  value,
  onChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  value: string | null;
  onChange: (v: string) => void;
}) {
  const options = [
    { value: "2", label: "2면" },
    { value: "4", label: "4면" },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      title="엣지 면 수를 선택해주세요"
      contentPadding="px-1"
      children={
        <div>
          <div>
            {options.map(option => (
              <SelectToggleButton
                key={option.value}
                label={option.label}
                checked={value === option.value}
                onClick={() => onChange(option.value)}
              />
            ))}
            <div className="p-5">
              <Button
                type="Brand"
                text="다음"
                onClick={() => {
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}

export default FinishPage;
