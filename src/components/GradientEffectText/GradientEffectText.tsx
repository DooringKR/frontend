"use client";

import React, { useEffect, useRef, useState } from "react";

// HEX → RGB 변환
function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [
    parseInt(n.substring(0, 2), 16),
    parseInt(n.substring(2, 4), 16),
    parseInt(n.substring(4, 6), 16),
  ];
}

// RGB → HEX 변환
function rgbToHex([r, g, b]: number[]) {
  return (
    "#" +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// 두 색상 사이 보간
function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// keyframes 정의
const keyframes = [
  { stop: 0, color: "#44BE83" }, // 초록
  { stop: 0.33, color: "#8BD7B2" }, // 파랑
  { stop: 0.66, color: "#D2EFE1" }, // 노랑
  { stop: 1, color: "#8BD7B2" }, // 다시 초록
];

const duration = 500; // ms
const staggerDelay = 100; // 각 글자 사이의 지연 시간 (ms)

interface GradientEffectTextProps {
  text: string;
  className?: string;
}

const GradientEffectText: React.FC<GradientEffectTextProps> = ({ text, className }) => {
  const [charColors, setCharColors] = useState<string[]>([]);
  const frame = useRef<number | null>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!text) return;

    const initialColors = new Array(text.length).fill(keyframes[0].color);
    setCharColors(initialColors);

    let stopped = false;
    function startAnim() {
      const start = performance.now();
      function animate(now: number) {
        if (stopped) return;
        const elapsed = Math.min(now - start, duration + (text.length - 1) * staggerDelay);

        const newColors = [...initialColors];

        // 각 글자에 대해 색상 계산
        for (let i = 0; i < text.length; i++) {
          const charStartTime = i * staggerDelay;
          const charElapsed = Math.max(0, elapsed - charStartTime);
          const t = Math.min(charElapsed / duration, 1);

          // 현재 구간 찾기
          let j = 0;
          while (j < keyframes.length - 1 && t > keyframes[j + 1].stop) j++;
          const kfA = keyframes[j];
          const kfB = keyframes[j + 1] || keyframes[j];

          // 구간 내에서의 t
          const stopDiff = kfB.stop - kfA.stop;
          const localT = stopDiff === 0 ? 0 : (t - kfA.stop) / stopDiff;

          // 색상 보간
          const rgbA = hexToRgb(kfA.color);
          const rgbB = hexToRgb(kfB.color);
          const rgb = lerpColor(rgbA, rgbB, localT);
          newColors[i] = rgbToHex(rgb);
        }

        setCharColors(newColors);

        if (elapsed < duration + (text.length - 1) * staggerDelay) {
          frame.current = requestAnimationFrame(animate);
        } else {
          // 무한 루프
          frame.current = requestAnimationFrame(() => startAnim());
        }
      }
      frame.current = requestAnimationFrame(animate);
    }
    startAnim();
    return () => {
      stopped = true;
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [text]);

  if (!text) {
    return null;
  }

  return (
    <span ref={textRef} className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{
            color: charColors[index] || keyframes[0].color,
            transition: "color 0.1s linear",
            display: char === " " ? "inline" : "inline-block",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default GradientEffectText;
