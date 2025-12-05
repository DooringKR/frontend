"use client";

import { useState } from "react";
import Image from "next/image";

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  variant?: 'square' | 'circle' | 'ghost';
  size?: 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  name?: string;
}

/**
 * Checkbox 컴포넌트
 * 
 * @param checked - 체크 상태
 * @param onChange - 체크 상태 변경 핸들러
 * @param variant - 체크박스 모양 ('square' | 'circle' | 'ghost')
 * @param size - 체크박스 크기 ('medium' | 'large')
 * @param disabled - 비활성화 상태 (선택)
 * @param className - 추가 CSS 클래스
 * @param name - input name 속성
 */
export default function Checkbox({
  checked,
  onChange,
  variant = 'square',
  size = 'medium',
  disabled = false,
  className = "",
  name,
}: CheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 크기별 설정
  const sizeConfig = {
    medium: { container: 'w-5 h-5', iconSize: 20 },
    large: { container: 'w-7 h-7', iconSize: 28 }
  };

  // 아이콘 경로 생성
  const getIconPath = () => {
    const variantMap = {
      square: 'Square',
      circle: 'Circle', 
      ghost: 'Check Only'
    };
    
    const state = disabled ? 'Disabled' : (isHovered ? 'Hovered' : 'Enabled');
    const isCheckedStr = checked ? 'True' : 'False';
    
    return `/icons/Checkbox/Variant=${variantMap[variant]}, Size=Medium, State=${state}, Is Checked=${isCheckedStr}.svg`;
  };

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
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${sizeConfig[size].container} cursor-pointer transition-colors
        ${disabled ? "cursor-not-allowed" : ""}
        ${className}
      `.trim()}
    >
      <Image
        src={getIconPath()}
        alt={checked ? "checked" : "unchecked"}
        width={sizeConfig[size].iconSize}
        height={sizeConfig[size].iconSize}
        className="w-full h-full"
      />
      
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
