import BottomButton from "@/components/BottomButton/BottomButton";
import Image from "next/image";
import { COLOR_LIST_BY_TYPE } from "@/constants/colorList";
import { parseColorName } from "./ColorSelectList";
import React from "react";

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
                            src={COLOR_LIST_BY_TYPE[type as keyof typeof COLOR_LIST_BY_TYPE]?.find(item => item.name === selectedColor)?.image || ""}
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
            className="fixed bottom-0 w-full max-w-[500px] bg-white px-5 pb-5"
            button1Disabled={!selectedColor}
            onButton1Click={onClick}
        />
    );
};

export default ColorSelectBottomButton; 