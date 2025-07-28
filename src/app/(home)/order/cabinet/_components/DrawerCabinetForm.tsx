import React from "react";

import Button from "@/components/Button/Button";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";

type DrawerCabinetFormProps = {
  color: string;
  bodyMaterial: string;
  DoorWidth: number | null;
  DoorHeight: number | null;
  DoorDepth: number | null;
  request: string;
  drawerType: string;
  railType: string;
  finishType: string;
  setDoorWidth: (value: number | null) => void;
  setDoorHeight: (value: number | null) => void;
  setDoorDepth: (value: number | null) => void;
  setRequest: (value: string) => void;
  setBodyMaterial: (value: string) => void;
  setIsBottomSheetOpen: (value: boolean) => void;
  setDrawerType: (value: string) => void;
  setRailType: (value: string) => void;
  setFinishType: (value: string) => void;
  isDrawerTypeSheetOpen: boolean;
  setIsDrawerTypeSheetOpen: (v: boolean) => void;
  isRailTypeSheetOpen: boolean;
  setIsRailTypeSheetOpen: (v: boolean) => void;
  router: any;
  widthError: string;
  heightError: string;
  depthError: string;
};

const DrawerCabinetForm: React.FC<DrawerCabinetFormProps> = props => {
  const {
    color,
    bodyMaterial,
    DoorWidth,
    DoorHeight,
    DoorDepth,
    request,
    drawerType,
    railType,
    finishType,
    setDoorWidth,
    setDoorHeight,
    setDoorDepth,
    setRequest,
    setBodyMaterial,
    setIsBottomSheetOpen,
    setDrawerType,
    setRailType,
    setFinishType,
    isDrawerTypeSheetOpen,
    setIsDrawerTypeSheetOpen,
    isRailTypeSheetOpen,
    setIsRailTypeSheetOpen,
    router,
    widthError,
    heightError,
    depthError,
  } = props;

  return (
    <div className="flex flex-col gap-5 px-5">
      <BoxedSelect
        label="도어 색상"
        options={[]}
        value={color}
        onClick={() => router.back()}
        onChange={() => {}}
      />
      <BoxedSelect
        label="몸통 소재 및 두께"
        options={[]}
        value={bodyMaterial}
        onClick={() => setIsBottomSheetOpen(true)}
        onChange={() => {}}
      />
      <BoxedInput
        type="text"
        label="너비(mm)"
        placeholder="너비를 입력해주세요"
        value={DoorWidth !== null ? `${DoorWidth}mm` : ""}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          setDoorWidth(value ? Number(value) : null);
        }}
        error={!!widthError}
        helperText={widthError}
      />
      <BoxedInput
        type="text"
        label="높이(mm)"
        placeholder="높이를 입력해주세요"
        value={DoorHeight !== null ? `${DoorHeight}mm` : ""}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          setDoorHeight(value ? Number(value) : null);
        }}
        error={!!heightError}
        helperText={heightError}
      />
      <BoxedInput
        type="text"
        label="깊이(mm)"
        placeholder="깊이를 입력해주세요"
        value={DoorDepth !== null ? `${DoorDepth}mm` : ""}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          setDoorDepth(value ? Number(value) : null);
        }}
        error={!!depthError}
        helperText={depthError}
      />
      <BoxedSelect
        label="서랍 종류"
        options={[]}
        value={drawerType}
        onClick={() => setIsDrawerTypeSheetOpen(true)}
        onChange={() => {}}
      />
      <BoxedSelect
        label="레일 종류"
        options={[]}
        value={railType}
        onClick={() => setIsRailTypeSheetOpen(true)}
        onChange={() => {}}
      />
      {/* DrawerTypeInputSheet, RailTypeInputSheet는 page.tsx에서 렌더링 */}
      <div className="flex flex-col gap-2">
        <div className="text-[14px]/[20px] font-400 text-gray-600">마감 방식</div>
        <div className="flex w-full gap-2">
          <Button
            type={finishType === "막우라" ? "BrandInverse" : "GrayLarge"}
            text={"막우라"}
            onClick={() => setFinishType("막우라")}
          />
          <Button
            type={finishType === "우라홈" ? "BrandInverse" : "GrayLarge"}
            text={"우라홈"}
            onClick={() => setFinishType("우라홈")}
          />
        </div>
      </div>
      <BoxedInput
        label="제작 시 요청사항"
        placeholder="제작 시 요청사항을 입력해주세요"
        value={request}
        onChange={e => setRequest(e.target.value)}
      />
    </div>
  );
};

export default DrawerCabinetForm;
