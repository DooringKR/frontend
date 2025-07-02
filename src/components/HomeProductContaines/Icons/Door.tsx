import React, { useState } from "react";

interface DoorIconProps {
}

const DoorIcon: React.FC<DoorIconProps> = ({ }) => {
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
            <mask id="mask0_894_7645" maskUnits="userSpaceOnUse" x="22" y="22" width="66" height="66">
                <path d="M88 22H22V88H88V22Z" fill="white" />
            </mask>
            <g mask="url(#mask0_894_7645)">
                <path d="M68.2141 24.6813H41.7844C38.1474 24.6813 35.1992 27.6295 35.1992 31.2664V78.7386C35.1992 82.3755 38.1474 85.3237 41.7844 85.3237H68.2141C71.851 85.3237 74.7992 82.3755 74.7992 78.7386V31.2664C74.7992 27.6295 71.851 24.6813 68.2141 24.6813Z" fill="#5E403B" />
                <path d="M65.7312 59.7066C68.3302 59.7066 70.437 57.5996 70.437 55.0008C70.437 52.4018 68.3302 50.295 65.7312 50.295C63.1322 50.295 61.0254 52.4018 61.0254 55.0008C61.0254 57.5996 63.1322 59.7066 65.7312 59.7066Z" fill="#FFDE57" />
                <path d="M65.7314 56.846C66.7502 56.846 67.5761 56.0201 67.5761 55.0013C67.5761 53.9825 66.7502 53.1566 65.7314 53.1566C64.7126 53.1566 63.8867 53.9825 63.8867 55.0013C63.8867 56.0201 64.7126 56.846 65.7314 56.846Z" fill="#CB8C00" />
                <path d="M65.7342 53.1631H57.9C56.8829 53.1631 56.0586 53.9876 56.0586 55.0045C56.0586 56.0215 56.8829 56.8459 57.9 56.8459H65.7342C66.7511 56.8459 67.5756 56.0215 67.5756 55.0045C67.5756 53.9876 66.7511 53.1631 65.7342 53.1631Z" fill="#CB8C00" />
            </g>
        </svg>
    );
};

export default DoorIcon;
