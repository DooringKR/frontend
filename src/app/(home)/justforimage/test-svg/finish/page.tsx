"use client";
import React, { useRef, useEffect } from "react";
import { genFinishDoorSvg } from "@/components/svg/svgGenerators/genFinish";

export default function FinishTestPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // test width, height값으로 함수 호출 - 패턴 분기 확인용
    const svg = genFinishDoorSvg(400, 800); // 세로 긴 예시

    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div>
      <h1>마감재 SVG 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
