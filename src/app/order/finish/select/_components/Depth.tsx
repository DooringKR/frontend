"use client";

import { useState } from "react";

import Input from "@/components/Input/Input";

interface DepthProps {
  depth: {
    baseDepth: string | null;
    additionalDepth: string | null;
  };
  setDepth: React.Dispatch<
    React.SetStateAction<{
      baseDepth: string | null;
      additionalDepth: string | null;
    }>
  >;
}

function Depth({ depth, setDepth }: DepthProps) {
  const [isDepthExtended, setIsDepthExtended] = useState(false);

  const handleToggle = () => {
    setIsDepthExtended(prev => {
      const newState = !prev;
      setDepth(d => ({
        ...d,
        additionalDepth: newState ? "20" : "",
      }));
      return newState;
    });
  };

  const sumDepth = (Number(depth.baseDepth) || 0) + (Number(depth.additionalDepth) || 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-4">
        <label className="text-sm font-medium">깊이</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="depth"
            placeholder="깊이"
            value={depth.baseDepth ?? ""}
            onChange={e =>
              setDepth(prev => ({
                ...prev,
                baseDepth: e.target.value.replace(/^0+(?=\d)/, ""),
              }))
            }
            className="w-60"
          />
          <span className="text-sm text-black">mm</span>
        </div>
      </div>
      <div className="rounded-md bg-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">깊이 키우기</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isDepthExtended}
              onChange={handleToggle}
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>
        {isDepthExtended && (
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="number"
              name="additionalDepth"
              placeholder="추가 깊이"
              value={depth.additionalDepth ?? ""}
              onChange={e =>
                setDepth(prev => ({
                  ...prev,
                  additionalDepth: e.target.value.replace(/^0+(?=\d)/, ""),
                }))
              }
              className="w-60"
            />
            <span className="text-sm text-black">mm</span>
          </div>
        )}
        <div className="mt-2 flex justify-between text-sm font-medium">
          <span>합산 깊이</span>
          <span className="font-bold text-black">
            {depth.baseDepth !== "" && Number(depth.baseDepth) > 0
              ? `${sumDepth}mm`
              : "깊이를 입력해주세요"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Depth;
