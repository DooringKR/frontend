import React from "react";

import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BoxedInput from "@/components/Input/BoxedInput";
import { Switch } from "@/components/Switches/Switches";

interface DepthInputSectionProps {
  depth: number | null;
  setDepth: (v: number | null) => void;
  isDepthIncrease: boolean;
  setIsDepthIncrease: (v: boolean) => void;
  depthIncrease: number | null;
  setDepthIncrease: (v: number | null) => void;
  depthError: string;
}

const DepthInputSection: React.FC<DepthInputSectionProps> = ({
  depth,
  setDepth,
  isDepthIncrease,
  setIsDepthIncrease,
  depthIncrease,
  setDepthIncrease,
  depthError,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <BoxedInput
        type="number"
        label={<><span>가로 (mm)</span><span className="text-orange-500 ml-1">*</span></>}
        placeholder="가로를 입력해주세요"
        value={depth}
        onChange={e => {
          const value = e.target.value;
          setDepth(value ? Number(value) : null);
        }}
        error={!!depthError}
        helperText={depthError}
      />
      <div className="flex gap-2">
        <GrayVerticalLine isExpanded={isDepthIncrease} expandedMinHeight="144px" />
        <div className="flex w-full flex-col">
          <SelectToggleButton
            checked={isDepthIncrease}
            customIcon={<Switch checked={isDepthIncrease} />}
            label={"가로 키우기"}
            onClick={() => {
              if (isDepthIncrease) {
                setDepthIncrease(null); // false가 될 때 초기화
              }
              setIsDepthIncrease(!isDepthIncrease);
            }}
          />
          {isDepthIncrease && (
            <div className="flex flex-col items-center">
              <BoxedInput
                type="number"
                placeholder="추가할 깊이(mm)를 입력해주세요"
                className="w-full"
                value={depthIncrease}
                onChange={e => {
                  const value = e.target.value;
                  setDepthIncrease(value ? Number(value) : null);
                }}
              />
              <SelectToggleButton
                checked={isDepthIncrease}
                customIcon={
                  <div className="text-[17px]/[24px] font-600 text-[#3B82F6]">
                    {depthIncrease !== null && depth !== null
                      ? `${depthIncrease + depth}mm`
                      : "값을 입력해주세요"}
                  </div>
                }
                label={"합산 깊이"}
                onClick={() => { }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepthInputSection;
