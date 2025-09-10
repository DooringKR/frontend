"use client";

import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { BODY_MATERIAL_LIST } from "@/constants/colorList";
import { useRouter, useSearchParams } from "next/navigation";
import ToastIcon from "public/icons/toast";
import { use, useEffect, useRef, useState } from "react";
import React from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { CabinetCart, useSingleCartStore } from "@/store/singleCartStore";

import formatLocation from "@/utils/formatLocation";

import DrawerCabinetForm from "./_components/DrawerCabinetForm";
import FlapCabinetForm from "./_components/FlapCabinetForm";
import LowerCabinetForm from "./_components/LowerCabinetForm";
import OpenCabinetForm from "./_components/OpenCabinetForm";
import UpperCabinetForm from "./_components/UpperCabinetForm";
import CabinetIcon1 from "./_components/cabinetIcon1";
import CabinetIcon2 from "./_components/cabinetIcon2";
import CabinetIcon3 from "./_components/cabinetIcon3";
// Hooks
import { useCabinetValidation } from "./hooks/useCabinetValidation";

// 공통 props 타입 정의
type CabinetFormProps = {
  color: string;
  bodyMaterial: string;
  DoorWidth: number | null;
  DoorHeight: number | null;
  DoorDepth: number | null;
  request: string;
  setDoorWidth: (value: number | null) => void;
  setDoorHeight: (value: number | null) => void;
  setDoorDepth: (value: number | null) => void;
  setRequest: (value: string) => void;
  setBodyMaterial: (value: string) => void;
  setIsBottomSheetOpen: (value: boolean) => void;
  router: ReturnType<typeof useRouter>;
  widthError: string;
  heightError: string;
  depthError: string;
};

// 상부장 전용 props 타입 정의
type UpperCabinetFormProps = CabinetFormProps & {
  handleType: string;
  finishType: string;
  setHandleType: (value: string) => void;
  setFinishType: (value: string) => void;
};

// 하부장 전용 폼
type LowerCabinetFormProps = CabinetFormProps & {
  handleType: string;
  finishType: string;
  setHandleType: (value: string) => void;
  setFinishType: (value: string) => void;
};

// 플랩 전용 폼
type FlapCabinetFormProps = CabinetFormProps & {
  handleType: string;
  finishType: string;
  showBar: string;
  setHandleType: (value: string) => void;
  setFinishType: (value: string) => void;
  setShowBar: (value: string) => void;
  isShowBarSheetOpen: boolean;
  setIsShowBarSheetOpen: (v: boolean) => void;
};

type DrawerCabinetFormProps = CabinetFormProps & {
  drawerType: string;
  railType: string;
  finishType: string;
  handleType: string;
  setHandleType: (value: string) => void;
  setDrawerType: (value: string) => void;
  setRailType: (value: string) => void;
  setFinishType: (value: string) => void;
  isDrawerTypeSheetOpen: boolean;
  setIsDrawerTypeSheetOpen: (v: boolean) => void;
  isRailTypeSheetOpen: boolean;
  setIsRailTypeSheetOpen: (v: boolean) => void;
};

// 오픈장 전용 폼
type OpenCabinetFormProps = CabinetFormProps & {
  riceRail: string;
  setRiceRail: (v: string) => void;
  lowerDrawer: string;
  setLowerDrawer: (v: string) => void;
  finishType: string;
  setFinishType: (v: string) => void;
};

function CabinetPageContent() {
  const category = useSingleCartStore(state => (state.cart as CabinetCart).category);
  const color = useSingleCartStore(state => (state.cart as CabinetCart).color ?? "");

  // category(slug)에 맞는 header 값 찾기
  const currentCategory = CABINET_CATEGORY_LIST.find(item => item.slug === category);
  const headerTitle = currentCategory?.header || category;

  const router = useRouter();

  const [DoorWidth, setDoorWidth] = useState<number | null>(
    (useSingleCartStore.getState().cart as CabinetCart).width ?? null,
  );
  const [DoorHeight, setDoorHeight] = useState<number | null>(
    (useSingleCartStore.getState().cart as CabinetCart).height ?? null,
  );
  const [DoorDepth, setDoorDepth] = useState<number | null>(
    (useSingleCartStore.getState().cart as CabinetCart).depth ?? null,
  );
  const [request, setRequest] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).request ?? "",
  );
  const [bodyMaterial, setBodyMaterial] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).bodyMaterial ?? "",
  );
  const [handleType, setHandleType] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).handleType ?? "",
  );
  const [finishType, setFinishType] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).finishType ?? "",
  );
  const [showBar, setShowBar] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).showBar ?? "",
  );
  const [drawerType, setDrawerType] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).drawerType ?? "",
  );
  const [railType, setRailType] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).railType ?? "",
  );
  const [riceRail, setRiceRail] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).riceRail ?? "",
  );
  const [lowerDrawer, setLowerDrawer] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).lowerDrawer ?? "",
  );
  const [cabinet_location, setCabinetLocation] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).cabinet_location ?? "",
  );
  const [addOn_construction, setAddOn_construction] = useState(
    (useSingleCartStore.getState().cart as CabinetCart).addOn_construction ?? false,
  );
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isShowBarSheetOpen, setIsShowBarSheetOpen] = useState(false);
  const [isDrawerTypeSheetOpen, setIsDrawerTypeSheetOpen] = useState(false);
  const [isRailTypeSheetOpen, setIsRailTypeSheetOpen] = useState(false);
  const [isCabinetLocationSheetOpen, setIsCabinetLocationSheetOpen] = useState(false);

  // 유효성 검사 훅 사용
  const { widthError, heightError, depthError, isFormValid } = useCabinetValidation({
    DoorWidth,
    DoorHeight,
    DoorDepth,
  });

  const formProps: CabinetFormProps = {
    color,
    bodyMaterial,
    DoorWidth,
    DoorHeight,
    DoorDepth,
    request,
    setDoorWidth,
    setDoorHeight,
    setDoorDepth,
    setRequest,
    setBodyMaterial,
    setIsBottomSheetOpen,
    router,
    widthError,
    heightError,
    depthError,
  };

  const upperFormProps: UpperCabinetFormProps = {
    ...formProps,
    handleType,
    finishType,
    setHandleType,
    setFinishType,
  };
  const lowerFormProps: LowerCabinetFormProps = {
    ...formProps,
    handleType,
    finishType,
    setHandleType,
    setFinishType,
  };
  const flapFormProps: FlapCabinetFormProps = {
    ...formProps,
    handleType,
    finishType,
    showBar,
    setHandleType,
    setFinishType,
    setShowBar,
    isShowBarSheetOpen,
    setIsShowBarSheetOpen,
  };
  const drawerFormProps: DrawerCabinetFormProps = {
    ...formProps,
    drawerType,
    railType,
    finishType,
    handleType,
    setDrawerType,
    setRailType,
    setFinishType,
    setHandleType,
    isDrawerTypeSheetOpen,
    setIsDrawerTypeSheetOpen,
    isRailTypeSheetOpen,
    setIsRailTypeSheetOpen,
  };
  const openCabinetFormProps: OpenCabinetFormProps = {
    ...formProps,
    riceRail,
    setRiceRail,
    lowerDrawer,
    setLowerDrawer,
    finishType,
    setFinishType,
  };

  let button1Disabled = isFormValid();
  if (category === "lower" || category === "upper") {
    button1Disabled = button1Disabled || bodyMaterial === "" || !handleType || !finishType;
  } else if (category === "flap") {
    button1Disabled =
      button1Disabled || bodyMaterial === "" || !handleType || !finishType || !showBar;
  } else if (category === "drawer") {
    button1Disabled =
      button1Disabled || bodyMaterial === "" || !drawerType || !railType || !finishType || !handleType;
  } else if (category === "open") {
    button1Disabled =
      button1Disabled || bodyMaterial === "" || !riceRail || !lowerDrawer || !finishType;
  } else {
    button1Disabled = button1Disabled || bodyMaterial === "";
  }

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header title={`${headerTitle} 정보를 입력해주세요`} />
      <div className="h-5" />
      {renderCabinetFormByCategory(
        category ? category : "lower", // 기본값으로 "lower" 사용
        formProps,
        upperFormProps,
        lowerFormProps,
        flapFormProps,
        drawerFormProps,
        openCabinetFormProps,
      )}
      <div className="h-5" />


      <div className="px-5">
        <BoxedSelect
          label="용도 ∙ 장소"
          options={[]}
          value={cabinet_location ? formatLocation(cabinet_location) : ""}
          onClick={() => setIsCabinetLocationSheetOpen(true)}
          onChange={() => { }}
        />
        <CabinetLocationSheet
          isOpen={isCabinetLocationSheetOpen}
          onClose={() => setIsCabinetLocationSheetOpen(false)}
          value={cabinet_location}
          onChange={setCabinetLocation}
        />
      </div>
      <div className="h-5" />
      <div className="flex flex-col gap-2 px-5">
        <div className="w-full text-[14px] font-400 text-gray-600">시공 필요 여부</div>
        <div className="flex flex-row gap-2">
          <Button
            type={addOn_construction ? "BrandInverse" : "GrayLarge"}
            text={"시공도 필요해요"}
            onClick={() => setAddOn_construction(true)}
          />
          <Button
            type={addOn_construction ? "GrayLarge" : "BrandInverse"}
            text={"필요 없어요"}
            onClick={() => setAddOn_construction(false)}
          />
        </div>
      </div>
      <div className="h-5" />
      <BodyMaterialManualInputSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        value={bodyMaterial}
        onChange={setBodyMaterial}
      />
      <ShowBarInputSheet
        isOpen={isShowBarSheetOpen}
        onClose={() => setIsShowBarSheetOpen(false)}
        value={showBar}
        onChange={setShowBar}
      />
      <DrawerTypeInputSheet
        isOpen={isDrawerTypeSheetOpen}
        onClose={() => setIsDrawerTypeSheetOpen(false)}
        value={drawerType}
        onChange={setDrawerType}
      />
      <RailTypeInputSheet
        isOpen={isRailTypeSheetOpen}
        onClose={() => setIsRailTypeSheetOpen(false)}
        value={railType}
        onChange={setRailType}
      />
      <div className="h-[100px]" />
      {!isBottomSheetOpen &&
        !isShowBarSheetOpen &&
        !isDrawerTypeSheetOpen &&
        !isRailTypeSheetOpen &&
        !isCabinetLocationSheetOpen && (
          <BottomButton
            type={"1button"}
            button1Text={"다음"}
            className="fixed bottom-0 w-full max-w-[460px]"
            button1Disabled={button1Disabled}
            onButton1Click={() => {
              useSingleCartStore.setState(state => ({
                cart: {
                  ...state.cart,
                  type: "cabinet",
                  category,
                  color,
                  width: DoorWidth,
                  height: DoorHeight,
                  depth: DoorDepth,
                  bodyMaterial,
                  request,
                  handleType,
                  finishType,
                  showBar,
                  drawerType,
                  railType,
                  riceRail,
                  lowerDrawer,
                  cabinet_location,
                  addOn_construction,
                },
              }));
              router.push(`/order/cabinet/confirm`);
            }}
          />
        )}
    </div>
  );
}

// 직접입력 BottomSheet 컴포넌트
function BodyMaterialManualInputSheet({
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
  const inputRef = useRef<HTMLInputElement>(null);

  // 미리 정의된 옵션
  const options = BODY_MATERIAL_LIST;

  return (
    <BottomSheet
      isOpen={isOpen}
      title="몸통 소재 및 두께를 선택해주세요"
      contentPadding="px-1"
      children={
        <div>
          {options.map(option => (
            <SelectToggleButton
              key={option}
              label={option}
              checked={value === option}
              onClick={() => onChange(option)}
            />
          ))}
          <div className="flex flex-col">
            <SelectToggleButton
              label="직접 입력"
              checked={options.every(opt => value !== opt)}
              onClick={() => {
                onChange(""); // 입력창을 비우고 포커스
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
            {options.every(opt => value !== opt) && (
              <div className="flex items-center gap-2 px-4 pb-3">
                <GrayVerticalLine />{" "}
                <BoxedInput
                  ref={inputRef}
                  type="text"
                  placeholder="브랜드, 소재, 두께 등"
                  className="w-full"
                  value={value}
                  onChange={e => onChange(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      }
      onClose={onClose}
      buttonArea={
        <div className="p-5">
          <Button
            type="Brand"
            text="다음"
            onClick={() => {
              onClose();
            }}
          />
        </div>
      }
    />
  );
}

function ShowBarInputSheet({
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
  const inputRef = useRef<HTMLInputElement>(null);

  // 미리 정의된 옵션
  const options = [
    "쇼바 없음",
    "문주 아벤토스 쇼바",
    "블룸 아벤토스 쇼바",
    "가스 쇼바",
    "접이식 쇼바",
  ];
  return (
    <BottomSheet
      isOpen={isOpen}
      title="쇼바 종류를 선택해주세요"
      children={
        <div>
          <div>
            {options.map(option => (
              <SelectToggleButton
                key={option}
                label={option}
                checked={value === option}
                onClick={() => onChange(option)}
              />
            ))}
            <div className="flex flex-col">
              <SelectToggleButton
                label="직접 입력"
                checked={options.every(opt => value !== opt)}
                onClick={() => {
                  onChange(""); // 입력창을 비우고 포커스
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              />
              {options.every(opt => value !== opt) && (
                <div className="flex items-center gap-2 px-4 pb-3">
                  <GrayVerticalLine />
                  <BoxedInput
                    ref={inputRef}
                    type="text"
                    placeholder="브랜드, 소재, 두께 등"
                    className="w-full"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="py-5">
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

function DrawerTypeInputSheet({
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
  const inputRef = useRef<HTMLInputElement>(null);
  const options = [
    { main: "2단 서랍", sub: "", icon: <CabinetIcon1 /> },
    { main: "3단 서랍", sub: "(1 : 1 : 2)", icon: <CabinetIcon2 /> },
    { main: "3단 서랍", sub: "(겉2 ∙ 속1)", icon: <CabinetIcon3 /> },
  ];
  // 옵션/직접입력 모드 상태
  const [mode, setMode] = useState<"option" | "input">("option");

  useEffect(() => {
    if (isOpen) {
      if (options.some(opt => (opt.sub ? `${opt.main} ${opt.sub}` : opt.main) === value)) {
        setMode("option");
      } else if (value) {
        setMode("input");
      } else {
        setMode("option");
      }
    }
  }, [isOpen]);

  return (
    <BottomSheet
      isOpen={isOpen}
      title="서랍 종류를 선택해주세요"
      headerButtonText={mode === "option" ? "직접 입력" : "이전"}
      onHeaderButtonClick={() => {
        if (mode === "option") {
          setMode("input");
          onChange("");
          setTimeout(() => inputRef.current?.focus(), 0);
        } else {
          setMode("option");
        }
      }}
      children={
        <div>
          {mode === "option" ? (
            <div className="flex justify-between pt-5">
              {options.map(option => {
                const label = option.sub ? `${option.main} ${option.sub}` : option.main;
                const selected = value === label;
                return (
                  <div
                    key={label}
                    className="flex w-full cursor-pointer flex-col items-center gap-2"
                    onClick={() => onChange(label)}
                  >
                    <span className="flex w-full items-center justify-center">
                      {React.cloneElement(option.icon, { color: selected ? "#44BE83" : "#D1D5DC" })}
                    </span>
                    <div className="flex h-[42px] flex-col items-center justify-center">
                      <span className={`text-[16px]/[22px] font-400 text-gray-600`}>
                        {option.main}
                      </span>
                      {option.sub && (
                        <span className={`text-[14px]/[20px] font-500 text-gray-400`}>
                          {option.sub}
                        </span>
                      )}
                    </div>
                    <ToastIcon active={selected} />
                  </div>
                );
              })}
            </div>
          ) : (
            <BoxedInput
              label="서랍 종류"
              ref={inputRef}
              type="text"
              placeholder="구체적으로 꼼꼼히 입력해주세요"
              className="w-full pt-5"
              value={value}
              onChange={e => onChange(e.target.value)}
            />
          )}
          <div className="py-5">
            <Button
              type="Brand"
              text="다음"
              onClick={() => {
                onClose();
              }}
            />
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}

function RailTypeInputSheet({
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
  const inputRef = useRef<HTMLInputElement>(null);
  const options = [
    "블룸 텐덤",
    "국산(문주) 텐덤",
    "헤펠레",
    "언더레일",
    "댐핑 볼레일",
    "일반 볼레일",
  ];
  return (
    <BottomSheet
      isOpen={isOpen}
      title="레일 종류를 선택해주세요"
      children={
        <div>
          {options.map(option => (
            <SelectToggleButton
              key={option}
              label={option}
              checked={value === option}
              onClick={() => onChange(option)}
            />
          ))}
          <div className="flex flex-col">
            <SelectToggleButton
              label="직접 입력"
              checked={options.every(opt => value !== opt)}
              onClick={() => {
                onChange("");
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
            {options.every(opt => value !== opt) && (
              <div className="flex items-center gap-2 px-4 pb-3">
                <GrayVerticalLine />
                <BoxedInput
                  ref={inputRef}
                  type="text"
                  placeholder="브랜드, 소재, 두께 등"
                  className="w-full"
                  value={value}
                  onChange={e => onChange(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="py-5">
            <Button
              type="Brand"
              text="다음"
              onClick={() => {
                onClose();
              }}
            />
          </div>
        </div>
      }
      onClose={onClose}
    />
  );
}

// 카테고리별 폼 렌더링 함수
function renderCabinetFormByCategory(
  category: string,
  props: CabinetFormProps,
  upperProps?: UpperCabinetFormProps,
  lowerProps?: LowerCabinetFormProps,
  flapProps?: FlapCabinetFormProps,
  drawerProps?: DrawerCabinetFormProps,
  openCabinetFormProps?: OpenCabinetFormProps,
) {
  switch (category) {
    case "lower":
      return lowerProps ? (
        <LowerCabinetForm {...lowerProps} />
      ) : (
        <LowerCabinetForm {...(props as LowerCabinetFormProps)} />
      );
    case "upper":
      return upperProps ? (
        <UpperCabinetForm {...upperProps} />
      ) : (
        <UpperCabinetForm {...(props as UpperCabinetFormProps)} />
      );
    case "open":
      return openCabinetFormProps ? (
        <OpenCabinetForm {...openCabinetFormProps} />
      ) : (
        <OpenCabinetForm {...(props as OpenCabinetFormProps)} />
      );
    case "drawer":
      return drawerProps ? (
        <DrawerCabinetForm {...drawerProps} />
      ) : (
        <DrawerCabinetForm {...(props as DrawerCabinetFormProps)} />
      );
    case "flap":
      return flapProps ? (
        <FlapCabinetForm {...flapProps} />
      ) : (
        <FlapCabinetForm {...(props as FlapCabinetFormProps)} />
      );
    default:
      return <LowerCabinetForm {...(props as LowerCabinetFormProps)} />; // 기본값
  }
}

function CabinetPage() {
  return (
    <React.Suspense fallback={<div>로딩 중...</div>}>
      <CabinetPageContent />
    </React.Suspense>
  );
}

// 용도 및 장소 선택 시트 컴포넌트
function CabinetLocationSheet({
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

export default CabinetPage;
