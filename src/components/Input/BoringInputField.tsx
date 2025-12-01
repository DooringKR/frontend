import React, { useState } from "react";

interface BoringInputFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const BoringInputField: React.FC<BoringInputFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // number 타입 input에서 스크롤로 숫자 변경 방지
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  // border color 결정
  let borderColor = "border-gray-200";
  if (error) {
    borderColor = "border-red-300";
  } else if (isFocused) {
    borderColor = "border-brand-300";
  } else if (value) {
    borderColor = "border-gray-200";
  }

  return (
    <div className="relative flex w-full items-center">
      <input
        type="number"
        inputMode="numeric"
        className={`w-full rounded-[10px] px-1 py-[7px] text-[16px]/[22px] outline-none hover:py-[6px] focus:py-[6px] ${error
          ? "border-[2px] border-red-300"
          : "border-[1px] border-gray-200 hover:border-[2px] hover:border-brand-100 focus:border-[2px] focus:border-brand-300"
          } text-center placeholder-gray-300`}
        value={value === null ? "" : value}
        onChange={e => {
          const val = e.target.value.replace(/[^0-9]/g, "");
          if (val === "") {
            onChange(null);
          } else {
            onChange(Number(val));
          }
        }}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        onWheel={handleWheel}
      />
      {value && (
        <span className="ml-1 select-none text-[16px]/[22px] font-400 text-gray-700">mm</span>
      )}
    </div>
  );
};

export default BoringInputField;
