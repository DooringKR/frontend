"use client";

import { useState } from "react";
import Image from "next/image";

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
}

/**
 * Checkbox 컴포넌트
 * 
 * @param checked - 체크 상태
 * @param onChange - 체크 상태 변경 핸들러
 * @param disabled - 비활성화 상태 (선택)
 * @param className - 추가 CSS 클래스
 * @param name - input name 속성
 */
export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  className = "",
  name,
}: CheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-5 h-5 rounded cursor-pointer transition-colors
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `.trim()}
    >
      {checked ? (
        // 체크된 상태
        <div className="relative w-full h-full">
          {isHovered && !disabled ? (
            // Hovered 상태 - blue-600
            <Image
              src="/icons/Is Checked=True, State=Hovered.svg"
              alt="checked-hovered"
              width={20}
              height={20}
              className="w-full h-full"
            />
          ) : (
            // Enabled 상태 - blue-500
            <Image
              src="/icons/Is Checked=True, State=Enabled.svg"
              alt="checked"
              width={20}
              height={20}
              className="w-full h-full"
            />
          )}
        </div>
      ) : (
        // 체크되지 않은 상태
        <div
          className={`
            w-full h-full rounded border-[1.5px] bg-white transition-colors
            ${isHovered && !disabled ? "border-blue-200" : "border-gray-200"}
          `.trim()}
        />
      )}
      
      {/* 숨겨진 실제 input (폼 제출용) */}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        name={name}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  );
}
