import React, { useRef, useState } from 'react';
import { Brand_Green500 } from '@/ui-assets/color';
import InputClear from 'public/icons/InputClear';
import { FieldError } from 'react-hook-form';

interface UnderlinedInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'tel';
  // error?: FieldError | undefined;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const UnderlinedInput: React.FC<UnderlinedInputProps> = ({
  label,
  value = '',
  placeholder = '',
  type = 'text',
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // input 요소에 대한 ref 추가

  //활성화된 상태면 에러를 그대로 사용, 비활성화상태는? 이 코드 필요한지 모르겠지만 일단 남겨둠
  const effectiveError = disabled ? undefined : error;

  const labelColor = effectiveError
    ? "text-red-500"
    : isFocused
      ? "text-brand-500"
      : "text-gray-300";

  const borderColor = effectiveError
    ? "border-red-500"
    : isFocused
      ? "border-brand-500"
      : "border-gray-300";

  const textColor = "text-[#1e1e1e]";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange('');
    }
    setIsFocused(true); // Clear 버튼 클릭 시 다시 focus
    inputRef.current?.focus(); // Clear 버튼 클릭 시 input에 포커스
  };

  return (
    <div className="relative w-full flex flex-col gap-1">
      {/* Label */}
      <div className='h-[20px]'>
      {(isFocused || inputValue) && ( // 조건부 렌더링 추가
        <label
            className={`text-[14px] font-normal leading-[1.4] ${labelColor}`}
        >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        )}
      </div>
      

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef} // ref 연결
          type={type}
          className={`w-full border-b-2 bg-transparent py-2 text-[23px] outline-none transition-all pr-8 ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-brand-500'
          }`}
          value={inputValue}
          placeholder={isFocused ? '' : placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
        />
        {/* Clear 버튼 */}
        {inputValue && (
          <button
            type="button"
            className={`absolute right-0 top-1/2 transform -translate-y-1/2`}
            onClick={() => {
              console.log('Clear button clicked'); // 디버깅 로그 추가
              handleClear();
            }}
          >
            <InputClear />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <div
        className={`mt-1 text-[15px] ${
          error ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        {helperText}
      </div>
    </div>
  );
};

export default UnderlinedInput;