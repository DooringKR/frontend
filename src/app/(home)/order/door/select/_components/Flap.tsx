"use client";

import { HingeValues } from "@/types/hinge";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

interface FlapProps {
  hingeCount: number | null;
  height: string;
  width: string;
  hingeValues: HingeValues;
  setHingeCount: (count: number) => void;
  setHingeValues: React.Dispatch<React.SetStateAction<HingeValues>>;
}

function Flap({
  hingeCount,
  height,
  width,
  hingeValues,
  setHingeValues,
  setHingeCount,
}: FlapProps) {
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
    <div className="w-full">
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
      <div className="my-5 flex w-full justify-between pr-5">
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
      <div className="flex w-full items-center gap-2">
        <div className="relative flex h-32 w-full justify-between border border-black bg-[#f9f9f1] px-5 pt-3">
          {hingeInputs.map(key => (
            <div key={key} className="h-3 w-3 rounded-full border bg-white" />
          ))}
        </div>
        <p className="w-5">{height}</p>
      </div>
      <p className="mt-1 text-center">{width}</p>
      {height > width && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="flex items-center">
                <h2 className="text-2xl font-semibold">세로가 가로보다 긴 게 맞나요?</h2>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
                닫기
              </button>
            </div>
            <div>
              <p className="text-base text-[#757575]">
                {" "}
                세로 길이를 가로 길이보다 크게 입력하셨어요. <br /> 플랩문으로 주문하는게 맞는지
                확인해주세요.
              </p>
            </div>
            <p>일반문 주문으로 바꾸기</p>
            <div className="flex w-full flex-grow gap-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full border bg-[#d9d9d9]"
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
    </div>
  );
}

export default Flap;
