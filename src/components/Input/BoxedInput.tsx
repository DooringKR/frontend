import InputClear from "public/icons/InputClear";
import React, { useRef, useState } from "react";

interface BoxedInputProps {
  label?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  value?: any;
  onChange?: (value: string) => void;
  type?: "text" | "password" | "tel" | "number";
  required?: boolean;
  disabled?: boolean;
}

const BoxedInput: React.FC<BoxedInputProps> = ({
  label,
  error,
  helperText,
  placeholder,
  value,
  onChange,
  type,
  required,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // input 요소에 대한 ref 추가

  const handleClear = () => {
    setInputValue("");
    if (onChange) {
      onChange("");
    }
    setIsFocused(true); // Clear 버튼 클릭 시 다시 focus
    inputRef.current?.focus(); // Clear 버튼 클릭 시 input에 포커스
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-400 text-gray-600">{label}</label>
      <div
        className={`flex items-center justify-between rounded-[12px] border-[1px] px-4 py-3 transition-colors ${error ? "border-[2px] border-[#FCA5A5]" : "border-gray-200 focus-within:border-[2px] focus-within:border-brand-300 hover:border-[2px] hover:border-brand-100 focus-within:hover:border-brand-300"} `}
      >
        <input
          className="w-full text-[17px] font-400 text-gray-700 placeholder-gray-300 focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          type={type}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {true ? (
          <button type="button" onClick={handleClear}>
            <InputClear />
          </button>
        ) : null}
      </div>
      {error && <div className="text-[15px] font-400 text-red-500">{helperText}</div>}
    </div>
  );
};

export default BoxedInput;
