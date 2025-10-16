import type { AppsScriptOrderPayload, AppsScriptOrderItem } from "../_shared/appsScriptTypes.ts";

// Helpers to format fields the Apps Script expects.
function toIso(input: string | number | Date | null | undefined): string {
  try {
    if (!input) return new Date().toISOString();
    const d = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function buildAppsScriptPayload(order: any, items: any[]): AppsScriptOrderPayload {
  // Derive broad product_type from detail_product_type used in DB
  const toBroadType = (detail: any): string => {
    if (!detail) return 'UNKNOWN';
    const raw = String(detail).trim();
    const p = raw.toUpperCase();
    if (raw === '문짝' || raw === '도어' || p === 'DOOR') return 'DOOR';
    if (raw === '마감재' || p === 'FINISH') return 'FINISH';
    if (raw === '부속' || p === 'ACCESSORY') return 'ACCESSORY';
    if (raw === '경첩' || p === 'HINGE' || raw === '레일' || p === 'RAIL' || raw === '피스' || p === 'PIECE' || raw === '하드웨어' || p === 'HARDWARE') return 'HARDWARE';
    // Treat all cabinet variants (including Korean) as CABINET
    if (
      raw === '상부장' || raw === '하부장' || raw === '키큰장' || raw === '플랩장' || raw === '서랍장' || raw === '오픈장' ||
      p.includes('CABINET')
    ) return 'CABINET';
    return p;
  };

  // Fallback: if item_options clearly indicate cabinet data, force product_type to CABINET
  const looksLikeCabinet = (opts: any): boolean => {
    if (!opts || typeof opts !== 'object') return false;
    const keys = Object.keys(opts);
    const hasCabinetKeys = ['cabinet_type', 'cabinet_width', 'cabinet_height', 'cabinet_depth', 'body_material_id', 'body_material_name']
      .some((k) => k in opts);
    return hasCabinetKeys;
  };

  const order_items: AppsScriptOrderItem[] = (items || []).map((it) => {
    const baseType = toBroadType(it.detail_product_type ?? it.product_type);
    const opts = (it as any).item_options ?? null;
    const product_type = looksLikeCabinet(opts) ? 'CABINET' : baseType;
    return {
      product_type,
      item_count: Number(it.item_count ?? 0),
      unit_price: Number(it.unit_price ?? 0),
      // If item_options column exists, pass-through; otherwise remain null (Apps Script handles defaults)
      item_options: opts,
      image_url: it.image_url ?? null,
    };
  });

  // Populate delivery info for DeliveryOrder table to help Apps Script decide 배송/픽업 and address
  const order_options = (() => {
    if (order?._table === 'DeliveryOrder') {
      return {
        delivery: {
          recipient_road_address: order?.road_address ?? order?.address1 ?? undefined,
          recipient_detail_address: order?.detail_address ?? order?.address2 ?? undefined,
          // pass through additional known fields if present
          delivery_method: order?.delivery_method ?? undefined,
          is_today_delivery: order?.is_today_delivery ?? undefined,
          delivery_arrival_time: order?.delivery_arrival_time ?? undefined,
        },
      };
    }
    return undefined;
  })();

  const payload: AppsScriptOrderPayload = {
    created_at: toIso(order?.created_at),
    order_id: String(order?.id ?? ""),
    order_number: order?.order_number ?? undefined,
    // Decide delivery/pickup from source table
    delivery_type: order?._table === 'DeliveryOrder' ? 'DELIVERY' : order?._table === 'PickUpOrder' ? 'PICK_UP' : undefined,
    recipient_name: order?.recipient_name ?? undefined,
    recipient_phone: order?.recipient_phone ?? undefined,
    // Prefer road/detail address when present
    address1: order?.road_address ?? order?.address1 ?? undefined,
    address2: order?.detail_address ?? order?.address2 ?? undefined,
    memo: order?.order_memo ?? undefined,
    order_options: order?.order_options ?? order_options,
    order_items,
  };

  return payload;
}
