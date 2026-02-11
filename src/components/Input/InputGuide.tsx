import React from 'react';

type InputGuideState = 'default' | 'errored';

interface InputGuideProps {
  text: string;
  state?: InputGuideState;
  color?: string;
  className?: string;
}

const InputGuide: React.FC<InputGuideProps> = ({
  text,
  state = 'default',
  color,
  className = '',
}) => {
  const getTextColor = () => {
    if (color) return color;

    switch (state) {
      case 'errored':
        return 'text-red-500';
      case 'default':
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`inline-flex justify-start items-center gap-2.5 ${className}`}>
      <div className={`justify-start whitespace-pre-line break-words ${getTextColor()} text-base font-normal font-['Pretendard'] leading-5`}>
        {text}
      </div>
    </div>
  );
};

export default InputGuide;