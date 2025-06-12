"use client";

import React, { useState } from "react";

import SelectToggleButton from "@/components/Button/SelectToggleButton";
import DoorPreviewIcon from "@/components/DoorPreviewIcon/DoorPreviewIcon";

import BoxedInput from "../../components/Input/BoxedInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import BoringInputField from "@/components/Input/BoringInputField";
import BoxedSelect from "@/components/Select/BoxedSelect";
import DoorPreview from "@/components/DoorPreview/DoorPreview";

const Page = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  // SegmentedControl의 value 상태 추가
  const [segmentValue, setSegmentValue] = useState(0);

  const handleChange = (value: string) => {
    setValue(value);
    setError(value.length < 3 ? "3글자 이상 입력하세요." : undefined);
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="p-5 justify-center items-center flex flex-col">
        <DoorPreview
          DoorWidth={0}
          DoorHeight={0}
          boringDirection={"right"}
          boringNum={4}
          boringSize={[]} />
      </div>
      <BoxedSelect
        label="레이블"
        options={[]}
        value={"에러값"}
        error="에러 메시지"
        onChange={function (value: string): void {
          throw new Error("Function not implemented.");
        }} />
      <BoringInputField
        placeholder="이름"
        value={value}
        onChange={handleChange}
        error={error}
      />
      <SegmentedControl
        options={["레이블 1", "레이블 2"]}
        value={segmentValue}
        onChange={setSegmentValue}
      />
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
