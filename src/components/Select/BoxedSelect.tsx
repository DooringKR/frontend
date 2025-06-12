import ChevronDown from 'public/icons/chevron_down';
import React, { useState } from 'react';

interface BoxedSelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    onClick?: () => void; // onClick prop 추가
    error?: string; // error prop 추가
}

const BoxedSelect: React.FC<BoxedSelectProps> = ({
    label,
    options,
    value,
    onChange,
    onClick,
    error,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full flex flex-col gap-2 relative">
            {/* Label */}
            <div className={`w-full text-[14px] font-400 ${(isFocused && !error) ? 'text-brand-500' : 'text-gray-600'}`}>
                {label}
            </div>
            <button
                className={`w-full py-3 px-4 flex justify-between items-center rounded-[12px]
                    border-[1px] focus:border-[2px]
                    ${error ? 'border-[2px] border-red-300' : isFocused ? 'border-brand-300' : 'hover:border-brand-100 border-gray-200'}
                    hover:border-[2px] 
                     `}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onClick={() => {
                    if (onClick) onClick(); // onClick prop 호출
                    console.log('Current userType:', value); // 현재 store의 userType 출력
                    onChange(value);
                }}
            >
                <div className={`${(value && !error) ? 'text-gray-700' : 'text-gray-300'} text-[17px]`}>{error ? '잘못된 입력' : value || label}</div>
                <div className={`${(isFocused && !error) ? 'text-brand-500' : 'text-gray-200'}`}>
                    <ChevronDown />
                </div>
            </button>
            {error && (
                <span className="text-red-500 text-[15px] font-400">{error}</span>
            )}
        </div>
    );
};

export default BoxedSelect;