import InputClear from "public/icons/InputClear";
import React, { useRef, useState } from "react";

interface BoxedInputProps {
  label?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  value?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  type?: "text" | "password" | "tel" | "number";
  required?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string | null;
  placeholderClassName?: string;
}

// React.forwardRef를 사용하여 ref 전달 가능하게 변경
const BoxedInput = React.forwardRef<HTMLInputElement, BoxedInputProps>(
  (
    {
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
      className,
      placeholderClassName = "placeholder-gray-300",
    },
    ref
  ) => {
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
      if (onChange && inputRef.current) {
        const event = {
          ...({} as React.ChangeEvent<HTMLInputElement>),
          target: inputRef.current,
          currentTarget: inputRef.current,
        };
        inputRef.current.value = "";
        onChange(event);
      }
      setIsFocused(true);
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    // number 타입 input에서 스크롤로 숫자 변경 방지
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        e.currentTarget.blur();
      }
    };

    // ref 우선순위: 외부 ref → 내부 ref
    const mergedRef = (node: HTMLInputElement) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
      inputRef.current = node;
    };

    return (
      <div className={`flex flex-col gap-2${className ? ` ${className}` : ""}`}>
        {label && <label className="text-[14px] font-400 text-gray-600">{label}</label>}
        <div
          className={`flex items-center justify-between rounded-[12px] border px-4 transition-colors ${error
            ? "border-[2px] border-[#FCA5A5] py-[11px]"
            : "border border-gray-200 py-3 focus-within:border-[2px] focus-within:border-brand-300 focus-within:py-[11px] hover:border-[2px] hover:border-brand-100 hover:py-[11px]"
            } `}
        >
          <input
            className={`w-full text-[17px] font-400 text-gray-700 ${placeholderClassName} focus:outline-none`}
            placeholder={placeholder}
            value={inputValue ?? ""}
            onChange={handleInputChange}
            type={type}
            inputMode={type === "number" ? "numeric" : undefined}
            required={required}
            disabled={disabled}
            ref={mergedRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={onClick}
            onWheel={handleWheel}
          />
          {isFocused && (
            <button
              type="button"
              onMouseDown={e => {
                e.preventDefault();
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
  }
);

export default BoxedInput;