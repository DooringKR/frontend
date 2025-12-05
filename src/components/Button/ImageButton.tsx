import React from 'react';
import Image from 'next/image';

interface ImageButtonProps {
  /** 버튼에 표시할 이미지 경로 */
  imageSrc: string;
  /** 이미지 대체 텍스트 */
  imageAlt: string;
  /** 이미지 하단에 표시할 설명 텍스트 */
  description: string;
  /** 선택 여부 */
  selected?: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 이미지 너비 설정 */
  imageWidth?: number;
  /** 이미지 높이 설정 */
  imageHeight?: number;
  /** 원본 크기 사용 여부 */
  useOriginalSize?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

const ImageButton: React.FC<ImageButtonProps> = ({
  imageSrc,
  imageAlt,
  description,
  selected = false,
  onClick,
  className = '',
  imageWidth = 160,
  imageHeight = 100,
  useOriginalSize = false,
  disabled = false
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        className={`button flex items-center justify-center w-full border-[1px] bg-white px-4 py-3 rounded-[12px] focus:ring-4 ${
          selected
            ? 'border-brand-500 bg-brand-50 focus:ring-brand-200'
            : 'border-gray-200 hover:bg-gray-50 focus:ring-gray-200'
        } ${disabled ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex items-center justify-center gap-1">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={useOriginalSize ? 200 : imageWidth}
            height={useOriginalSize ? 200 : imageHeight}
            className={`${disabled ? "opacity-30" : ""}`}
            style={{
              width: useOriginalSize ? 'auto' : `${imageWidth}px`,
              height: useOriginalSize ? 'auto' : `${imageHeight}px`,
              maxWidth: useOriginalSize ? '200px' : `${imageWidth}px`,
              maxHeight: useOriginalSize ? '200px' : `${imageHeight}px`
            }}
            unoptimized={true}
          />
        </div>
      </button>
      {description && (
        <div className={`mt-2 text-sm text-center ${disabled ? "text-gray-300" : "text-gray-600"}`}>
          {description}
        </div>
      )}
    </div>
  );
};

export default ImageButton;