import InputClear from "public/icons/InputClear";
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { FieldError } from "react-hook-form";

interface UnderlinedInputProps {
    label: string;
    value?: string;
    placeholder?: string;
    type?: "text" | "password" | "tel" | "number";
    // error?: FieldError | undefined;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

const UnderlinedInput = forwardRef<HTMLInputElement, UnderlinedInputProps>(
    (
        {
            label,
            value = "",
            type = "text",
            error = false,
            helperText = "",
            required = false,
            disabled = false,
            onChange,
        },
        ref,
    ) => {
        const [inputValue, setInputValue] = useState(value);
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null); // input 요소에 대한 ref 추가

        // value prop이 변경되면 inputValue도 동기화
        useEffect(() => {
            setInputValue(value);
        }, [value]);

        //활성화된 상태면 에러를 그대로 사용, 비활성화상태는? 이 코드 필요한지 모르겠지만 일단 남겨둠
        const effectiveError = disabled ? undefined : error;

        //todo: 입력 완료 시 색깔이 연함. 디자인 파일처럼 진하게 해야 함
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
            let newValue = e.target.value;

            // 전화번호 타입일 때 하이픈 자동 추가
            if (type === "tel") {
                // 숫자만 추출
                const numbers = newValue.replace(/[^0-9]/g, "");

                // 하이픈 추가 로직
                if (numbers.length <= 3) {
                    newValue = numbers;
                } else if (numbers.length <= 7) {
                    newValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
                } else {
                    newValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
                }
            }

            setInputValue(newValue);
            if (onChange) {
                onChange(newValue);
            }
        };

        const handleClear = () => {
            setInputValue("");
            if (onChange) {
                onChange("");
            }
            setIsFocused(true); // Clear 버튼 클릭 시 다시 focus
            inputRef.current?.focus(); // Clear 버튼 클릭 시 input에 포커스
        };

        return (
            <div className="relative flex w-full flex-col gap-1">
                {/* Label */}
                <div className="h-[20px]">
                    {(isFocused || inputValue) && ( // 조건부 렌더링 추가
                        <label className={`text-[14px] font-normal leading-[1.4] ${labelColor}`}>
                            {label}
                            {/* {required && <span className="text-red-500 ml-1">*</span>} */}
                        </label>
                    )}
                </div>

                {/* Input */}
                <div className="relative">
                    <input
                        ref={ref || inputRef} // ref 연결
                        type={type}
                        inputMode={type === "number" ? "numeric" : type === "tel" ? "tel" : undefined}
                        className={`w-full rounded-none border-b-2 bg-transparent py-2 pr-8 text-[23px] outline-none transition-all ${error
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-brand-500"
                            }`}
                        value={inputValue}
                        placeholder={isFocused ? "" : label}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleInputChange}
                    />
                    {/* Clear 버튼 */}
                    {inputValue && isFocused && (
                        <button
                            type="button"
                            className={`absolute right-0 top-1/2 -translate-y-1/2 transform`}
                            onMouseDown={e => {
                                e.preventDefault(); // blur 방지
                                handleClear();
                            }}
                        >
                            <InputClear />
                        </button>
                    )}
                </div>

                {/* Helper Text */}
                <div className={`mt-1 text-[15px] ${error ? "text-red-500" : "text-gray-500"}`}>
                    {helperText}
                </div>
            </div>
        );
    },
);

export default UnderlinedInput;