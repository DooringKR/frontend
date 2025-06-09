import React from "react";

interface CheckIconProps {
  checked: boolean; // 체크 여부를 나타내는 Props
}

const CheckIcon: React.FC<CheckIconProps> = ({ checked }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.6548 6.46596C18.1341 5.90685 18.9746 5.84219 19.5338 6.32142C20.0929 6.80066 20.1575 7.64125 19.6783 8.20036L11.6782 17.5338C11.4365 17.8158 11.0884 17.9844 10.7172 17.9987C10.3462 18.0128 9.98625 17.8719 9.72372 17.6093L4.39032 12.2759L4.29917 12.1744C3.87203 11.6507 3.90216 10.8787 4.39032 10.3905C4.87848 9.90233 5.65049 9.8722 6.1742 10.2993L6.27576 10.3905L10.5909 14.7057L17.6548 6.46596Z"
        fill={checked ? "#44BE83" : "#D1D5DC"} // 체크 여부에 따라 색상 변경
      />
    </svg>
  );
};

export default CheckIcon;
