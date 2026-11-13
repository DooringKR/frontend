/**
 * 상황 주문 보내기 — (사진은 고를 때 이미 올림) SituationOrder·SituationOrderPart 저장(본인 RLS) → /api/request/submit
 * (서버가 로그인 토큰을 실어 바로키친 어드민 /api/barogagu/intake 를 부른다 → 현장허브 「키친 AS」 현장).
 * 저장은 됐는데 어드민 호출이 실패하면 orderId 를 돌려줘서 같은 주문으로 다시 보낼 수 있게 한다(어드민은 한 번만 만든다).
 */
import { SupabaseUploadImageUsecase } from "@/DDD/usecase/upload_image_usecase";
import { supabase } from "@/lib/supabase";

import { useRequestStore } from "./requestStore";
import { SITUATIONS, travelFeeOf } from "./situations";

const BUCKET = "customer-input-image";
const BUCKET_PATH = `/object/public/${BUCKET}/`;

export class NotLoggedIn extends Error {}

/** 사진을 올리고 버킷 안 경로를 돌려준다 — 상황 자세히에서 고르는 즉시 부른다 */
export async function uploadPhotos(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const urls = await new SupabaseUploadImageUsecase().uploadImages(files, "situation-orders");
  return urls.map((u) => decodeURIComponent(u.slice(u.indexOf(BUCKET_PATH) + BUCKET_PATH.length)));
}

export const photoUrlOf = (path: string) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

/** 저장만 — 주문 id 를 돌려준다 */
export async function saveOrder(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new NotLoggedIn();

  const s = useRequestStore.getState();
  const picked = SITUATIONS.filter((x) => s.situations.includes(x.slug));
  const photoPaths = picked.map((x) => s.photoPaths[x.slug] ?? []);

  const minutes = s.installNeeded ? s.travelMinutes : null;
  const { data: order, error } = await supabase
    .from("SituationOrder")
    .insert({
      kind: "order",
      urgent: s.urgent,
      install_needed: s.installNeeded,
      road_address: s.roadAddress || null,
      detail_address: s.detailAddress.trim() || null,
      lat: s.lat,
      lon: s.lon,
      building_type: s.buildingType,
      pyeong: s.pyeong.trim() || null,
      contact_name: s.contactName.trim() || null,
      contact_phone: s.contactPhone.trim() || null,
      call_time: s.callTime.trim() || null,
      // 주차·엘리베이터는 시공이 필요할 때만 묻는다 — 시공 필요 → 필요 없음으로 바꾼 뒤 남은 값은 보내지 않는다
      parking: s.installNeeded ? s.parking : null,
      elevator: s.installNeeded ? s.elevator : null,
      access_info: s.accessInfo.trim() || null,
      preferred_date: s.installNeeded && !s.urgent && s.preferredDate ? s.preferredDate : null,
      receive: s.installNeeded ? null : s.receive,
      request_note: s.requestNote.trim() || null,
      travel_minutes: minutes,
      travel_fee: minutes == null ? null : travelFeeOf(minutes),
    })
    .select("id")
    .single();
  if (error || !order) throw new Error(`주문을 저장하지 못했습니다: ${error?.message ?? "빈 응답"}`);

  const { error: pe } = await supabase.from("SituationOrderPart").insert(
    picked.map((x, i) => {
      const p = s.parts[x.slug];
      return {
        order_id: order.id,
        position: i,
        situation: x.name,
        buttons: p?.buttons ?? [],
        photo_paths: photoPaths[i],
        amount_note: p?.amountNote.trim() || null,
        memo: p?.memo.trim() || null,
      };
    }),
  );
  if (pe) throw new Error(`주문 내용을 저장하지 못했습니다: ${pe.message}`);
  return order.id as string;
}

/** 어드민에 현장 만들기 요청 */
export async function sendOrder(orderId: string): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new NotLoggedIn();
  const res = await fetch("/api/request/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `접수하지 못했습니다(${res.status})`);
  }
}

/** 자재 필요없는 수리 — 서비스는 안 하지만 몇 번 눌렸는지 수요로 센다(로그인했을 때만) */
export async function recordRepairInquiry(urgent: boolean): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return;
  await supabase.from("SituationOrder").insert({ kind: "repair_inquiry", status: "not_served", urgent });
}
