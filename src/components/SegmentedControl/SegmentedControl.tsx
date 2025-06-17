import React from "react";

interface SegmentedControlProps {
  options: string[];
  value: number;
  onChange: (index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex w-full items-center justify-between overflow-hidden rounded-[10px] bg-gray-100 p-[2px]">
      {options.map((option, idx) => (
        //디자인 파일엔 이 버튼이 semgmented item으로 정의되어있지만
        //front 환경에서 따로 분리하진 않겠음
        <button
          key={option}
          onClick={() => onChange(idx)}
          className={`flex-1 cursor-pointer rounded-[8px] border-none px-2 py-1 text-center text-[15px] font-500 ${
            value === idx
              ? "z-0 bg-white text-gray-800 shadow-[0px_2px_8px_0px_rgba(3,7,18,0.10)]"
              : "text-gray-500"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
