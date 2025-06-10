import React from "react";

interface SegmentedControlProps {
    options: string[];
    value: number;
    onChange: (index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
    options,
    value,
    onChange,
}) => {
    return (
        <div
            className="flex justify-between items-center w-full rounded-[10px] p-[2px] bg-gray-100"
        >
            {options.map((option, idx) => (
                //디자인 파일엔 이 버튼이 semgmented item으로 정의되어있지만
                //front 환경에서 따로 분리하진 않겠음
                <button
                    key={option}
                    onClick={() => onChange(idx)}
                    className={`
                        flex-1 px-2 py-1 rounded-[8px] border-none
                        text-center text-[15px] font-500 cursor-pointer
                        ${value === idx
                            ? "bg-white text-gray-800 shadow-[0px_2px_8px_0px_rgba(3,7,18,0.10)]"
                            : "text-gray-500"}`}

                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default SegmentedControl;