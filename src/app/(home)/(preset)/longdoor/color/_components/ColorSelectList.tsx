import SelectToggleButton from "@/components/Button/SelectToggleButton";
import React from "react";

export function parseColorName(name: string) {
    const nameParts = name.split(",").map((s: string) => s.trim());
    return {
        label: [nameParts[1], nameParts[3]].filter(Boolean).join(" "),
        description: [nameParts[0], nameParts[2]].filter(Boolean).join(" ∙ "),
        showInfoIcon: nameParts[3] === "헤링본 - 미백색",
    };
}

interface ColorSelectListProps {
    filteredColors: any[];
    selectedColor: string | null;
    setSelectedColor: (name: string) => void;
}

const ColorSelectList: React.FC<ColorSelectListProps> = ({ filteredColors, selectedColor, setSelectedColor }) => {
    return (
        <div className="flex flex-col gap-2 px-1 pb-5 pt-3">
            {filteredColors.length === 0 ? (
                <div className="flex items-center justify-center px-4 py-3 text-center text-[17px]/[24px] font-400 text-gray-400">
                    검색 결과가 없어요
                </div>
            ) : (
                filteredColors.map((item, idx) => {
                    const { label, description, showInfoIcon } = parseColorName(item.name);
                    return (
                        <div key={idx}>
                            <SelectToggleButton
                                label={label}
                                description={description}
                                showInfoIcon={showInfoIcon}
                                checked={selectedColor === item.name ? true : undefined}
                                imageSrc={item.image}
                                onClick={() => {
                                    setSelectedColor(item.name);
                                }}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ColorSelectList;


