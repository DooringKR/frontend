"use client";
import React, { useRef, useEffect } from "react";
import { genCabinetSvg } from "@/components/svg/svgGenerators/genCabinet";

export default function CabinetTestPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svg = genCabinetSvg({
      right: "url(#pattern_right)",
      top: "url(#pattern_top)",
      leftDoor: "url(#pattern_leftDoor)",
      rightDoor: "url(#pattern_rightDoor)",
    });

    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div>
      <h1>상부장 SVG 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
