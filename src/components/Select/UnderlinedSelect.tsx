import ChevronDown from 'public/icons/chevron_down';
import React, { useState } from 'react';

interface UnderlinedSelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    onClick?: () => void; // onClick prop 추가
}

const UnderlinedSelect: React.FC<UnderlinedSelectProps> = ({
    label,
    options,
    value,
    onChange,
    onClick,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full flex flex-col gap-1 relative">
            {/* Label */}
            <div className={`w-full text-[14px] h-[26px] ${isFocused ? 'text-brand-500' : value ? 'text-gray-600' : 'text-gray-300'}`}>
                {value ? label : isFocused ? label : ''}
            </div>
            <button
                className={`w-full flex justify-between items-center border-b-2 ${isFocused ? 'border-brand-500' : 'border-gray-200'}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onClick={() => {
                    if (onClick) onClick(); // onClick prop 호출
                    console.log('Current userType:', value); // 현재 store의 userType 출력
                    onChange(value);
                }}
            >
                <div className={`${value || isFocused ? 'text-gray-800' : 'text-gray-300'} text-[23px]`}>{value || label}</div>
                <div className={`${isFocused ? 'text-brand-500' : 'text-gray-200'}`}>
                    <ChevronDown />
                </div>
            </button>
        </div>
    );
};

export default UnderlinedSelect;