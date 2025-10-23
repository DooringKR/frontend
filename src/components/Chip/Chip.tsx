interface ChipProps {
    text: string;
    color?: 'blue' | 'yellow' | 'green' | 'gray';
    className?: string;
}

export const Chip = ({ text, color = 'blue', className = '' }: ChipProps) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-500',
        yellow: 'bg-yellow-50 text-[#F0B100]',
        green: 'bg-green-50 text-green-500',
        gray: 'bg-gray-100 text-gray-600',
    };

    return (
        <span
            className={`
        inline-flex items-center justify-center
        px-[6px] py-[2px]
        text-[14px]/[20px] font-500
        rounded-[8px]
        ${colorClasses[color]}
        ${className}
      `}
        >
            {text}
        </span>
    );
};
