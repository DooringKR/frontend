import React from "react";

import Button from "@/components/Button/Button";
import NormalDoorPreview from "@/components/DoorPreview/NormalDoorPreview";
import BoxedInput from "@/components/Input/BoxedInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";

interface NormalDoorFormProps {
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
  widthError: string;
  heightError: string;
  boringError: string;
  doorColor: string;
}

export default function NormalDoorForm({
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
  widthError,
  heightError,
  boringError,
  doorColor,
}: NormalDoorFormProps) {
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
        {boringError && <div className="px-1 text-sm text-red-500">{boringError}</div>}
      </div>
      <SegmentedControl
        options={["좌경", "우경"]}
        value={boringDirection === "left" ? 0 : 1}
        onChange={index => setBoringDirection(index === 0 ? "left" : "right")}
      />
      <div className="flex items-center justify-center pt-5">
        <NormalDoorPreview
          DoorWidth={DoorWidth}
          DoorHeight={DoorHeight}
          boringDirection={boringDirection}
          boringNum={boringNum}
          boringSize={boringSize}
          onChangeBoringSize={setBoringSize}
          doorColor={doorColor}
        />
      </div>
    </>
  );
}
