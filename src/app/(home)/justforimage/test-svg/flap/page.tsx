// page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { genFlapSvg } from "@/components/svg/svgGenerators/genFlap";
import type { FlapDoorSubtype } from "@/components/svg/svgData/flapDoorData";

const FLAP_TYPES: FlapDoorSubtype[] = ["2보링", "3보링", "4보링"];
const SAMPLE_COLOR_IMAGE = "/img/color-list/hansol-cream-white.png";

export default function FlapTestPage() {
  const [selectedFlap, setSelectedFlap] = useState<FlapDoorSubtype>("2보링");
  const [doorWidth, setDoorWidth] = useState(792);
  const [doorHeight, setDoorHeight] = useState(392);
  const [boringSizes, setBoringSizes] = useState<(number | null)[]>(
    Array(FLAP_TYPES.length).fill(null)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svgElement = genFlapSvg(
      selectedFlap,
      { doorFillImageUrl: SAMPLE_COLOR_IMAGE },
      { width: doorWidth, height: doorHeight },
      boringSizes
    );
    containerRef.current.appendChild(svgElement);
  }, [selectedFlap, doorWidth, doorHeight, boringSizes]);

  const handleBoringSizeChange = (index: number, value: string) => {
    const num = value ? Number(value) : null;
    const updated = [...boringSizes];
    updated[index] = num;
    setBoringSizes(updated);
  };

  return (
    <>
      <h1>플랩문 3종류 테스트</h1>
      <div style={{ marginBottom: 16 }}>
        {FLAP_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedFlap(type)}
            style={{
              marginRight: 10,
              backgroundColor: selectedFlap === type ? "#ddd" : "#fff",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div>
        <label>
          가로(mm):
          <input
            type="number"
            value={doorWidth}
            onChange={(e) => setDoorWidth(Number(e.target.value))}
            style={{ marginRight: 10 }}
          />
        </label>
        <label>
          세로(mm):
          <input
            type="number"
            value={doorHeight}
            onChange={(e) => setDoorHeight(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        {Array.from({ length: selectedFlap === "2보링" ? 2 : selectedFlap === "3보링" ? 3 : 4 }).map(
          (_, idx) => (
            <label key={idx} style={{ marginRight: 10 }}>
              보링 {idx + 1} (mm):
              <input
                type="number"
                value={boringSizes[idx] ?? ""}
                onChange={(e) => handleBoringSizeChange(idx, e.target.value)}
              />
            </label>
          )
        )}
      </div>

      <div
        ref={containerRef}
        style={{
          border: "1px solid black",
          marginTop: 24,
          width: 1200,
          height: 1200,
        }}
      />
    </>
  );
}
