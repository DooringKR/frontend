import React from 'react';
import BoxedInput from '@/components/Input/BoxedInput';

type OrderProcessCardState = 'enabled' | 'emphasized' | 'activated' | 'errored' | 'disabled' | 'hovered';
type OrderProcessCardTrailing = 'primary' | 'secondary';
type OrderProcessCardIcon = 'box' | 'file' | 'headset' | 'kakaoTalk' | 'phone' | 'truck';

interface OrderProcessCardProps {
  state?: OrderProcessCardState;
  trailing?: OrderProcessCardTrailing;
  icon?: OrderProcessCardIcon;
  iconSize?: 24 | 32;
  showLeadingIcon?: boolean;
  showSamedaydeliverySticker?: boolean;
  showDescriptionLine2?: boolean;
  showTrailing?: boolean;
  showBottom?: boolean;
  title?: string;
  descriptionLine1?: string;
  descriptionLine2?: string;
  bottomLabel?: string;
  dateValue?: string;
  timeValue?: string;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
  className?: string;
}

const OrderProcessCard: React.FC<OrderProcessCardProps> = ({
  state = 'enabled',
  trailing = 'primary',
  icon = 'truck',
  iconSize = 32,
  showLeadingIcon = true,
  showSamedaydeliverySticker = true,
  showDescriptionLine2 = true,
  showTrailing = true,
  showBottom = true,
  title = '타이틀',
  descriptionLine1 = '디스크립션 라인 1',
  descriptionLine2 = '디스크립션 라인 2',
  bottomLabel = '희망 픽업 일정',
  dateValue = '',
  timeValue = '',
  onDateChange,
  onTimeChange,
  className = '',
}) => {
  // 아이콘 렌더링 함수
  const renderIcon = () => {
    const iconProps = {
      width: iconSize,
      height: iconSize,
      className: "flex-shrink-0"
    };

    const iconPath = `/icons/${icon}.svg`;
    
    return (
      <img 
        src={iconPath} 
        alt={`${icon} icon`}
        width={iconSize}
        height={iconSize}
        className="flex-shrink-0"
      />
    );
  };
  // State에 따른 스타일 매핑
  const getStateStyles = () => {
    switch (state) {
      case 'hovered':
        return 'bg-gray-50 outline outline-1 outline-offset-[-1px] outline-gray-200';
      case 'emphasized':
        return 'bg-white outline outline-2 outline-offset-[-2px] outline-blue-200';
      case 'activated':
        return 'bg-white outline outline-2 outline-offset-[-2px] outline-gray-600';
      case 'errored':
        return 'bg-white outline outline-2 outline-offset-[-2px] outline-red-300';
      case 'disabled':
        return 'bg-gray-50 outline outline-1 outline-offset-[-1px] outline-gray-200';
      case 'enabled':
      default:
        return 'bg-white outline outline-1 outline-offset-[-1px] outline-gray-200';
    }
  };

  return (
    <div className={`w-80 px-4 py-3.5 rounded-2xl inline-flex flex-col justify-center items-center gap-3 ${getStateStyles()} ${className}`}>
      <div className="self-stretch inline-flex justify-center items-center gap-3">
        {/* Leading Icon */}
        {showLeadingIcon && (
          <div data-icon={icon} data-size={iconSize} className={`${iconSize === 32 ? 'w-8 h-8' : 'w-6 h-6'} relative overflow-hidden flex items-center justify-center`}>
            {renderIcon()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 inline-flex flex-col justify-center items-start">
          <div className="self-stretch inline-flex justify-start items-center gap-1">
            <div className="justify-start text-gray-700 text-base font-bold font-['Pretendard'] leading-5">{title}</div>
            {showSamedaydeliverySticker && (
              <img 
                src="/icons/sameday.svg" 
                alt="당일배송" 
                width={12}
                height={12}
                className="w-3 h-3"
              />
            )}
          </div>
          <div className="self-stretch justify-start text-gray-500 text-sm font-normal font-['Pretendard'] leading-5">{descriptionLine1}</div>
          {showDescriptionLine2 && (
            <div className="self-stretch justify-start text-gray-500 text-sm font-normal font-['Pretendard'] leading-5">{descriptionLine2}</div>
          )}
        </div>

        {/* Trailing */}
        {showTrailing && (
          <div data-color="Blue" data-has-text={trailing === 'primary' ? 'True' : 'False'} className="h-5 flex justify-end items-center gap-1">
            {trailing === 'primary' && (
              <div className="justify-start text-blue-500 text-sm font-medium font-['Pretendard'] leading-5">트레일링</div>
            )}
            <img 
              src="/icons/Vector.svg" 
              alt="arrow" 
              width={6}
              height={12}
              className="w-1.5 h-3"
            />
          </div>
        )}
      </div>

      {/* Bottom Section */}
      {showBottom && (
        <div className="w-72 flex flex-col justify-center items-center gap-1">
          <div className="self-stretch justify-start text-blue-500 text-xs font-medium font-['Pretendard'] leading-4">{bottomLabel}</div>
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            <BoxedInput
              type="text"
              placeholder="날짜"
              value={dateValue}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="flex-1"
            />
            <BoxedInput
              type="text"
              placeholder="시간"
              value={timeValue}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProcessCard;
