"use client";

import React, { useRef, useEffect } from "react";
import { genGeneralDoorSvg } from "@/components/svg/svgGenerators/genGeneral";
import { GeneralDoorSubtype } from "@/components/svg/svgData/generalDoorData";

const subtypes: GeneralDoorSubtype[] = [
  "좌경_2보링",
  "좌경_3보링",
  "좌경_4보링",
  "우경_2보링",
  "우경_3보링",
  "우경_4보링",
];

const size = { width: 392, height: 792 };
const color = {
  doorFillImageUrl: "/img/color-list/hansol-bay-natural-oak.png",
  fallbackColor: "#ddd",
};
const boringValuesList = [
  [280, 550], // 좌경_2보링
  [250, 550, 800], // 좌경_3보링
  [200, 400, 600, 800], // 좌경_4보링
  [280, 550], // 우경_2보링
  [250, 550, 800], // 우경_3보링
  [200, 400, 600, 800], // 우경_4보링
];

export default function GeneralDoorAllCasesPage() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    subtypes.forEach((subtype, idx) => {
      const ref = containerRefs.current[idx];
      if (!ref) return;
      ref.innerHTML = "";
      const svg = genGeneralDoorSvg(
        subtype,
        size,
        color,
        boringValuesList[idx]
      );
      ref.appendChild(svg);
    });
  }, []);

  return (
    <div>
      <h1>일반문 6종류 SVG 테스트</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
      {subtypes.map((subtype, idx) => (
        <div key={subtype} style={{ textAlign: "center" }}>
          <div
            ref={el => {
              containerRefs.current[idx] = el;
            }}
          />
          <div style={{ marginTop: 8 }}>{subtype}</div>
        </div>
      ))}
      </div>
    </div>
  );
}