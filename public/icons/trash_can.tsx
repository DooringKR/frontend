import React from "react";

interface TrashCanProps {
    disabled?: boolean;
    color?: string; // 색상 prop 추가
}

const TrashCan: React.FC<TrashCanProps> = ({ color = "#99A1AF", disabled = false }) => {
    const brand200 = "#C7D2FE"; // tailwind brand-200 색상값
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 5.00001H17.5M15.8333 5.00001V16.6667C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6667V5.00001M6.66667 5.00001V3.33334C6.66667 2.50001 7.5 1.66667 8.33333 1.66667H11.6667C12.5 1.66667 13.3333 2.50001 13.3333 3.33334V5.00001M8.33333 9.16667V14.1667M11.6667 9.16667V14.1667" stroke={disabled ? brand200 : color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default TrashCan;