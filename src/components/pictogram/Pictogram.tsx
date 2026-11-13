import { PICTOGRAMS, type PictogramName } from "./paths";

export type { PictogramName };

/**
 * 선택지 그림(2026-11-13) — 물체를 3D 로 놓고 원근 투영해 그린 것(scripts/pictograms). 단색 lucide 와 달리 위계가 있다:
 * 강조할 부분은 브랜드 파랑 선(1.4) + 옅은 파랑 면(급한 수습만 빨강), 나머지는 회색 가는 선(1), 면은 방향마다 4단 밝기·열린 안쪽은 더 진하게.
 * 배송·엘리베이터·계단은 파랑 단색(scene mono). 선 굵기는 scripts/pictograms/engine.js 의 STROKE 와 같이 바꾼다.
 * 모양을 바꾸려면 scripts/pictograms/scenes.js 를 고치고 `node scripts/pictograms/gen.mjs` 로 paths.ts 를 다시 만든다.
 */
const FILL: Record<string, string[]> = {
  g: ["#ffffff", "#f1f1f4", "#e3e3e8", "#d3d3da"],
  i: ["#ececf0", "#dedee4", "#cfcfd6", "#c2c2ca"],
  b: ["hsl(214 100% 98%)", "hsl(214 95% 93%)", "hsl(214 88% 86%)", "hsl(214 80% 79%)"],
  j: ["hsl(214 80% 88%)", "hsl(214 70% 82%)", "hsl(214 62% 76%)", "hsl(214 55% 70%)"],
  r: ["hsl(0 100% 98%)", "hsl(0 92% 94%)", "hsl(0 86% 88%)", "hsl(0 80% 82%)"],
  k: ["hsl(0 70% 88%)", "hsl(0 62% 82%)", "hsl(0 55% 76%)", "hsl(0 50% 70%)"],
};
const STROKE: Record<string, [string, number]> = {
  g: ["#8a8a94", 1],
  b: ["hsl(var(--primary))", 1.4],
  r: ["hsl(var(--destructive))", 1.4],
  gl: ["#a3a3ad", 0.75],
  bl: ["hsl(216 100% 64%)", 1],
  rl: ["hsl(0 84% 62%)", 1],
};

export default function Pictogram({ name, size = 32, className }: { name: PictogramName; size?: number; className?: string }) {
  return (
    // 크기는 style 로 — shadcn Toggle·Button 의 [&_svg]:size-4 가 width 속성을 덮는다
    <svg viewBox="0 0 24 24" style={{ width: size, height: size }} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {PICTOGRAMS[name].map(([f, s, d], i) => {
        const fill = f ? FILL[f[0]][+f[1]] : "none";
        // ~ = 둥근 면 조각 사이 틈 메우기(같은 색 아주 가는 선)
        const [stroke, width] = s === "~" ? [fill, 0.3] : s ? STROKE[s] : [undefined, undefined];
        return <path key={i} d={d} fill={fill} stroke={stroke} strokeWidth={width} />;
      })}
    </svg>
  );
}
