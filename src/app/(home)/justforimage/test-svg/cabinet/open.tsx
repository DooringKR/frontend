"use client";
import React, { useRef, useEffect } from "react";
import { genCabinetSvg } from "@/components/svg/svgGenerators/genCabinet";

export default function OpenCabinetTestPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // 오픈장: 문 색상 없이, 상부장과 동일하게 우측/윗면만 패턴 적용
    const svg = genCabinetSvg({
      right: "url(#pattern_right)",
      top: "url(#pattern_top)"
    });

    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div>
      <h1>오픈장 SVG 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
