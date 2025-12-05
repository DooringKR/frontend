"use client";

import { useState } from "react";
import Image from "next/image";
import Checkbox from "@/components/Checkbox";
import { Chip } from "@/components/Chip/Chip";

interface SelectableOptionCardProps {
  // 기본 정보
  title: string;
  description?: string;
  
  // 이미지 관련
  showImage?: boolean;
  imageUrl?: string;
  
  // 칩 관련
  showChip?: boolean;
  chipText?: string;
  chipColor?: 'blue' | 'yellow' | 'green' | 'gray';
  
  // 하단 확장 콘텐츠
  showExpandableContent?: boolean;
  expandableContent?: React.ReactNode;
  
  // 체크박스 상태
  checked: boolean;
  onChange: (checked: boolean) => void;
  
  // 스타일링
  className?: string;
}

export default function SelectableOptionCard({
  title,
  description,
  showImage = false,
  imageUrl,
  showChip = false,
  chipText,
  chipColor = 'yellow',
  showExpandableContent = false,
  expandableContent,
  checked,
  onChange,
  className = "",
}: SelectableOptionCardProps) {
  const [isExpanded, setIsExpanded] = useState(checked && showExpandableContent);

  const handleCheckboxChange = (newChecked: boolean) => {
    onChange(newChecked);
    if (showExpandableContent) {
      setIsExpanded(newChecked);
    }
  };

  const handleCardClick = () => {
    handleCheckboxChange(!checked);
  };

  return (
      <div 
        className={`self-stretch px-4 pt-2 pb-4 bg-white flex flex-col justify-center items-start gap-2 overflow-hidden cursor-pointer transition-colors hover:bg-gray-50 ${className}`}
        onClick={handleCardClick}
      >
        <div className="self-stretch inline-flex justify-start items-center gap-2">
          {/* 이미지 */}
          {showImage && imageUrl && (
            <Image 
              src={imageUrl} 
              alt={title} 
              width={56} 
              height={56} 
              className="w-14 h-14 object-cover rounded-lg"
            />
          )}
          
          {/* 제목과 칩 */}
          <div className="flex-1 inline-flex flex-col justify-center items-start">
            <div className="self-stretch inline-flex justify-start items-center gap-1">
              <div className="justify-start text-gray-700 text-base font-bold font-['Pretendard'] leading-5">
                {title}
              </div>
              {showChip && chipText && (
                <Chip text={chipText} color={chipColor} />
              )}
            </div>
            {description && (
              <div className="self-stretch justify-start text-gray-500 text-sm font-normal font-['Pretendard'] leading-5">
                {description}
              </div>
            )}
          </div>
          
          {/* 체크박스 - 컨테이너 상단에 정렬 */}
          <div className="flex items-start pt-0">
            <Checkbox 
              checked={checked} 
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
        
        {/* 확장 가능한 콘텐츠 */}
        {showExpandableContent && isExpanded && expandableContent && (
          <div className="self-stretch flex flex-col justify-center items-start">
            {expandableContent}
          </div>
        )}
      </div>
  );
}