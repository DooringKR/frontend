/**
 * 동작 목록 진행률 세기 — src/lib/design/behaviors.ts 의 동작마다 「컴포넌트를 쓴 곳 / 직접 짠 곳」을 센다(바로키친 어드민 scripts/behavior-coverage.ts 와 같은 셈).
 * 사용: npm run behaviors   (컴포넌트로 옮긴 뒤 다시 돌려 커밋한다) → src/lib/design/behavior-coverage.json → /dev/behaviors
 * 셈은 정규식이라 몇 곳 오차가 있을 수 있다 — 「직접 짠 곳」 파일 목록을 같이 남겨 확인할 수 있게 한다.
 */
import fs from "node:fs";
import path from "node:path";

import { BEHAVIORS, PART_FILES } from "../src/lib/design/behaviors";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "src", "lib", "design", "behavior-coverage.json");
// 목록 자신·견본·서버 코드·그림 계산(svg)은 세지 않는다
const SKIP = [/[\\/]node_modules[\\/]/, /[\\/]lib[\\/]design[\\/]/, /[\\/]app[\\/]api[\\/]/, /[\\/]components[\\/]svg[\\/]/, /[\\/]DDD[\\/]/];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (SKIP.some((r) => r.test(p + path.sep))) continue;
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !/\.d\.ts$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(path.join(ROOT, "src")).map((p) => ({ rel: path.relative(ROOT, p).replace(/\\/g, "/"), text: fs.readFileSync(p, "utf8") }));
const parts = PART_FILES.map((e) => new RegExp(e));
const screens = files.filter((f) => !parts.some((r) => r.test(f.rel)));

function tally(re?: string) {
  if (!re) return { total: 0, where: [] as string[] };
  const r = new RegExp(re, "g");
  let total = 0;
  const where: string[] = [];
  for (const f of screens) {
    const n = f.text.match(r)?.length ?? 0;
    if (n) {
      total += n;
      where.push(`${f.rel} ×${n}`);
    }
  }
  return { total, where };
}

const rows = BEHAVIORS.map((b) => {
  const comp = tally(b.count?.comp);
  const raw = tally(b.count?.raw);
  return { id: b.id, comp: comp.total, compFiles: comp.where.length, raw: raw.total, rawWhere: raw.where, ...(b.count?.single ? { single: b.count.single } : {}) };
});
fs.writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), rows }, null, 2) + "\n");

const counted = rows.filter((r) => !r.single && (r.comp || r.raw));
const comp = counted.reduce((s, r) => s + r.comp, 0);
const raw = counted.reduce((s, r) => s + r.raw, 0);
for (const r of rows) console.log(`${r.id.padEnd(12)} 컴포넌트 ${String(r.comp).padStart(4)}  직접 ${String(r.raw).padStart(4)}${r.single ? "  (한 화면)" : ""}`);
console.log(`\n컴포넌트를 쓴 곳 ${comp} · 직접 짠 곳 ${raw} · ${Math.round((comp / Math.max(1, comp + raw)) * 100)}% · 직접 짠 곳 0 인 동작 ${counted.filter((r) => r.raw === 0).length}/${counted.length}`);
