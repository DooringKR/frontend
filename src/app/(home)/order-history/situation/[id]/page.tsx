"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import { dateLabel } from "@/components/form/DateField";
import PhotoThumbs from "@/components/media/PhotoThumbs";
import { EmptyState, ErrorBanner, Loading } from "@/components/state/StateViews";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

import Row from "@/app/(home)/request/_components/Row";
import { receiveLine } from "@/app/(home)/request/_lib/flow";
import type { ReceiveInput } from "@/app/(home)/request/_lib/requestStore";
import { URGENT_NAME } from "@/app/(home)/request/_lib/situations";
import { photoUrlOf } from "@/app/(home)/request/_lib/submit";

import { SITUATION_STATUS } from "../../components/SituationOrderList";

interface Part {
  position: number;
  situation: string;
  buttons: string[];
  amount_note: string | null;
  memo: string | null;
  photo_paths: string[];
  current_photo_paths: string[];
}
interface Order {
  id: string;
  created_at: string;
  urgent: boolean;
  status: keyof typeof SITUATION_STATUS;
  install_needed: boolean | null;
  preferred_date: string | null;
  preferred_time: string | null;
  receive: ReceiveInput | null;
  road_address: string | null;
  detail_address: string | null;
  building_type: string | null;
  pyeong: string | null;
  parking: string | null;
  elevator: boolean | null;
  contact_name: string | null;
  contact_phone: string | null;
  call_time: string | null;
  access_info: string | null;
  request_note: string | null;
  SituationOrderPart: Part[];
}

/**
 * 상황 주문 다시 보기(2026-11-23 사용자 「주문 내역 다시 볼 수 있게, 자기가 올린 사진도」) — 주문 확인 화면과 같은 줄·차례.
 * 상황마다 현재 상태·참고 사진을 썸네일로, 누르면 크게(PhotoThumbs → PhotoViewer). 본인 주문만 읽힌다(RLS).
 * 메모 칸에는 경첩 답이 「경첩 필요(…)」로 들어 있어 그대로 보인다(submit.ts 가 hingeNote 로 쓴 글).
 */
export default function SituationOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from("SituationOrder")
      .select(
        "id, created_at, urgent, status, install_needed, preferred_date, preferred_time, receive, road_address, detail_address, building_type, pyeong, parking, elevator, contact_name, contact_phone, call_time, access_info, request_note, SituationOrderPart(position, situation, buttons, amount_note, memo, photo_paths, current_photo_paths)",
      )
      .eq("id", id)
      .eq("kind", "order")
      .maybeSingle();
    if (error) return setError("주문을 불러오지 못했어요");
    setOrder((data as Order | null) ?? null);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const st = order ? SITUATION_STATUS[order.status] : null;
  const parts = order ? [...order.SituationOrderPart].sort((a, b) => a.position - b.position) : [];
  const photosOf = (p: Part, kind: "current" | "ref") =>
    (kind === "current" ? p.current_photo_paths : p.photo_paths).map((path, n) => ({
      src: photoUrlOf(path),
      alt: `${p.situation} ${kind === "current" ? "현재 상태" : "참고"} 사진 ${n + 1}`,
    }));

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator title="상세 내역" backTo="/order-history" />
      <div className="flex flex-col px-5 pb-[100px]">
        {error ? (
          <ErrorBanner text={error} onRetry={load} className="mt-5" />
        ) : order === undefined ? (
          <Loading />
        ) : order === null ? (
          <EmptyState text="주문을 찾을 수 없어요" action={{ label: "주문 내역", onClick: () => router.replace("/order-history") }} />
        ) : (
          <>
            <div className="flex items-center justify-between pb-2 pt-5 text-[14px] text-gray-500">
              <span>{new Date(order.created_at).toLocaleDateString("ko-KR")} 주문</span>
              {st && <Badge color={st.color}>{st.text}</Badge>}
            </div>
            {/* amp-mask: 세션 리플레이에서 이름·연락처·주소·출입 정보 글을 가린다 */}
            <div className="amp-mask flex flex-col divide-y divide-gray-100">
              {order.urgent && <Row label={URGENT_NAME}>신청함</Row>}
              {parts.map((p) => (
                <Row key={p.position} label={p.situation}>
                  {[p.buttons.join(", ") || "직접 입력", p.memo, p.amount_note].filter(Boolean).join("\n")}
                  {p.current_photo_paths.length > 0 && (
                    <div className="mt-2">
                      <div className="mb-1 text-[14px] text-gray-500">현재 상태</div>
                      <PhotoThumbs size="row" photos={photosOf(p, "current")} />
                    </div>
                  )}
                  {p.photo_paths.length > 0 && (
                    <div className="mt-2">
                      <div className="mb-1 text-[14px] text-gray-500">참고 사진</div>
                      <PhotoThumbs size="row" photos={photosOf(p, "ref")} />
                    </div>
                  )}
                </Row>
              ))}
              {order.install_needed !== null && <Row label="시공">{order.install_needed ? "필요해요" : "필요 없어요"}</Row>}
              {order.install_needed === true && order.preferred_date && (
                <Row label="시공 날짜">{[dateLabel(order.preferred_date), order.preferred_time].filter(Boolean).join(" ")}</Row>
              )}
              {order.install_needed === false && order.receive && <Row label="받는 방법">{receiveLine(order.receive)}</Row>}
              {order.road_address && (
                <Row label="현장">
                  {[order.road_address, order.detail_address].filter(Boolean).join(" ")}
                  {`\n${[
                    order.building_type,
                    order.pyeong,
                    order.install_needed && order.parking && `주차 ${order.parking}`,
                    order.install_needed && order.elevator !== null && `엘리베이터 ${order.elevator ? "있음" : "없음"}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}`}
                </Row>
              )}
              {order.contact_name && (
                <Row label="받으시는 분">
                  {`${order.contact_name} ${order.contact_phone ?? ""}${order.call_time ? `\n통화 ${order.call_time}` : ""}${order.access_info ? `\n출입 ${order.access_info}` : ""}`}
                </Row>
              )}
              {order.request_note && <Row label="요청사항">{order.request_note}</Row>}
            </div>
          </>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}
