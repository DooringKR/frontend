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
  onClick?: () => void;
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
  onClick,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // value prop이 바뀌면 inputValue도 동기화
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClear = () => {
    console.log("handleClear");
    setInputValue("");
    if (onChange) {
      onChange("");
    }
    setIsFocused(true);
    inputRef.current?.focus();
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
        className={`flex items-center justify-between rounded-[12px] border px-4 transition-colors ${
          error
            ? "border-[2px] border-[#FCA5A5] py-[11px]"
            : "border border-gray-200 py-3 focus-within:border-[2px] focus-within:border-brand-300 focus-within:py-[11px] hover:border-[2px] hover:border-brand-100 hover:py-[11px]"
        } `}
      >
        {/* {value} */}
        <input
          className="w-full text-[17px] font-400 text-gray-700 placeholder-gray-300 focus:outline-none"
          placeholder={placeholder}
          value={inputValue ?? ""}
          onChange={handleInputChange}
          type={type}
          required={required}
          disabled={disabled}
          ref={inputRef} // input 요소에 ref 연결
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={onClick}
        />
        {isFocused && (
          <button
            type="button"
            onMouseDown={e => {
              e.preventDefault(); // blur 방지
              handleClear();
            }}
          >
            <InputClear />
          </button>
        )}
      </div>
      {error && <div className="text-[15px] font-400 text-red-500">{helperText}</div>}
    </div>
  );
};

export default BoxedInput;
