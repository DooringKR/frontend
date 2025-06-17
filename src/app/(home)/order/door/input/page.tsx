"use client";

import Door from "@/app/(home)/cart/_components/Door";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import DoorPreview from "@/components/DoorPreview/DoorPreview";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function DoorInfoInputPage() {
  //    const [isModalOpen, setIsModalOpen] = useState(false);
  const [boringNum, setBoringNum] = useState<2 | 3 | 4>(2);
  const [boringDirection, setBoringDirection] = useState<"left" | "right">("left");
  const [DoorWidth, setDoorWidth] = useState<number>();
  const [DoorHeight, setDoorHeight] = useState<number>();
  const [boringSize, setBoringSize] = useState<number[]>([]);

  // boringNum이 바뀔 때 boringSize 길이 자동 조정
  useEffect(() => {
    setBoringSize(prev => Array.from({ length: boringNum }, (_, i) => prev[i] ?? ""));
  }, [boringNum]);

  return (
    <div>
      <TopNavigator />
      <Header title="일반문 정보를 입력해주세요" />
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="색상"
          options={[]}
          value={""}
          onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
        />
        <BoxedInput
          type="number"
          label="가로 길이"
          value={DoorWidth}
          onChange={v => setDoorWidth(v === "" ? undefined : Number(v))}
        />
        <BoxedInput
          type="number"
          label="세로 길이"
          value={DoorHeight}
          onChange={v => setDoorHeight(v === "" ? undefined : Number(v))}
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
        <BoxedInput />
      </div>
      <BottomButton type={"1button"} />
    </div>
  );
}

export default DoorInfoInputPage;
