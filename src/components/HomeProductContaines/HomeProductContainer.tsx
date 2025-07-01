import React, { useState } from "react";

import HomeProductButton from "./HomeProductButton";

const productList = [
  { label: "문짝" },
  { label: "마감재" },
  { label: "부분장" },
  { label: "부속" },
  { label: "하드웨어" },
  { label: "직접 주문" },
];

const HomeProductContainer: React.FC = () => {
  // 첫 번째 버튼만 선택된 상태 예시
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 첫 번째 줄: 비선택형 */}
      <div className="grid grid-cols-3 gap-4">
        {productList.map((item, idx) => (
          <HomeProductButton key={item.label} label={item.label} />
        ))}
      </div>
      {/* 두 번째 줄: 선택형 (하나만 선택) */}
      <div className="grid grid-cols-3 gap-4">
        {productList.map((item, idx) => (
          <HomeProductButton
            key={item.label}
            label={item.label}
            selected={selectedIdx === idx}
            onClick={() => setSelectedIdx(idx)}
            disabled={item.label === "직접 주문"}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeProductContainer;
