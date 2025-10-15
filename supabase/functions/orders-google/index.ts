// @ts-nocheck
// Deno Edge Function (Supabase)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildAppsScriptPayload } from "../_shared/buildAppsScriptPayload.ts";
import { getDoorColorName, getFinishColorName, getCabinetColorName } from "../_shared/colorLookup.ts";
import { getBodyMaterialName } from "../_shared/bodyMaterialLookup.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 필요 시 특정 도메인으로 제한
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}), ...corsHeaders },
  });
}

// Util: 환경변수 안전히 읽기
function mustEnv(key: string): string {
  const v = Deno.env.get(key);
  if (!v) throw new Error(`Missing environment variable: ${key}`);
  return v;
}

// Edge Function Entrypoint
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return jsonResponse({ ok: false, error: "Unsupported Media Type" }, { status: 415 });
    }

    const body = await req.json().catch(() => ({}));
    const orderId: string | undefined = body.orderId;
    const debug: boolean = !!body.debug; // debug=true => don't call Apps Script, just return payload
    const returnPayload: boolean = !!body.returnPayload; // returnPayload=true => include payload in normal response
    const debugLogs: any[] = [];
    const dbg = (...args: any[]) => {
      try {
        console.log("[orders-google][DBG]", ...args);
        // Keep logs short to avoid huge responses; stringify small objects only
        const safeArgs = args.map((a) => {
          if (typeof a === 'object' && a !== null) {
            const keys = Object.keys(a).slice(0, 20);
            const out: any = {};
            for (const k of keys) out[k] = (a as any)[k];
            return { _type: 'obj', keys: Object.keys(a), preview: out };
          }
          return a;
        });
        debugLogs.push(safeArgs);
      } catch (_) {
        // noop
      }
    };
    if (!orderId) {
      return jsonResponse({ ok: false, error: "orderId is required" }, { status: 400 });
    }

  // Prefer environment variables; fallback to hardcoded defaults for local convenience ONLY.
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://ltndnqysxsyldvkrbpfq.supabase.co";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bmRucXlzeHN5bGR2a3JicGZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjcwOTA5MiwiZXhwIjoyMDcyMjg1MDkyfQ.ZB8cRo7HDnwHGrstZxib6WvVRoV441FSooG6OC1DC8g";
  // Fallback updated to new /exec deployment URL (use secret override in production!)
  let APPS_SCRIPT_URL = Deno.env.get("APPS_SCRIPT_URL") ?? "https://script.google.com/macros/s/AKfycbwNKYzCtEfqdmjbUhGBYTW3nZxsr--nX312mxkgJzhmmesR55Hq1dc8OQBPTFQnK_rs/exec";
  // sanitize accidental wrapping quotes from secrets ("url")
  if (/^".+"$/.test(APPS_SCRIPT_URL) || /^'.+'$/.test(APPS_SCRIPT_URL)) {
    const original = APPS_SCRIPT_URL;
    APPS_SCRIPT_URL = APPS_SCRIPT_URL.replace(/^['"]|['"]$/g, '');
    console.log('orders-google: sanitized APPS_SCRIPT_URL (removed wrapping quotes)');
    // Optionally log diff
    if (original !== APPS_SCRIPT_URL) {
      console.log('orders-google: before=', original, 'after=', APPS_SCRIPT_URL);
    }
  }
  if (APPS_SCRIPT_URL.endsWith('/dev')) {
    console.warn('orders-google: Using /dev Apps Script endpoint (requires auth in some cases). Consider deploying and using the /exec URL for production stability.');
  }
  // Debug log endpoint (safe)
  console.log('orders-google: Apps Script URL:', APPS_SCRIPT_URL);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1) 주문 조회 (DeliveryOrder / PickUpOrder 테이블 탐색)
    let order: any = null;
    let orderErr: any = null;
    for (const table of ["DeliveryOrder", "PickUpOrder"]) {
      const { data, error } = await supabase.from(table).select("*").eq("id", orderId).single();
      if (!error && data) {
        order = { ...data, _table: table };
        dbg('order-found', { table, id: orderId });
        break;
      }
      orderErr = error;
    }
    if (!order) {
      console.error("orders-google: order not found in DeliveryOrder/PickUpOrder", orderErr);
      return jsonResponse({ ok: false, error: "Order not found" }, { status: 404 });
    }

    // 2) 주문 아이템 조회 (OrderItem) + 각 아이템의 상세 자재 테이블 조인(앱에서 분리 저장됨)
    const { data: rawItems, error: itemsErr } = await supabase.from("OrderItem").select("*").eq("order_id", orderId);
    if (itemsErr) {
      console.error("orders-google: OrderItem fetch error", itemsErr);
      return jsonResponse({ ok: false, error: "Order items fetch failed" }, { status: 500 });
    }
    dbg('items-loaded', { count: (rawItems || []).length });

    // Helper: normalize detail_product_type (handles Korean + enum variants)
    function normalizeDetail(detailType: string | undefined | null): string {
      const raw = String(detailType ?? '').trim();
      const u = raw.toUpperCase();
      if (raw === '문짝' || raw === '도어' || u === 'DOOR') return 'DOOR';
      if (raw === '마감재' || u === 'FINISH') return 'FINISH';
      if (raw === '부속' || u === 'ACCESSORY') return 'ACCESSORY';
      if (raw === '경첩' || u === 'HINGE') return 'HINGE';
      if (raw === '레일' || u === 'RAIL') return 'RAIL';
      if (raw === '피스' || u === 'PIECE') return 'PIECE';
      if (raw === '상부장' || u === 'UPPERCABINET' || u === 'UPPER_CABINET') return 'UPPERCABINET';
      if (raw === '하부장' || u === 'LOWERCABINET' || u === 'LOWER_CABINET') return 'LOWERCABINET';
      if (raw === '플랩장' || u === 'FLAPCABINET' || u === 'FLAP_CABINET') return 'FLAPCABINET';
      if (raw === '서랍장' || u === 'DRAWERCABINET' || u === 'DRAWER_CABINET') return 'DRAWERCABINET';
      if (raw === '오픈장' || u === 'OPENCABINET' || u === 'OPEN_CABINET') return 'OPENCABINET';
      return u; // fallback to whatever was provided (uppercased)
    }

    // Helper: map detail_product_type to material table name
    function materialTableFor(detailType: string | undefined | null): string | null {
      if (!detailType) return null;
      const t = normalizeDetail(detailType);
      switch (t) {
        case 'DOOR': return 'Door';
        case 'FINISH': return 'Finish';
        case 'ACCESSORY': return 'Accessory';
        case 'HINGE': return 'Hinge';
        case 'RAIL': return 'Rail';
        case 'PIECE': return 'Piece';
        case 'UPPERCABINET': return 'UpperCabinet';
        case 'LOWERCABINET': return 'LowerCabinet';
        case 'FLAPCABINET': return 'FlapCabinet';
        case 'DRAWERCABINET': return 'DrawerCabinet';
        case 'OPENCABINET': return 'OpenCabinet';
        default: return null;
      }
    }

    // Helper: derive broad product category from detail
    function toBroadType(detail: string | undefined | null): 'DOOR' | 'FINISH' | 'ACCESSORY' | 'HARDWARE' | 'CABINET' | 'UNKNOWN' {
      if (!detail) return 'UNKNOWN';
      const t = normalizeDetail(detail);
      if (t === 'DOOR') return 'DOOR';
      if (t === 'FINISH') return 'FINISH';
      if (t === 'ACCESSORY') return 'ACCESSORY';
      if (t === 'HINGE' || t === 'RAIL' || t === 'PIECE' || t === 'HARDWARE') return 'HARDWARE';
      if (t.includes('CABINET')) return 'CABINET';
      return 'UNKNOWN';
    }

    // Helper: map item_detail row into Apps Script expected item_options
    function cleanOptions<T extends Record<string, any>>(obj: T | null | undefined): T | null {
      if (!obj) return null;
      const out: any = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined && v !== null && v !== "") out[k] = v;
      }
      return Object.keys(out).length ? out : null;
    }

    function mapItemOptions(detailType: string | undefined | null, material: any): any {
      if (!detailType || !material) return null;
      const t = normalizeDetail(detailType);
      if (t === 'DOOR') {
        return cleanOptions({
          door_type: material.door_type ?? material.slug ?? material.type ?? undefined,
          door_type_direct_input: material.door_type_direct_input ?? undefined,
          // Prefer human-readable color name/label if present
          door_color: material.door_color_name ?? material.door_color_label ?? material.color_name ?? material.color_label ?? material.color?.name ?? material.door_color ?? material.color ?? undefined,
          // Explicit color name slot if we resolve via FK
          door_color_name: material.door_color_name ?? material.color_name ?? material.color?.name ?? undefined,
          // Direct input for color
          door_color_direct_input: material.door_color_direct_input ?? material.color_direct_input ?? undefined,
          door_width: material.door_width ?? material.width ?? undefined,
          door_height: material.door_height ?? material.height ?? undefined,
          hinge_count: material.hinge_count ?? material.hinge?.hingeCount ?? undefined,
          hinge_direction: material.hinge_direction ?? material.hinge?.hingePosition ?? undefined,
          note: material.door_request ?? material.doorRequest ?? material.note ?? undefined,
        });
      }
      if (t === 'FINISH') {
        return cleanOptions({
          // Prefer display name first
          finish_color: material.finish_color_name ?? material.finish_color_label ?? material.color_name ?? material.color_label ?? material.color?.name ?? material.finish_color ?? material.color ?? undefined,
          finish_color_name: material.finish_color_name ?? material.color_name ?? material.color?.name ?? undefined,
          // Direct input for color
          finish_color_direct_input: material.finish_color_direct_input ?? material.color_direct_input ?? undefined,
          finish_base_depth: material.finish_base_depth ?? material.baseDepth ?? material.depth ?? undefined,
          finish_base_height: material.finish_base_height ?? material.baseHeight ?? material.height ?? undefined,
          finish_additional_depth: material.finish_additional_depth ?? material.additionalDepth ?? undefined,
          finish_additional_height: material.finish_additional_height ?? material.additionalHeight ?? undefined,
          note: material.finish_request ?? material.finishRequest ?? material.note ?? undefined,
        });
      }
      if (t.includes('CABINET')) {
        // Normalize cabinet_type from detail type
        const cabinet_type =
          t === 'UPPERCABINET' ? 'UPPER' :
          t === 'LOWERCABINET' ? 'LOWER' :
          t === 'FLAPCABINET' ? 'FLAP' :
          t === 'DRAWERCABINET' ? 'DRAWER' :
          t === 'OPENCABINET' ? 'OPEN' : undefined;
        return cleanOptions({
          cabinet_type,
          cabinet_color: material.cabinet_color_name ?? material.cabinet_color_label ?? material.color_name ?? material.color_label ?? material.color?.name ?? material.cabinet_color ?? material.color ?? undefined,
          cabinet_color_name: material.cabinet_color_name ?? material.color_name ?? material.color?.name ?? undefined,
          cabinet_color_direct_input: material.cabinet_color_direct_input ?? material.door_color_direct_input ?? material.color_direct_input ?? undefined,
          // Body color (separate from door color). Try common field names; will also resolve via list below.
          body_color: material.body_color_name ?? material.body_color_label ?? material.body_color ?? material.bodyColor ?? material.body_finish_color ?? material.body_finish_color_id ?? material.finish_color ?? undefined,
          body_color_name: material.body_color_name ?? undefined,
          body_color_direct_input: material.body_color_direct_input ?? material.color_direct_input ?? undefined,
            // Body material: explicit ID/name fields
            body_material_id: material.cabinet_body_material ?? material.cabinet_body_material_id ?? material.body_material_id ?? material.body_material ?? undefined,
            body_material_name: material.body_material_name ?? undefined,
          body_material_direct_input: material.body_material_direct_input ?? material.cabinet_body_material_direct_input ?? material.body_direct_input ?? undefined,
          cabinet_width: material.cabinet_width ?? material.width ?? undefined,
          cabinet_height: material.cabinet_height ?? material.height ?? undefined,
          cabinet_depth: material.cabinet_depth ?? material.depth ?? undefined,
          body_type: material.body_type ?? undefined,
          body_type_direct_input: material.body_type_direct_input ?? undefined,
          note: material.cabinet_request ?? material.cabinetRequests ?? material.note ?? undefined,
        });
      }
      if (t === 'ACCESSORY') {
        // Accept both new and legacy field names
        const rawType = material.accessory_type ?? material.slug ?? undefined;
        return cleanOptions({
          accessory_type: rawType,
          accessory_madeby: material.accessory_madeby ?? material.madeBy ?? undefined,
          accessory_model: material.accessory_model ?? material.model ?? undefined,
          note: material.accessory_request ?? material.accessoryRequest ?? material.note ?? undefined,
        });
      }
      if (t === 'HINGE' || t === 'RAIL' || t === 'PIECE') {
        return cleanOptions({
          hardware_type: t, // normalized to domain key
          hardware_madeby: material.hardware_madeby ?? material.madeBy ?? undefined,
          hardware_size: material.hardware_size ?? material.model ?? material.size ?? undefined,
          note: material.hardware_request ?? material.hardwareRequest ?? material.note ?? undefined,
        });
      }
      return null;
    }

    // Enrich items with material details into item_options
    let enrichedCount = 0;
    let skippedCount = 0;
    const items = await (async () => {
      const arr = rawItems || [];
      const results: any[] = new Array(arr.length);
      await Promise.all(
        arr.map(async (it, idx) => {
          try {
            const itemInfo = { idx, order_id: it.order_id, detail_product_type: it.detail_product_type, item_detail: it.item_detail };
            if (it.item_options) {
              results[idx] = it; // already enriched
              skippedCount++;
              dbg('item-skip-existing-options', itemInfo);
              return;
            }
            const table = materialTableFor(it.detail_product_type);
            if (!table || !it.item_detail) {
              results[idx] = it;
              skippedCount++;
              dbg('item-skip-no-table-or-id', { ...itemInfo, table });
              return;
            }
            dbg('material-fetch-start', { ...itemInfo, table });
            const { data: material, error } = await supabase.from(table).select('*').eq('id', it.item_detail).single();
            if (error) {
              console.warn('orders-google: material fetch failed', { table, id: it.item_detail, error });
              results[idx] = it;
              skippedCount++;
              dbg('material-fetch-failed', { ...itemInfo, table, error: String(error?.message || error) });
              return;
            }
            dbg('material-fetched', { ...itemInfo, table, materialKeys: Object.keys(material || {}) });
            let item_options = mapItemOptions(it.detail_product_type, material);
            // If color fields are numeric IDs, attach name via local lists
            if (item_options) {
              const tNorm = normalizeDetail(it.detail_product_type);
              if (tNorm === 'DOOR') {
                const id = item_options.door_color ?? material.door_color ?? material.color;
                const name = item_options.door_color_name ?? getDoorColorName(id);
                if (name) item_options.door_color_name = name;
              } else if (tNorm === 'FINISH') {
                const id = item_options.finish_color ?? material.finish_color ?? material.color;
                const name = item_options.finish_color_name ?? getFinishColorName(id);
                if (name) item_options.finish_color_name = name;
              } else if (tNorm.includes('CABINET')) {
                const id = item_options.cabinet_color ?? material.cabinet_color ?? material.color ?? material.door_color;
                const name = item_options.cabinet_color_name ?? getCabinetColorName(id);
                if (name) item_options.cabinet_color_name = name;
                // Resolve body material first (authoritative for body)
                const bodyMatIdCandidates = [
                  item_options.body_material_id,
                  material.cabinet_body_material,
                  material.cabinet_body_material_id,
                  material.body_material_id,
                  material.body_material,
                ];
                const bodyMatNameCandidates = [
                  item_options.body_material_name,
                  material.body_material_name,
                ];
                let bodyMatId = bodyMatIdCandidates.find((v) => v !== undefined && v !== null && v !== '');
                let bodyMatName = bodyMatNameCandidates.find((v) => v !== undefined && v !== null && v !== '');
                if (!bodyMatName && bodyMatId !== undefined && bodyMatId !== null && bodyMatId !== '') {
                  const matName = getBodyMaterialName(bodyMatId as any);
                  if (matName) bodyMatName = matName;
                }
                if (bodyMatName) item_options.body_material_name = String(bodyMatName);
                if (bodyMatId && !item_options.body_material_id) item_options.body_material_id = bodyMatId;

                // Resolve body color with broader candidates (fallback when color ID is used)
                const bodyIdCandidates = [
                  item_options.body_color,
                  material.body_color,
                  material.bodyColor,
                  material.body_finish_color,
                  material.body_finish_color_id,
                  material.finish_color,
                  material.body_material_id,
                  material.body_color_id,
                ];
                const bodyNameCandidates = [
                  item_options.body_color_name,
                  material.body_color_name,
                  material.body_color_label,
                  material.body_material_name,
                  material.body_name,
                  material.body_label,
                ];
                let bodyId = bodyIdCandidates.find((v) => v !== undefined && v !== null && v !== '');
                let bodyName = bodyNameCandidates.find((v) => v !== undefined && v !== null && v !== '');
                // First, try body material lookup (most authoritative for body)
                if (!bodyName && bodyId !== undefined && bodyId !== null && bodyId !== '') {
                  const materialName = getBodyMaterialName(bodyId as any);
                  if (materialName) bodyName = materialName;
                }
                // Fallback to finish color list when bodyId maps to finish color ID
                if (!bodyName && bodyId !== undefined && bodyId !== null && bodyId !== '') {
                  const inferred = getFinishColorName(bodyId as any);
                  if (inferred) bodyName = inferred;
                }
                if (bodyName) item_options.body_color_name = String(bodyName);
                // Also populate body_material_name when coming from body material list
                const bodyMaterialName = getBodyMaterialName(bodyId as any);
                if (!bodyMatName && bodyMaterialName) item_options.body_material_name = bodyMaterialName;
                if (bodyId && !item_options.body_color) item_options.body_color = bodyId;
                // Debug assist
                dbg('cabinet-body-debug', {
                  idx,
                  order_id: it.order_id,
                  item_detail: it.item_detail,
                  bodyMatId,
                  bodyMatName,
                  chosenBodyId: bodyId,
                  chosenBodyName: bodyName,
                });
              }
            }
            const hasOptions = !!item_options && Object.keys(item_options).length > 0;
            results[idx] = { ...it, item_options: hasOptions ? item_options : null };
            const mappedKeys = hasOptions ? Object.keys(item_options!) : [];
            if (hasOptions) {
              dbg('item-mapped', { ...itemInfo, table, mappedKeys });
              enrichedCount++;
            } else {
              dbg('item-map-empty', { ...itemInfo, table, materialSample: Object.fromEntries(Object.entries(material || {}).slice(0, 8)) });
              skippedCount++;
            }
          } catch (e) {
            console.warn('orders-google: material enrich exception', e);
            results[idx] = it;
            skippedCount++;
            dbg('material-enrich-exception', { idx, error: String(e) });
          }
        })
      );
      return results;
    })();

    // 3) Apps Script Payload 생성 (공유 유틸)
  const payload = buildAppsScriptPayload(order, items || []);
    console.log("orders-google: posting payload", {
      orderId,
      itemsCount: (items || []).length,
      hasDelivery: !!payload?.order_options?.delivery,
    });
    dbg('enrich-summary', { enrichedCount, skippedCount, itemsCount: (items || []).length });

    // Debug / preview 모드: Apps Script 호출 전에 payload를 그대로 반환
    if (debug) {
      console.warn('orders-google: debug mode active – skipping Apps Script call');
      return jsonResponse({
        ok: true,
        debug: true,
        note: 'Skipped Apps Script call (debug mode) – payload preview only',
        itemsCount: (items || []).length,
        payload,
        logs: debugLogs,
      });
    }

    // 4) Google Apps Script Web App 호출
    let appsScriptStatus = 0;
    let appsScriptBodyText = "";
    try {
      const resp = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      appsScriptStatus = resp.status;
      appsScriptBodyText = await resp.text().catch(() => "");
      if (!resp.ok) {
        console.error("orders-google: AppsScript non-OK", appsScriptStatus, appsScriptBodyText?.slice(0, 500));
        return jsonResponse(
          {
            ok: false,
            stage: "apps_script",
            status: appsScriptStatus,
            body: appsScriptBodyText,
            error: `AppsScript error ${appsScriptStatus}`,
          },
          { status: 502 }
        );
      }
    } catch (fetchErr) {
      console.error("orders-google: AppsScript fetch exception", fetchErr);
      return jsonResponse(
        { ok: false, stage: "apps_script_fetch", error: String(fetchErr) },
        { status: 502 }
      );
    }

    // Attempt to parse JSON if Apps Script later returns JSON version; fallback
    let sheetId: string | undefined = undefined;
    try {
      if (appsScriptBodyText && appsScriptBodyText.trim().startsWith("{")) {
        const parsed = JSON.parse(appsScriptBodyText);
        sheetId = parsed.sheetId;
      }
    } catch (_) {}

  return jsonResponse({ ok: true, sheetId, appsScriptStatus, ...(returnPayload ? { payload, logs: debugLogs } : {}) });
  } catch (e) {
    console.error("orders-google: unexpected error", e);
    return jsonResponse({ ok: false, error: String(e) }, { status: 500 });
  }
});

/* Local invoke (optional):

1) Run `supabase start` or `supabase functions serve orders-google --no-verify-jwt`
2) POST request example:

curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/orders-google' \
  --header 'Content-Type: application/json' \
  --data '{"orderId":"<test-order-id>"}'
*/
