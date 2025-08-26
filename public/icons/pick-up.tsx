import React from 'react';

interface PickUpIconProps {
    width?: number;
    height?: number;
    className?: string;
}

export const PickUpIcon: React.FC<PickUpIconProps> = ({
    width = 24,
    height = 24,
    className = ''
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <g clipPath="url(#clip0_2416_9439)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.6838 8.74169H19.8088L19.4422 7.94789C18.9982 6.98669 18.0364 6.37109 16.9774 6.37109H7.02281C5.96381 6.37109 5.00201 6.98669 4.55801 7.94789L4.19141 8.74169H2.31641V20.0517H2.32601C2.36081 21.0507 3.17321 21.9033 4.23701 21.9033H19.7632C20.8264 21.9033 21.6394 21.0507 21.6742 20.0517H21.6838V8.74169Z"
                    fill="#FFA300"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.7633 10.798H4.23774C2.98374 10.798 2.06634 9.61476 2.37894 8.40036L4.55874 3.67836C5.00274 2.71716 5.96454 2.10156 7.02354 2.10156H16.9787C18.0377 2.10156 18.9995 2.71716 19.4435 3.67836L21.6233 8.40036C21.9359 9.61476 21.0185 10.798 19.7645 10.798H19.7633Z"
                    fill="#FFC33A"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.7096 10.798H10.292L10.523 2.10156H13.4786L13.7096 10.798Z"
                    fill="#FFE3A0"
                />
                <path
                    d="M13.7306 10.7969H10.292V16.5143H13.7306V10.7969Z"
                    fill="#FFD06C"
                />
            </g>
            <defs>
                <clipPath id="clip0_2416_9439">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default PickUpIcon;