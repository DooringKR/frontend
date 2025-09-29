import React from "react";

import BoxedInput from "@/components/Input/BoxedInput";

interface DrawerDoorFormProps {
  DoorWidth: number | null;
  setDoorWidth: (value: number | null) => void;
  DoorHeight: number | null;
  setDoorHeight: (value: number | null) => void;
  request: string;
  setRequest: (value: string) => void;
  widthError: string;
  heightError: string;
}

export default function DrawerDoorForm({
  DoorWidth,
  setDoorWidth,
  DoorHeight,
  setDoorHeight,
  widthError,
  heightError,
}: DrawerDoorFormProps) {
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
    </>
  );
}
