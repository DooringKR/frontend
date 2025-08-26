"use client";

import React, { useState } from "react";

interface SectionHeadIconProps {}

const SectionHeadIcon: React.FC<SectionHeadIconProps> = ({}) => {
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
      style={{ cursor: "pointer" }}
    >
      <rect width="110" height="110" rx="20" fill={isHovered ? "#D2EFE1" : "#F3F4F6"} />
      <path
        d="M77.4206 27.775H32.5802C29.9266 27.775 27.7754 29.9262 27.7754 32.5798V77.4202C27.7754 80.0738 29.9266 82.225 32.5802 82.225H77.4206C80.0742 82.225 82.2254 80.0738 82.2254 77.4202V32.5798C82.2254 29.9262 80.0742 27.775 77.4206 27.775Z"
        fill="#8595AA"
      />
      <path
        d="M60.0801 37.7849H49.9194C48.8139 37.7849 47.918 36.889 47.918 35.7835C47.918 34.678 48.8139 33.782 49.9194 33.782H60.0801C61.1856 33.782 62.0816 34.678 62.0816 35.7835C62.0816 36.889 61.1856 37.7849 60.0801 37.7849Z"
        fill="#495B73"
      />
      <path d="M82.2254 52.0352H27.7754V55.2378H82.2254V52.0352Z" fill="#65778E" />
      <path
        d="M60.0801 65.2484H49.9194C48.8139 65.2484 47.918 64.3524 47.918 63.2469C47.918 62.1414 48.8139 61.2455 49.9194 61.2455H60.0801C61.1856 61.2455 62.0816 62.1414 62.0816 63.2469C62.0816 64.3524 61.1856 65.2484 60.0801 65.2484Z"
        fill="#495B73"
      />
    </svg>
  );
};

export default SectionHeadIcon;
