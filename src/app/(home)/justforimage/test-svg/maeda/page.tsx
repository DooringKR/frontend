// page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { genMaedaDoorSvg } from "@/components/svg/svgGenerators/genMaeda";

const COLOR_IMAGE_PATH = "/img/color-list/hansol-cream-white.png";

export default function MaedaColorTestPage() {
  const [doorWidth, setDoorWidth] = useState(400);
  const [doorHeight, setDoorHeight] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svg = genMaedaDoorSvg(
      { width: doorWidth, height: doorHeight },
      { doorFill: COLOR_IMAGE_PATH }
    );

    containerRef.current.appendChild(svg);
  }, [doorWidth, doorHeight]);

  return (
    <>
      <h1>마에다 서랍 색상 테스트</h1>
      <div>
        <label>
          가로(mm):{" "}
          <input
            type="number"
            value={doorWidth}
            onChange={(e) => setDoorWidth(Number(e.target.value))}
            style={{ width: 100 }}
          />
        </label>
      </div>
      <div>
        <label>
          세로(mm):{" "}
          <input
            type="number"
            value={doorHeight}
            onChange={(e) => setDoorHeight(Number(e.target.value))}
            style={{ width: 100 }}
          />
        </label>
      </div>
      <div
        ref={containerRef}
        style={{ marginTop: 20, border: "1px solid black", width: 1200, height: 1200 }}
      />
    </>
  );
}
