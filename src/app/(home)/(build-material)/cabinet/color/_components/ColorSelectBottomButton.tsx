import { CABINET_COLOR_LIST } from "@/constants/colorList";
import Image from "next/image";
import React from "react";

import BottomButton from "@/components/BottomButton/BottomButton";

import { parseColorName } from "./ColorSelectList";

interface ColorSelectBottomButtonProps {
  selectedColor: string | null;
  onClick: () => void;
  type: string;
}

const ColorSelectBottomButton: React.FC<ColorSelectBottomButtonProps> = ({
  selectedColor,
  onClick,
  type,
}) => {
  return (
    <BottomButton
      children={
        selectedColor && (
          <div className="flex items-center justify-center gap-2 bg-white px-5 pb-4 pt-2">
            <Image
              src={
                CABINET_COLOR_LIST.find(item => item.name === selectedColor)?.image || ""
              }
              alt={selectedColor}
              width={20}
              height={20}
              className="border-1 h-5 w-5 rounded-[4px] border-[#030712]/5 object-cover"
            />
            <div className="text-[16px]/[22px] font-500 text-[#3B82F6]">
              {(() => {
                const { label, description } = parseColorName(selectedColor);
                return `${label} (${description}) 선택됨`;
              })()}
            </div>
          </div>
        )
      }
      type={"1button"}
      button1Text={"다음"}
      className="fixed bottom-0 w-full max-w-[460px]"
      button1Disabled={!selectedColor}
      onButton1Click={onClick}
    />
  );
};

export default ColorSelectBottomButton;
