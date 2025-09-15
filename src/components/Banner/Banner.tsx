"use client";

import Image from "next/image";
import React, { useState } from "react";

import BannerPagination from "./_components/Pagination";

const images = [
  "/img/banner/Banner1.png",
  "/img/banner/Banner2.png",
  "/img/banner/Banner3.png",
  "/img/banner/Banner4.png",
];

const Banner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goToPrevious = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배너 이미지들 */}
      <div
        style={{
          display: "flex",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          transform: `translateX(-${current * 100}%)`,
          width: "100%",
        }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            style={{ width: "100%", flexShrink: 0, position: "relative" }}
          >
            <Image
              src={src}
              alt={`배너 이미지 ${idx + 1}`}
              width={1200}
              height={400}
              style={{ width: "100%", height: "auto", objectFit: "contain" } as React.CSSProperties}
              priority={idx === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* 네비게이션 컨트롤 영역 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0", // 24px에서 8px로 줄임
          pointerEvents: "none",
        }}
      >
        {/* 이전 버튼 */}
        <button
          onClick={goToPrevious}
          style={{
            background: "none",
            border: "none",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            pointerEvents: "auto",
            opacity: 0.9,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 다음 버튼 */}
        <button
          onClick={goToNext}
          style={{
            background: "none",
            border: "none",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            pointerEvents: "auto",
            opacity: 0.9,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 페이지네이션 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 8,
          margin: "auto",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BannerPagination total={total} current={current} />
      </div>
    </div>
  );
};

export default Banner;
