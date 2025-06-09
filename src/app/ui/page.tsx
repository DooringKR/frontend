"use client";

import React, { useState } from "react";

import SelectToggleButton from "@/components/Button/SelectToggleButton";
import DoorPreviewIcon from "@/components/DoorPreviewIcon/DoorPreviewIcon";

import BoxedInput from "../../components/Input/BoxedInput";

const Page = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChange = (value: string) => {
    setValue(value);
    setError(value.length < 3 ? "3글자 이상 입력하세요." : undefined);
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div style={{ maxWidth: 400, margin: "2rem auto" }}>
        <BoxedInput
          label="이름"
          value={value}
          onChange={handleChange}
          error={error}
          placeholder="이름을 입력하세요"
        />
      </div>
      <SelectToggleButton
        imageSrc="https://via.placeholder.com/48"
        label="Option 1"
        description="This is the first option"
        checked={true}
        onClick={() => console.log("Option 1 clicked")}
      />
      <SelectToggleButton
        label="Option 2"
        // checked={true}
        onClick={() => console.log("Option 2 clicked")}
      />
      <DoorPreviewIcon
        DoorType={"플랩문"}
        FatOrTall={"Same"}
        BoringDirection={"left"}
        BoringNum={2}
      />
      <DoorPreviewIcon
        DoorType={"플랩문"}
        FatOrTall={"Same"}
        BoringDirection={"left"}
        BoringNum={3}
      />
      <DoorPreviewIcon
        DoorType={"플랩문"}
        FatOrTall={"Same"}
        BoringDirection={"left"}
        BoringNum={4}
      />
    </div>
  );
};

export default Page;
