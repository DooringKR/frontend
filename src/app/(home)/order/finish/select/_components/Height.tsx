"use client";

import { useState } from "react";

import Input from "@/components/Input/Input";

interface DepthProps {
  height: {
    baseHeight: string | null;
    additionalHeight: string | null;
  };
  setHeight: React.Dispatch<
    React.SetStateAction<{
      baseHeight: string | null;
      additionalHeight: string | null;
    }>
  >;
}

function Height({ height, setHeight }: DepthProps) {
  const [isHeightExtended, setIsHeightExtended] = useState(false);

  const handleToggle = () => {
    setIsHeightExtended(prev => {
      const newState = !prev;
      setHeight(d => ({
        ...d,
        additionalHeight: newState ? "20" : "",
      }));
      return newState;
    });
  };

  const sumDepth = (Number(height.baseHeight) || 0) + (Number(height.additionalHeight) || 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-4">
        <label className="text-sm font-medium">높이</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="height"
            placeholder="높이"
            value={height.baseHeight ?? ""}
            onChange={e =>
              setHeight(prev => ({
                ...prev,
                baseHeight: e.target.value.replace(/^0+(?=\d)/, ""),
              }))
            }
            className="w-60"
          />
          <span className="text-sm text-black">mm</span>
        </div>
      </div>
      <div className="rounded-md bg-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">높이 키우기</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isHeightExtended}
              onChange={handleToggle}
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>
        {isHeightExtended && (
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="number"
              name="additionalHeight"
              placeholder="추가 높이"
              value={height.additionalHeight ?? ""}
              onChange={e =>
                setHeight(prev => ({
                  ...prev,
                  additionalHeight: e.target.value.replace(/^0+(?=\d)/, ""),
                }))
              }
              className="w-60"
            />
            <span className="text-sm text-black">mm</span>
          </div>
        )}
        <div className="mt-2 flex justify-between text-sm font-medium">
          <span>합산 높이</span>
          <span className="font-bold text-black">
            {height.baseHeight !== "" && Number(height.baseHeight) > 0
              ? `${sumDepth}mm`
              : "높이를 입력해주세요"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Height;
