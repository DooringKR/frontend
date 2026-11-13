"use client";

import Link from "next/link";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import coverage from "@/lib/design/behavior-coverage.json";
import { BEHAVIORS } from "@/lib/design/behaviors";

type Row = { id: string; comp: number; compFiles: number; raw: number; rawWhere: string[]; single?: string };
const byId = new Map((coverage.rows as Row[]).map((r) => [r.id, r]));

/**
 * 동작 목록 — 동작마다 맡은 컴포넌트·규칙·「컴포넌트를 쓴 곳 / 직접 짠 곳」(npm run behaviors 로 센 값).
 * 바로키친 어드민 설정 › 동작 목록(/more/behaviors)과 같은 자리. 견본은 /dev/design.
 */
export default function BehaviorsPage() {
  const cats = [...new Set(BEHAVIORS.map((b) => b.category))];
  const rows = coverage.rows as Row[];
  const counted = rows.filter((r) => !r.single && (r.comp || r.raw));
  const comp = counted.reduce((s, r) => s + r.comp, 0);
  const raw = counted.reduce((s, r) => s + r.raw, 0);
  return (
    <div className="flex flex-col pb-20">
      <h1 className="px-5 pt-8 text-[22px] font-700 text-gray-900">동작 목록</h1>
      <p className="px-5 pt-1 text-[14px] text-gray-500">
        컴포넌트 {comp} · 직접 {raw} · {Math.round((comp / Math.max(1, comp + raw)) * 100)}% · 셈 {coverage.at.slice(0, 16).replace("T", " ")} ·{" "}
        <Link href="/dev/design" className="text-primary underline">
          견본
        </Link>
      </p>
      {cats.map((c) => (
        <section key={c} className="px-5 pt-6">
          <h2 className="pb-2 text-[14px] font-600 text-gray-500">{c}</h2>
          <div className="flex flex-col divide-y divide-gray-100 rounded-[12px] border border-border">
            {BEHAVIORS.filter((b) => b.category === c).map((b) => {
              const r = byId.get(b.id);
              return (
                <Collapsible key={b.id} className="px-4 py-3">
                  <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 text-left">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[15px] font-600 text-gray-800">{b.name}</span>
                      <span className="text-[12px] text-gray-500">{b.component}</span>
                    </span>
                    {r?.single ? (
                      <Badge color="gray">한 화면</Badge>
                    ) : (
                      <span className="flex shrink-0 gap-1">
                        <Badge color="blue">{r?.comp ?? 0}</Badge>
                        <Badge color={r?.raw ? "yellow" : "green"}>{r?.raw ?? 0}</Badge>
                      </span>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 text-[14px] text-gray-600">
                    <p>{b.rule}</p>
                    {!!r?.rawWhere.length && (
                      <ul className="mt-1 list-disc pl-4 text-gray-500">
                        {r.rawWhere.map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
