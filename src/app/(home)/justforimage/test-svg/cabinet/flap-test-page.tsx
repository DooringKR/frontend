import { useEffect, useRef } from "react";
import { genFlapSvg } from "@/components/svg/svgGenerators/genFlap";
import type { FlapDoorSubtype } from "@/components/svg/svgData/flapDoorData";

const FLAP_TYPES: FlapDoorSubtype[] = ["2보링", "3보링", "4보링"];
const FLAP_IMG = "hansol-calf-brown.png";

export default function FlapTestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    FLAP_TYPES.forEach((type) => {
      const svg = genFlapSvg(type, { doorFillImageUrl: FLAP_IMG });
      const label = document.createElement("div");
      label.textContent = `플랩장 (${type})`;
      label.style.margin = "24px 0 8px 0";
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
