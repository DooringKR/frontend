import React from "react";

interface MinusIconProps {
  disabled?: boolean;
  color?: string;
}

const MinusIcon: React.FC<MinusIconProps> = ({ color = "#99A1AF", disabled = false }) => {
  const brand200 = "#C7D2FE";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4.16699 10H15.8337"
        stroke={disabled ? brand200 : color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MinusIcon;
