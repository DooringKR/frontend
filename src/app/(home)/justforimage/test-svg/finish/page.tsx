"use client";
import React, { useRef, useEffect } from "react";
import { genFinishDoorSvg } from "@/components/svg/svgGenerators/genFinish";

const finishCases = [
  { label: "세로형", width: 400, height: 800 },
  { label: "정사각형", width: 600, height: 600 },
  { label: "가로형", width: 800, height: 400 },
];

export default function FinishAllTypeTestPage() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    finishCases.forEach((item, idx) => {
      const ref = containerRefs.current[idx];
      if (!ref) return;
      ref.innerHTML = "";
      const svg = genFinishDoorSvg(item.width, item.height, { imageUrl: "/img/color-list/hansol-cream-white.png" });
      ref.appendChild(svg);
    });
  }, []);

  return (
    <div>
      <h1>마감재 3종류 SVG 테스트</h1>
      <div style={{ display: "flex", gap: 32 }}>
        {finishCases.map((item, idx) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div
              ref={el => { containerRefs.current[idx] = el; }}
              style={{ border: "1px solid #aaa", width: 1200, height: 1200, marginBottom: 8 }}
            />
            <div>{item.label}</div>
            <div>({item.width} x {item.height})</div>
          </div>
        ))}
      </div>
    </div>
  );
}