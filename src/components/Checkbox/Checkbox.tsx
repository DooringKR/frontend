"use client";

import { useMemo } from "react";
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
  // 크기별 설정 메모이제이션
  const sizeConfig = useMemo(() => ({
    medium: { container: 'w-5 h-5', iconSize: 20 },
    large: { container: 'w-7 h-7', iconSize: 28 }
  }), []);

  // 아이콘 경로 메모이제이션
  const iconPaths = useMemo(() => {
    const variantMap = {
      square: 'Square',
      circle: 'Circle', 
      ghost: 'Check Only'
    };
    
    const basePath = `/icons/Checkbox/Variant=${variantMap[variant]}, Size=Medium`;
    
    return {
      enabled: {
        checked: `${basePath}, State=Enabled, Is Checked=True.svg`,
        unchecked: `${basePath}, State=Enabled, Is Checked=False.svg`
      },
      hovered: {
        checked: `${basePath}, State=Hovered, Is Checked=True.svg`,
        unchecked: `${basePath}, State=Hovered, Is Checked=False.svg`
      },
      disabled: {
        checked: `${basePath}, State=Disabled, Is Checked=True.svg`,
        unchecked: `${basePath}, State=Disabled, Is Checked=False.svg`
      }
    };
  }, [variant]);

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

  // 기본 상태 아이콘 경로
  const defaultIconSrc = disabled
    ? (checked ? iconPaths.disabled.checked : iconPaths.disabled.unchecked)
    : (checked ? iconPaths.enabled.checked : iconPaths.enabled.unchecked);

  // hover 상태 아이콘 경로
  const hoverIconSrc = checked ? iconPaths.hovered.checked : iconPaths.hovered.unchecked;

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        ${sizeConfig[size].container} cursor-pointer transition-all duration-150 ease-in-out group relative
        ${disabled ? "cursor-not-allowed" : "hover:scale-105"}
        ${className}
      `.trim()}
    >
      {/* 기본 상태 아이콘 */}
      <Image
        src={defaultIconSrc}
        alt={checked ? "checked" : "unchecked"}
        width={sizeConfig[size].iconSize}
        height={sizeConfig[size].iconSize}
        className={`w-full h-full transition-opacity duration-150 ${disabled ? "opacity-100" : "group-hover:opacity-0"}`}
      />
      
      {/* hover 상태 아이콘 (disabled가 아닐 때만) */}
      {!disabled && (
        <Image
          src={hoverIconSrc}
          alt={checked ? "checked hovered" : "unchecked hovered"}
          width={sizeConfig[size].iconSize}
          height={sizeConfig[size].iconSize}
          className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-events-none"
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
