import React from "react";
// 기본값 gray200
const ChevronDown: React.FC<{ colorClass?: string }> = ({ colorClass = "stroke-gray-200" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={colorClass}>
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default ChevronDown;