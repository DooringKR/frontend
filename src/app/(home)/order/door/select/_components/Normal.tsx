"use client";

import { HingeValues } from "@/types/hinge";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

interface NormalProps {
  hingeCount: number | null;
  hingeDirection: "left" | "right" | null;
  height: string;
  width: string;
  hingeValues: HingeValues;
  setHingeCount: (count: number) => void;
  setHingeValues: React.Dispatch<React.SetStateAction<HingeValues>>;
  setHingeDirection: (direction: "left" | "right") => void;
}

function Normal({
  hingeCount,
  hingeDirection,
  height,
  width,
  hingeValues,
  setHingeCount,
  setHingeValues,
  setHingeDirection,
}: NormalProps) {
  type HingeKey = keyof typeof hingeValues;

  const hingeInputs: readonly HingeKey[] =
    hingeCount !== null
      ? ({
          2: ["topHinge", "bottomHinge"] as const,
          3: ["topHinge", "middleHinge", "bottomHinge"] as const,
          4: ["topHinge", "middleTopHinge", "middleBottomHinge", "bottomHinge"] as const,
        }[hingeCount] ?? [])
      : [];

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleInputChange = (key: HingeKey, value: string) => {
    setHingeValues({ ...hingeValues, [key]: value });
  };

  return (
    <>
      {height && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">경첩 개수</label>
          <div className="flex gap-2">
            {[2, 3, 4].map(num => (
              <Button
                key={num}
                type="button"
                onClick={() => setHingeCount(num)}
                selected={hingeCount === num}
                className="flex-grow"
              >
                {num}개
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="flex h-8 w-full overflow-hidden rounded-lg border-[2px] border-gray-100 bg-gray-100">
        {(["left", "right"] as const).map(dir => (
          <Button
            key={dir}
            type="button"
            onClick={() => setHingeDirection(dir)}
            selected={hingeDirection === dir}
            className="h-7 w-1/2 text-center font-medium"
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
          <div className="relative mr-5 flex h-[300px] w-1/3 flex-col items-end justify-between py-5">
            {hingeInputs.map(key => (
              <Input
                key={key}
                type="number"
                name={key}
                placeholder="보링"
                value={hingeValues[key] ?? ""}
                onChange={e => handleInputChange(key, e.target.value)}
                className="w-[80px] text-center"
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
                type="number"
                name={key}
                placeholder="보링"
                value={hingeValues[key]}
                onChange={e => handleInputChange(key, e.target.value)}
                className="ml-3 h-10 w-20 text-center"
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
      {Number(width || 0) > Number(height || 0) && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="flex items-center">
                <h2 className="text-2xl font-semibold">가로가 세로보다 긴 게 맞나요?</h2>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
                닫기
              </button>
            </div>
            <div>
              <p className="text-base text-[#757575]">
                {" "}
                가로 길이를 세로 길이보다 크게 입력하셨어요. <br /> 일반문으로 주문하는게 맞는지
                확인해주세요.
              </p>
            </div>
            <p>플랩문 주문으로 바꾸기</p>
            <div className="flex w-full flex-grow gap-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#d9d9d9]"
              >
                닫기
              </Button>
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                selected={true}
                className="w-full"
              >
                네 맞아요
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
export default Normal;
