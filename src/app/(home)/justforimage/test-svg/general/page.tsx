"use client";

import React, { useRef, useEffect } from "react";
import { genGeneralDoorSvg } from "@/components/svg/svgGenerators/genGeneral";
import { GeneralDoorSubtype } from "@/components/svg/svgData/generalDoorData";

export default function GeneralDoorTestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const subtype: GeneralDoorSubtype = "좌경_2보링";
    const size = { width: 392, height: 792 };

    // 이미지 적용 예시 (public/img/color-list 폴더 내 이미지 URL)
    const color = {
      doorFillImageUrl: "/img/color-list/hansol-bay-natural-oak.png",
      fallbackColor: "#ddd",
    };

    const boringValues = [280, 550];

    const svg = genGeneralDoorSvg(subtype, size, color, boringValues);

    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div>
      <h1>일반문 색상 패턴 적용 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
