"use client";
import React, { useRef, useEffect } from "react";
import { genDrawerSvg } from "@/components/svg/svgGenerators/genDrawer";

export default function DrawerTestPage() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svg = genDrawerSvg();

    containerRef.current.appendChild(svg);
  }, []);

  return (
    <div>
      <h1>서랍장 SVG 테스트</h1>
      <div ref={containerRef} />
    </div>
  );
}
