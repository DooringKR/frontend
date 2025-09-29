import React from "react";

import Button from "@/components/Button/Button";
import FlapDoorPreview from "@/components/DoorPreview/FlapDoorPreview";
import BoxedInput from "@/components/Input/BoxedInput";

interface FlapDoorFormProps {
  DoorWidth: number | null;
  setDoorWidth: (value: number | null) => void;
  DoorHeight: number | null;
  setDoorHeight: (value: number | null) => void;
  boringNum: 2 | 3 | 4;
  setBoringNum: (value: 2 | 3 | 4) => void;
  boringSize: (number | null)[];
  setBoringSize: (value: (number | null)[]) => void;
  request: string;
  setRequest: (value: string) => void;
  widthError: string;
  heightError: string;
  boringError: string;
  doorColor: string;
}

export default function FlapDoorForm({
  DoorWidth,
  setDoorWidth,
  DoorHeight,
  setDoorHeight,
  boringNum,
  setBoringNum,
  boringSize,
  setBoringSize,
  widthError,
  heightError,
  boringError,
  doorColor,
}: FlapDoorFormProps) {
  return (
    <>
      <BoxedInput
        type="number"
        label="가로 길이(mm)"
        placeholder="가로 길이를 입력해주세요"
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
        label="세로 길이(mm)"
        placeholder="세로 길이를 입력해주세요"
        value={DoorHeight}
        onChange={e => {
          const value = e.target.value;
          setDoorHeight(value ? Number(value) : null);
        }}
        error={!!heightError}
        helperText={heightError}
      />
      <div className="flex flex-col gap-2">
        <div className="w-full text-[14px] font-400 text-gray-600">경첩</div>
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
        {boringError && <div className="px-1 text-sm text-red-500">{boringError}</div>}
      </div>
      <div className="flex items-center justify-center pb-5 pt-5">
        <FlapDoorPreview
          DoorWidth={DoorWidth}
          DoorHeight={DoorHeight}
          boringNum={boringNum}
          boringSize={boringSize}
          onChangeBoringSize={setBoringSize}
          doorColor={doorColor}
        />
      </div>
    </>
  );
}
