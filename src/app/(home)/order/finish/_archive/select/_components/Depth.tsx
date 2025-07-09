"use client";

import { useState } from "react";

import Input from "@/components/Input/Input";
import SizeInput from "@/components/SIzeInput/SizeInput";

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
    <div className="mx-5 flex flex-col gap-4">
      <SizeInput
        label="깊이"
        name="depth"
        placeholder="깊이"
        value={depth.baseDepth ?? ""}
        onChange={value =>
          setDepth(prev => ({
            ...prev,
            baseDepth: value.replace(/^0+(?=\d)/, ""), // 앞자리 0 제거
          }))
        }
      />

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
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-grow">
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
              />
            </div>
            <span className="mr-2">mm</span>
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
