import React from "react";

interface PlusIconProps {
  disabled?: boolean;
  color?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ color = "#99A1AF", disabled = false }) => {
  const brand200 = "#C7D2FE";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4.16699 9.99999H15.8337M10.0003 4.16666V15.8333"
        stroke={disabled ? brand200 : color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
