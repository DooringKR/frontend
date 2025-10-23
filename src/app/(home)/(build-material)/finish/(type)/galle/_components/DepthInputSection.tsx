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
    </div>
  );
};

export default DepthInputSection;
