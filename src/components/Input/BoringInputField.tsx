import React, { useState } from "react";

interface BoringInputFieldProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
}

const BoringInputField: React.FC<BoringInputFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
    <input
      type="number"
      className={`w-full rounded-[10px] px-1 py-[7px] outline-none text-[16px] ${error
        ? "border-[2px] border-red-300"
        : "border-[1px] border-gray-200 hover:border-[2px] hover:border-brand-100 focus:border-[2px] focus:border-brand-300"
        } text-center placeholder-gray-300`}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export default BoringInputField;
