import React, { useState } from "react";

interface FinishingMaterialsIconProps {
}

const FinishingMaterialsIcon: React.FC<FinishingMaterialsIconProps> = ({ }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="110"
            viewBox="0 0 110 110"
            fill="none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: 'pointer' }}
        >
            <rect width="110" height="110" rx="20" fill={isHovered ? "#D2EFE1" : "#F3F4F6"} />
            <path d="M75.475 29.0656H34.5204C31.505 29.0656 29.0605 31.5101 29.0605 34.5255V75.4801C29.0605 78.4955 31.505 80.94 34.5204 80.94H75.475C78.4904 80.94 80.9349 78.4955 80.9349 75.4801V34.5255C80.9349 31.5101 78.4904 29.0656 75.475 29.0656Z" fill="#EC6700" />
            <path d="M80.9349 48.1231V44.8446H67.2894V29.0656H64.0141V44.8446H46.0077V29.0656H42.7324V44.8446H29.0605V48.1231H53.3733V61.8825H29.0605V65.1594H42.7324V80.9383H46.0077V65.1594H64.0141V80.9383H67.2894V65.1594H80.9349V61.8825H56.6485V48.1231H80.9349Z" fill="#FFE3A0" />
        </svg>
    );
};

export default FinishingMaterialsIcon;
