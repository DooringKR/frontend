"use client";
import React, { useRef, useEffect } from "react";
import { genFlapSvg } from "@/components/svg/svgGenerators/genFlap";

const FLAP_TYPES = ["2보링", "3보링", "4보링"];
const SAMPLE_COLOR_IMAGE = "/img/color-list/hansol-cream-white.png";

export default function FlapTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // 플랩장: 3종류 모두 테스트
    FLAP_TYPES.forEach((type, idx) => {
      const svg = genFlapSvg(
        type as any,
        { doorFillImageUrl: SAMPLE_COLOR_IMAGE },
        { width: 792, height: 392 },
        undefined
      );
      const label = document.createElement("div");
      label.textContent = `${type}`;
      containerRef.current!.appendChild(label);
      containerRef.current!.appendChild(svg);
    });
  }, []);

  return (
    <div>
      <h1>플랩장 SVG 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
