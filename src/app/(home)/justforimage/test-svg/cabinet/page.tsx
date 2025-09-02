"use client";
import React, { useRef, useEffect } from "react";
import { genCabinetSvg } from "@/components/svg/svgGenerators/genCabinet";

import { genFlapSvg } from "@/components/svg/svgGenerators/genFlap";
import type { FlapDoorSubtype } from "@/components/svg/svgData/flapDoorData";

const COLOR_LIST = {
  body: "hansol-cream-white.png", // 바디 색상(윗면, 오른쪽)
  leftDoor: "hansol-calf-brown.png",
  rightDoor: "hansol-calf-brown.png",
};

export default function CabinetTestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // 1. 부분장
    const svg1 = genCabinetSvg({
      body: COLOR_LIST.body,
      leftDoor: COLOR_LIST.leftDoor,
      rightDoor: COLOR_LIST.rightDoor,
    });
    const label1 = document.createElement("div");
    label1.textContent = "부분장";
    label1.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(label1);
    containerRef.current.appendChild(svg1);

    // 2. 상부장 (문 포함)
    const svg2 = genCabinetSvg({
      body: COLOR_LIST.body,
      leftDoor: COLOR_LIST.leftDoor,
      rightDoor: COLOR_LIST.rightDoor,
    });
    const label2 = document.createElement("div");
    label2.textContent = "상부장";
    label2.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(label2);
    containerRef.current.appendChild(svg2);

    // 3. 오픈장 (문 없음)
    const svg3 = genCabinetSvg({
      body: COLOR_LIST.body,
    });
    const label3 = document.createElement("div");
    label3.textContent = "오픈장";
    label3.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(label3);
    containerRef.current.appendChild(svg3);

    // 4. 2단 서랍장
    const svgDrawer2 = genCabinetSvg({
      body: COLOR_LIST.body,
      drawerType: 'drawer2',
      drawerFill: 'hansol-calf-brown.png',
    });
    const labelDrawer2 = document.createElement("div");
    labelDrawer2.textContent = "2단 서랍장";
    labelDrawer2.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(labelDrawer2);
    containerRef.current.appendChild(svgDrawer2);

    // 5. 3단 서랍장 (1:1:2)
    const svgDrawer3_112 = genCabinetSvg({
      body: COLOR_LIST.body,
      drawerType: 'drawer3_112',
      drawerFill: 'hansol-calf-brown.png',
    });
    const labelDrawer3_112 = document.createElement("div");
    labelDrawer3_112.textContent = "3단 서랍장 (1:1:2)";
    labelDrawer3_112.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(labelDrawer3_112);
    containerRef.current.appendChild(svgDrawer3_112);

    // 6. 3단 서랍장 (겉2:속1)
    const svgDrawer3_221 = genCabinetSvg({
      body: COLOR_LIST.body,
      drawerType: 'drawer3_221',
      drawerFill: 'hansol-calf-brown.png',
    });
    const labelDrawer3_221 = document.createElement("div");
    labelDrawer3_221.textContent = "3단 서랍장 (겉2:속1)";
    labelDrawer3_221.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(labelDrawer3_221);
    containerRef.current.appendChild(svgDrawer3_221);

    // 7. 플랩장(3D)
    const svgFlapCabinet = genCabinetSvg({
      type: 'flapCabinet',
      flapRight: 'hansol-calf-brown.png', // 예시 PNG, 필요시 교체
      flapLeft: 'hansol-calf-brown.png',
      top: 'hansol-cream-white.png',
    });
    const labelFlap = document.createElement("div");
    labelFlap.textContent = "플랩장 (3D)";
    labelFlap.style.margin = "24px 0 8px 0";
    containerRef.current.appendChild(labelFlap);
    containerRef.current.appendChild(svgFlapCabinet);
  }, []);

  return (
    <div>
      <h1>Cabinet SVG 3종류 테스트</h1>
  <div ref={containerRef} />
    </div>
  );
}


// 플랩장 테스트도 같이 렌더링
export function FlapCabinetSection() {
  const flapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!flapRef.current) return;
    flapRef.current.innerHTML = "";
    const FLAP_TYPES: FlapDoorSubtype[] = ["2보링", "3보링", "4보링"];
    const FLAP_IMG = "hansol-calf-brown.png";
    FLAP_TYPES.forEach((type) => {
      const svg = genFlapSvg(type, { doorFillImageUrl: FLAP_IMG });
      const label = document.createElement("div");
      label.textContent = `플랩장 (${type})`;
      label.style.margin = "24px 0 8px 0";
      flapRef.current!.appendChild(label);
      flapRef.current!.appendChild(svg);
    });
  }, []);
  return <div ref={flapRef} />;
}

// 기존 CabinetTestPage에 플랩장 섹션 추가
export function CabinetTestPageWithFlap() {
  return (
    <div>
      <CabinetTestPage />
      <h2 style={{ marginTop: 40 }}>플랩장 SVG 테스트</h2>
      <FlapCabinetSection />
    </div>
  );
}
