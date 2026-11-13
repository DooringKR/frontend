"use client";

import { useCallback, useEffect, useState } from "react";

import { ErrorBanner, ListSkeleton } from "@/components/state/StateViews";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Row {
  id: string;
  created_at: string;
  urgent: boolean;
  status: "submitted" | "sent" | "failed" | "not_served";
  SituationOrderPart: { situation: string; buttons: string[]; position: number }[];
}

const STATUS: Record<Row["status"], { text: string; color: BadgeProps["color"] } | null> = {
  submitted: { text: "접수 중", color: "blue" },
  sent: { text: "접수됨", color: "green" },
  failed: { text: "접수 확인 중", color: "yellow" },
  not_served: null,
};

const PAGE = 20;

/**
 * 상황 주문 내역 — 품목 주문(DeliveryOrder·PickUpOrder) 위에 따로 보여 준다. 20건씩, 더 있으면 「더 보기」.
 * 진행 상황은 담당자가 보내 주는 도어링 허브 링크에서 본다(허브는 거래처 링크로만 들어간다).
 * onCount: 다 읽은 뒤 건수(읽기 전·실패면 부르지 않는다 — 화면이 「없음」을 미리 띄우지 않게).
 */
export function SituationOrderList({ onCount }: { onCount?: (n: number) => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (n: number) => {
      setBusy(true);
      setError(null);
      // 한 건 더 읽어 더 있는지 본다
      const { data, error } = await supabase
        .from("SituationOrder")
        .select("id, created_at, urgent, status, SituationOrderPart(situation, buttons, position)")
        .eq("kind", "order")
        .order("created_at", { ascending: false })
        .range(0, n);
      setBusy(false);
      if (error) return setError("상황 주문 내역을 불러오지 못했어요");
      const list = (data ?? []) as Row[];
      setHasMore(list.length > n);
      setRows(list.slice(0, n));
      onCount?.(Math.min(list.length, n));
    },
    [onCount],
  );

  useEffect(() => {
    load(PAGE);
  }, [load]);

  if (!rows) return error ? <ErrorBanner text={error} onRetry={() => load(PAGE)} className="mb-6" /> : <ListSkeleton rows={2} className="mb-6" />;
  if (!rows.length) return null;
  return (
    <div className="mb-6 flex flex-col gap-3">
      {rows.map((r) => {
        const st = STATUS[r.status];
        return (
          <div key={r.id} className="rounded-[12px] border border-gray-200 px-5 py-4">
            <div className="flex items-center justify-between text-[14px] text-gray-500">
              <span>{new Date(r.created_at).toLocaleDateString("ko-KR")}</span>
              {st && <Badge color={st.color}>{st.text}</Badge>}
            </div>
            <div className="mt-1 text-[17px] font-600 text-gray-800">
              {[...r.SituationOrderPart].sort((a, b) => a.position - b.position).map((p) => p.situation).join(" · ")}
            </div>
            <div className="mt-1 text-[14px] text-gray-500">
              {[r.urgent ? "현장 급한 수습" : null, ...r.SituationOrderPart.flatMap((p) => p.buttons)].filter(Boolean).join(", ")}
            </div>
          </div>
        );
      })}
      {error && <ErrorBanner text={error} onRetry={() => load(rows.length + PAGE)} />}
      {hasMore && !error && (
        <Button variant="secondary" size="md" busy={busy} onClick={() => load(rows.length + PAGE)}>
          더 보기
        </Button>
      )}
    </div>
  );
}
