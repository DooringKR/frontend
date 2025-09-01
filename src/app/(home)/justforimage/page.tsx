"use client";
import React, { useRef, useEffect } from "react";
import { generateMaedaDoorSvg } from "@/components/svg/svgCreator";

export default function MaedaDoorTestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svgElement = generateMaedaDoorSvg(
      "마에다1",
      { width: 392, height: 792 },
      { doorFill: "url(#pattern0_6_48)" }
    );

    containerRef.current.appendChild(svgElement);
  }, []);

  return (
    <div>
      <h1>마에다 서랍 '마에다1' SVG 이미지 및 치수 텍스트 테스트</h1>
      <div ref={containerRef}></div>
    </div>
  );
}
