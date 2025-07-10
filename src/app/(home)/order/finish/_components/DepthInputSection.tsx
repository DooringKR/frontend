import BoxedInput from "@/components/Input/BoxedInput";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import { Switch } from "@/components/Switches/Switches";
import React from "react";

interface DepthInputSectionProps {
    depth: number | null;
    setDepth: (v: number | null) => void;
    isDepthIncrease: boolean;
    setIsDepthIncrease: (v: boolean) => void;
    depthIncrease: number | null;
    setDepthIncrease: (v: number | null) => void;
}

const DepthInputSection: React.FC<DepthInputSectionProps> = ({
    depth, setDepth, isDepthIncrease, setIsDepthIncrease, depthIncrease, setDepthIncrease
}) => {
    return (
        <div className="flex flex-col gap-2">
            <BoxedInput
                label="깊이"
                placeholder="깊이를 입력해주세요"
                value={depth !== null ? `${depth}mm` : ""}
                onChange={e => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setDepth(value ? Number(value) : null);
                }}
            />
            <div className="flex gap-2">
                <GrayVerticalLine isExpanded={isDepthIncrease} expandedMinHeight="144px" />
                <div className="flex w-full flex-col">
                    <SelectToggleButton
                        checked={isDepthIncrease}
                        customIcon={<Switch checked={isDepthIncrease} />}
                        label={"깊이 키우기"}
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
                                type="text"
                                placeholder="추가할 깊이를 입력해주세요"
                                className="w-full"
                                value={depthIncrease !== null ? `${depthIncrease}mm` : ""}
                                onChange={e => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
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