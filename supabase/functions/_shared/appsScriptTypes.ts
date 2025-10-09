// @ts-nocheck
// Minimal types for Apps Script payload expected by Code.gs
// Use DDD enums from dooring-core-domain for stronger typing (type-only import)
import type { DetailProductType } from "npm:dooring-core-domain@1.0.20/dist/enums/CartAndOrderEnums";

export type DeliveryType = "DELIVERY" | "PICK_UP" | string; // Keep loose here; mapped from domain order_type

export type AppsScriptOrderItem = {
  product_type: DetailProductType;
  item_count: number;
  unit_price: number;
  item_options: unknown;
  image_url?: string | null;
};

export type AppsScriptOrderPayload = {
  created_at: string;
  order_id: string;
  order_number?: string;
  delivery_type?: DeliveryType;
  recipient_name?: string;
  recipient_phone?: string;
  address1?: string;
  address2?: string;
  memo?: string;
  order_options?: unknown;
  order_items: AppsScriptOrderItem[];
};
