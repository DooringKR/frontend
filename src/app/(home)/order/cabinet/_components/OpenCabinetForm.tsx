import React from "react";

import Button from "@/components/Button/Button";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";

type OpenCabinetFormProps = {
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
  router: any;
  riceRail: string;
  setRiceRail: (v: string) => void;
  lowerDrawer: string;
  setLowerDrawer: (v: string) => void;
  finishType: string;
  setFinishType: (v: string) => void;
  widthError: string;
  heightError: string;
  depthError: string;
};

const OpenCabinetForm: React.FC<OpenCabinetFormProps> = props => {
  const {
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
    riceRail,
    setRiceRail,
    lowerDrawer,
    setLowerDrawer,
    finishType,
    setFinishType,
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
        type="number"
        label="너비(mm)"
        placeholder="너비를 입력해주세요"
        value={DoorWidth}
        onChange={e => {
          const value = e.target.value;
          setDoorWidth(value ? Number(value) : null);
        }}
        error={!!widthError}
        helperText={widthError}
      />
      <BoxedInput
        type="number"
        label="높이(mm)"
        placeholder="높이를 입력해주세요"
        value={DoorHeight}
        onChange={e => {
          const value = e.target.value;
          setDoorHeight(value ? Number(value) : null);
        }}
        error={!!heightError}
        helperText={heightError}
      />
      <BoxedInput
        type="number"
        label="깊이(mm)"
        placeholder="깊이를 입력해주세요"
        value={DoorDepth}
        onChange={e => {
          const value = e.target.value;
          setDoorDepth(value ? Number(value) : null);
        }}
        error={!!depthError}
        helperText={depthError}
      />
      <div className="flex flex-col gap-2">
        <div className="text-[14px]/[20px] font-400 text-gray-600">밥솥 레일 추가 여부</div>
        <div className="flex w-full gap-2">
          <Button
            type={riceRail === "추가" ? "BrandInverse" : "GrayLarge"}
            text="추가"
            onClick={() => setRiceRail("추가")}
          />
          <Button
            type={riceRail === "추가 안 함" ? "BrandInverse" : "GrayLarge"}
            text="추가 안 함"
            onClick={() => setRiceRail("추가 안 함")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[14px]/[20px] font-400 text-gray-600">하부 서랍장 추가 여부</div>
        <div className="flex w-full gap-2">
          <Button
            type={lowerDrawer === "추가" ? "BrandInverse" : "GrayLarge"}
            text="추가"
            onClick={() => setLowerDrawer("추가")}
          />
          <Button
            type={lowerDrawer === "추가 안 함" ? "BrandInverse" : "GrayLarge"}
            text="추가 안 함"
            onClick={() => setLowerDrawer("추가 안 함")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-[14px]/[20px] font-400 text-gray-600">마감 방식</div>
        <div className="flex w-full gap-2">
          <Button
            type={finishType === "막우라" ? "BrandInverse" : "GrayLarge"}
            text="막우라"
            onClick={() => setFinishType("막우라")}
          />
          <Button
            type={finishType === "우라홈" ? "BrandInverse" : "GrayLarge"}
            text="우라홈"
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

export default OpenCabinetForm;
