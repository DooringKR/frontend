import ChevronDown from "public/icons/chevron_down";
import React, { useState } from "react";

interface BoxedSelectProps {
  label?: string;
  options?: { value: string; label: string }[];
  value: string;
  onChange?: (value: string) => void;
  onClick?: () => void; // onClick prop 추가
  error?: string; // error prop 추가
  truncate?: boolean; // 텍스트 잘림 여부
}

const BoxedSelect: React.FC<BoxedSelectProps> = ({
  label,
  options,
  value,
  onChange,
  onClick,
  error,
  truncate = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex w-full flex-col gap-2">
      {/* Label */}
      <div
        className={`w-full text-[14px] font-400 ${isFocused && !error ? "text-brand-500" : "text-gray-600"}`}
      >
        {label}
      </div>
      <button
        className={`flex w-full items-center
          justify-between rounded-[12px]
           border transition-colors focus:outline-none
             ${error ? "border-[2px] border-red-300 py-[11px] px-[15px]"
            : isFocused ? "border-[2px] border-brand-300 py-[11px] px-[15px]"
              : "border-gray-200 px-4 py-3 hover:border-[2px] hover:border-brand-100 hover:py-[11px] hover:px-[15px]"} `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={() => {
          if (onClick) onClick(); // onClick prop 호출
          console.log("Current userType:", value); // 현재 store의 userType 출력
          onChange?.(value);
        }}
      >
        <div className={`${value && !error ? "text-gray-700" : "text-gray-300"} text-[17px] text-left ${truncate ? "truncate" : ""}`}>
          {error ? "잘못된 입력" : value || label}
        </div>
        <div className={`${isFocused && !error ? "text-brand-500" : "text-gray-200"}`}>
          <ChevronDown />
        </div>
      </button>
      {error && <span className="text-[15px] font-400 text-red-500">{error}</span>}
    </div>
  );
};

export default BoxedSelect;
