import React from 'react';

interface IconProps {
    icon: React.ReactNode;
}

interface ButtonProps extends IconProps {
    text: string;
    onClick?: () => void;
}

const CompanyTypeButton: React.FC<ButtonProps> = ({ text, onClick, icon }) => {
    return (
        <button
            className={
                `w-full hover:bg-gray-100
                 flex flex-col gap-3 px-4 py-3 rounded-[16px]
                 border-[1px] focus:border-[4px] border-gray-200 items-center justify-between`}
            onClick={onClick}
        >
            {icon}
            <div className='text-gray-700 font-500 text-[17px]'>{text}</div>
        </button>
    );
};

export default CompanyTypeButton;