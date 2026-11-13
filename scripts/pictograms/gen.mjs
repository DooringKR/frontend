// 픽토그램 경로 만들기 — scenes.js(장면) 를 engine.js 로 원근 투영해 src/components/pictogram/paths.ts 에 쓴다.
// 사용: node scripts/pictograms/gen.mjs   (장면을 고친 뒤 다시 돌려 같이 커밋한다)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const dir = path.dirname(fileURLToPath(import.meta.url));
const ctx = vm.createContext({ Math, console });
for (const f of ["engine.js", "scenes.js"]) vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
const scenes = vm.runInContext("SCENES", ctx);
const render = vm.runInContext("render", ctx);

const FILLS = new Set([..."gibjrk"].flatMap((c) => [0, 1, 2, 3].map((n) => c + n)));
const STROKES = new Set(["", "~", "g", "b", "r", "gl", "bl", "rl"]);
const bad = (name, items) => items.filter(([f, s]) => (f && !FILLS.has(f)) || !STROKES.has(s)).map(([f, s]) => `${name}: 칠 ${f || "-"} 선 ${s || "-"}`);
const errors = [];
let body = "";
for (const [name, sc] of Object.entries(scenes)) {
  const items = render(sc).map((it) => [it.f, it.seam ? "~" : it.s, it.d]);
  errors.push(...bad(name, items));
  body += `  /** ${sc.label} */\n  ${name}: ${JSON.stringify(items)},\n`;
}
// 쓰기 전에 멈춤 — Pictogram 컴포넌트 표에 없는 코드는 화면을 죽인다(2026-11-13 운영 빌드 실패: 창고문 환기 구멍 선 j)
if (errors.length) {
  console.error("Pictogram 표에 없는 코드:\n" + errors.join("\n"));
  process.exit(1);
}
const names = Object.keys(scenes);
const out =
  `// 자동 생성 — scripts/pictograms/gen.mjs. 손으로 고치지 말고 scripts/pictograms/scenes.js 를 고친 뒤 다시 돌린다.\n` +
  `// [칠(바탕 g·강조 b·경고 r·안쪽 i/j/k + 밝기 0~3), 선(g·b·r, 가는 선 gl·bl·rl, ~ 면 이음), 경로(24 칸)]\n` +
  `export type PictogramName = ${names.map((n) => JSON.stringify(n)).join(" | ")};\n\n` +
  `export const PICTOGRAMS: Record<PictogramName, [string, string, string][]> = {\n${body}};\n`;
const target = path.join(dir, "..", "..", "src", "components", "pictogram", "paths.ts");
fs.writeFileSync(target, out);
console.log(`픽토그램 ${names.length}개 → ${path.relative(process.cwd(), target)} (${(out.length / 1024).toFixed(1)}KB)`);
