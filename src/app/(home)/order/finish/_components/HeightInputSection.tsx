import React from "react";

import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BoxedInput from "@/components/Input/BoxedInput";
import { Switch } from "@/components/Switches/Switches";

interface HeightInputSectionProps {
  height: number | null;
  setHeight: (v: number | null) => void;
  isHeightIncrease: boolean;
  setIsHeightIncrease: (v: boolean) => void;
  heightIncrease: number | null;
  setHeightIncrease: (v: number | null) => void;
  heightError: string;
}

const HeightInputSection: React.FC<HeightInputSectionProps> = ({
  height,
  setHeight,
  isHeightIncrease,
  setIsHeightIncrease,
  heightIncrease,
  setHeightIncrease,
  heightError,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <BoxedInput
        label="높이 (세로)"
        placeholder="높이를 입력해주세요"
        value={height !== null ? `${height}mm` : ""}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          setHeight(value ? Number(value) : null);
        }}
        error={!!heightError}
        helperText={heightError}
      />
      <div className="flex gap-2">
        <GrayVerticalLine isExpanded={isHeightIncrease} expandedMinHeight="144px" />
        <div className="flex w-full flex-col">
          <SelectToggleButton
            checked={isHeightIncrease}
            customIcon={<Switch checked={isHeightIncrease} />}
            label={"높이 키우기"}
            onClick={() => {
              if (isHeightIncrease) {
                setHeightIncrease(null); // false가 될 때 초기화
              }
              setIsHeightIncrease(!isHeightIncrease);
            }}
          />
          {isHeightIncrease && (
            <div className="flex flex-col items-center">
              <BoxedInput
                type="text"
                placeholder="추가할 높이를 입력해주세요"
                className="w-full"
                value={heightIncrease !== null ? `${heightIncrease}mm` : ""}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setHeightIncrease(value ? Number(value) : null);
                }}
              />
              <SelectToggleButton
                checked={isHeightIncrease}
                customIcon={
                  <div className="text-[17px]/[24px] font-600 text-[#3B82F6]">
                    {heightIncrease !== null && height !== null
                      ? `${heightIncrease + height}mm`
                      : "값을 입력해주세요"}
                  </div>
                }
                label={"합산 높이"}
                onClick={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeightInputSection;
