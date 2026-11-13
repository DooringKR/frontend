"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

interface Row {
  id: string;
  created_at: string;
  urgent: boolean;
  status: "submitted" | "sent" | "failed" | "not_served";
  SituationOrderPart: { situation: string; buttons: string[]; position: number }[];
}

const STATUS: Record<Row["status"], string> = { submitted: "접수 중", sent: "접수됨", failed: "접수 확인 중", not_served: "" };

/**
 * 상황 주문 내역 — 품목 주문(DeliveryOrder·PickUpOrder) 위에 따로 보여 준다.
 * 진행 상황은 담당자가 보내 주는 도어링 허브 링크에서 본다(허브는 거래처 링크로만 들어간다).
 */
export function SituationOrderList({ onCount }: { onCount?: (n: number) => void }) {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase
      .from("SituationOrder")
      .select("id, created_at, urgent, status, SituationOrderPart(situation, buttons, position)")
      .eq("kind", "order")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setRows((data ?? []) as Row[]);
        onCount?.(data?.length ?? 0);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!rows.length) return null;
  return (
    <div className="mb-6 space-y-3">
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-gray-200 px-5 py-4">
          <div className="flex items-center justify-between text-[14px] text-gray-500">
            <span>{new Date(r.created_at).toLocaleDateString("ko-KR")}</span>
            <span className="font-500 text-brand-600">{STATUS[r.status]}</span>
          </div>
          <div className="mt-1 text-[17px] font-600 text-gray-800">
            {[...r.SituationOrderPart].sort((a, b) => a.position - b.position).map((p) => p.situation).join(" · ")}
          </div>
          <div className="mt-1 text-[14px] text-gray-500">
            {[r.urgent ? "현장 급한 수습" : null, ...r.SituationOrderPart.flatMap((p) => p.buttons)].filter(Boolean).join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
