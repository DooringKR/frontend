import React from "react";

interface WrenchIconProps {
    width?: number;
    height?: number;
    className?: string;
}

const WrenchIcon: React.FC<WrenchIconProps> = ({
    width = 32,
    height = 32,
    className = ""
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
            className={className}
        >
            <g clipPath="url(#clip0_2117_10150)">
                <path d="M30.1811 7.75666C30.0627 7.25506 29.4323 7.07826 29.0675 7.44306L25.5171 10.9935L21.6523 10.2783L20.9363 6.41346L24.4867 2.86306C24.8515 2.49826 24.6747 1.86786 24.1731 1.74946C21.5315 1.12466 18.6379 1.84146 16.5779 3.90146C14.1211 6.35826 13.5819 9.99746 14.9427 12.9831L2.75314 24.1831C1.25074 25.5855 1.21074 27.9535 2.66354 29.4071C4.11634 30.8599 6.48434 30.8199 7.88674 29.3183L19.1379 17.0767C22.0867 18.3279 25.6243 17.7567 28.0283 15.3527C30.0891 13.2927 30.8051 10.3983 30.1811 7.75746V7.75666ZM6.40274 27.7583C5.82514 28.3359 4.88914 28.3359 4.31234 27.7583C3.73474 27.1807 3.73474 26.2447 4.31234 25.6679C4.88994 25.0903 5.82594 25.0903 6.40274 25.6679C6.98034 26.2455 6.98034 27.1815 6.40274 27.7583Z" fill="#ABB7C7" />
            </g>
            <defs>
                <clipPath id="clip0_2117_10150">
                    <rect width="32" height="32" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default WrenchIcon; 