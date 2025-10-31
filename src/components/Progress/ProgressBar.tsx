import React from 'react';

export type ProgressValue = 0 | 20 | 40 | 60 | 80 | 100;

interface ProgressBarProps {
  progress: ProgressValue;
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {

  return (
    <div className="fixed top-[60px] z-40 w-full max-w-[460px] bg-white flex justify-center items-center px-5 py-3">
        <div className="flex-1 h-1.5 relative">
            <div className="w-full h-1.5 left-0 top-0 absolute bg-gray-100 rounded-sm" />
            <div 
              className="h-1.5 left-0 top-0 absolute bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm" 
              style={{ width: `${progress}%` }}
            />
        </div>
        <div className="w-12 pl-2 flex justify-end items-center gap-2.5">
            <div className="flex-1 text-right justify-start text-blue-600 text-sm font-medium font-['Pretendard'] leading-5">{progress}%</div>
        </div>
    </div>

  );
}
