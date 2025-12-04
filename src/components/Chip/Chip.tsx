interface ChipProps {
    text: string;
    color?: 'blue' | 'yellow' | 'green' | 'gray' | 'purple';
    weight?: 'weak' | 'strong';
    className?: string;
}

export const Chip = ({ text, color = 'blue', weight = 'weak', className = '' }: ChipProps) => {
    const getColorClasses = () => {
        if (weight === 'strong') {
            const strongColors = {
                blue: 'bg-blue-500 text-white',
                yellow: 'bg-yellow-500 text-white', 
                green: 'bg-green-400 text-white',
                gray: 'bg-gray-500 text-white',
                purple: 'bg-violet-500 text-white',
            };
            return strongColors[color];
        } else {
            const weakColors = {
                blue: 'bg-blue-50 text-blue-500',
                yellow: 'bg-yellow-50 text-[#F0B100]',
                green: 'bg-green-50 text-green-500',
                gray: 'bg-gray-100 text-gray-600',
                purple: 'bg-violet-50 text-violet-500',
            };
            return weakColors[color];
        }
    };

    return (
        <span
            className={`
        inline-flex items-center justify-center
        px-[6px] py-[2px]
        text-[14px]/[20px] font-500
        rounded-[8px]
        ${getColorClasses()}
        ${className}
      `}
        >
            {text}
        </span>
    );
};
