"use client";
import React, { useRef, useEffect } from "react";
import { genCabinetSvg } from "@/components/svg/svgGenerators/genCabinet";

export default function CabinetTestPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svg = genCabinetSvg({
      right: "url(#pattern0_6_20)",
      top: "url(#pattern1_6_20)",
      leftDoor: "url(#pattern2_6_20)",
      rightDoor: "url(#pattern3_6_20)",
    });

    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div>
      <h1>부분장 SVG 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
