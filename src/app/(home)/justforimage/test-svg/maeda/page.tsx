"use client";

import React, { useEffect, useRef } from "react";
import { genMaedaDoorSvg } from "@/components/svg/svgGenerators/genMaeda";

const COLOR_IMAGE_PATH = "/img/color-list/hansol-cream-white.png";

// 각 마에다 타입별로 width/height 조합을 다르게 지정
const maedaCases = [
  { label: "마에다1 (세로형)", size: { width: 400, height: 800 } }, // height > width
  { label: "마에다2 (정사각형)", size: { width: 600, height: 600 } }, // height == width
  { label: "마에다3 (가로형)", size: { width: 800, height: 400 } }, // width > height
];

export default function MaedaAllTypeTestPage() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    maedaCases.forEach((item, idx) => {
      const ref = containerRefs.current[idx];
      if (!ref) return;
      ref.innerHTML = "";
      const svg = genMaedaDoorSvg(
        item.size,
        { doorFill: COLOR_IMAGE_PATH }
      );
      ref.appendChild(svg);
    });
  }, []);

  return (
    <div>
      <h1>마에다 서랍 3종류 SVG 테스트</h1>
      <div style={{ display: "flex", gap: 32 }}>
        {maedaCases.map((item, idx) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div
              ref={el => { containerRefs.current[idx] = el; }}
              style={{ border: "1px solid #aaa", width: 1200, height: 1200, marginBottom: 8 }}
            />
            <div>{item.label}</div>
            <div>({item.size.width} x {item.size.height})</div>
          </div>
        ))}
      </div>
    </div>
  );
}