"use client";

import React from "react";

interface ToggleButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  compactLabel?: string;
  expandedLabel?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isExpanded,
  onClick,
  compactLabel = "자세히 보기",
  expandedLabel = "간단 보기",
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] cursor-pointer transition-all duration-200 ${
        isExpanded
          ? "bg-gray-100 hover:bg-gray-150"
          : "bg-gray-50 hover:bg-gray-100"
      } border border-gray-200 shadow-sm hover:shadow-md`}
    >
      <svg
        className={`w-4 h-4 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
          isExpanded ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span className="text-[13px] font-500 text-gray-700 whitespace-nowrap">
        {isExpanded ? expandedLabel : compactLabel}
      </span>
    </button>
  );
};

export default ToggleButton;
