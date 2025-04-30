"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { HingeValues } from "@/types/hinge";

interface NormalProps {
  hingeCount: number;
  hingeDirection: "left" | "right";
  height: string;
  width: string;
  hingeValues: HingeValues
  setHingeValues: React.Dispatch<
    React.SetStateAction<HingeValues>
  >;
  setHingeDirection: (direction: "left" | "right") => void;
}

export default function Normal({
  hingeCount,
  hingeDirection,
  height,
  width,
  hingeValues,
  setHingeValues,
  setHingeDirection,
}: NormalProps) {

  type HingeKey = keyof typeof hingeValues;

  const hingeInputs: readonly HingeKey[] =
  {
    2: ["topHinge", "bottomHinge"] as const,
    3: ["topHinge", "middleHinge", "bottomHinge"] as const,
    4: ["topHinge", "middleTopHinge", "middleBottomHinge", "bottomHinge"] as const,
  }[hingeCount] || [];




  const handleInputChange = (key: HingeKey, value: string) => {
    setHingeValues({ ...hingeValues, [key]: value });
  };

  return (
    <>
      <div className="flex h-8 w-full overflow-hidden rounded-lg border-[2px] border-[#d9d9d9] bg-[#d9d9d9]">
        {(["left", "right"] as const).map(dir => (
          <Button
            key={dir}
            type="button"
            size="large"
            onClick={() => setHingeDirection(dir)}
            className={`h-7 w-1/2 text-center font-medium ${
              hingeDirection === dir ? "bg-white font-semibold shadow-xl" : "bg-transparent"
            }`}
          >
            {dir === "left" ? "좌경" : "우경"}
          </Button>
        ))}
      </div>

      <div className="flex w-full items-center">
        {hingeDirection === "right" ? (
          <div className="flex w-1/3 items-center justify-center">
            <p className="text-center text-sm text-gray-600">{height || "0"}</p>
          </div>
        ) : (
          <div className="relative flex h-[300px] w-1/3 flex-col items-end justify-between py-5">
            {hingeInputs.map(key => (
              <Input
                key={key}
                type="text"
                name={key}
                placeholder="보링"
                value={hingeValues[key]}
                onChange={e => handleInputChange(key, e.target.value)}
                className="mr-3 h-10 w-[63px]"
              />
            ))}
          </div>
        )}

        <div
          className={`relative flex h-[300px] w-1/3 flex-col justify-between border border-black bg-[#f9f9f1] px-3 py-9 ${
            hingeDirection === "right" ? "items-end" : "items-start"
          }`}
        >
          {hingeInputs.map(key => (
            <div key={key} className="h-3 w-3 rounded-full border bg-white" />
          ))}
        </div>
        {hingeDirection === "right" ? (
          <div className="relative flex h-[300px] w-1/3 flex-col items-start justify-between py-5">
            {hingeInputs.map(key => (
              <Input
                key={key}
                type="text"
                name={key}
                placeholder="보링"
                value={hingeValues[key]}
                onChange={e => handleInputChange(key, e.target.value)}
                className="ml-3 h-10 w-[63px]"
              />
            ))}
          </div>
        ) : (
          <div className="flex w-1/3 items-center justify-center">
            <p className="text-center text-sm text-gray-600">{height}</p>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-gray-600">{width}</p>
    </>
  );
}
