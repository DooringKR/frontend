/**
 * 상황 주문 입력값 — 화면을 옮겨 다녀도 남게 탭(sessionStorage)에 둔다.
 * 사진(File)은 저장할 수 없어서 메모리(photos)에만 둔다 — 새로고침하면 사진만 다시 골라야 한다.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SituationSlug } from "./situations";

export interface PartInput {
  buttons: string[];
  amountNote: string;
  memo: string;
}

export interface ReceiveInput {
  method: "delivery" | "pickup";
  /** 배송: 구 바로가구 DeliveryMethod 이름 그대로 */
  deliveryMethod?: string;
  deliveryMethodInput?: string;
  /** 배송·픽업 희망 날짜(YYYY-MM-DD) */
  date?: string;
  /** 픽업: 구 바로가구 VehicleType 이름 그대로 */
  vehicle?: string;
  vehicleInput?: string;
}

export interface RequestState {
  urgent: boolean;
  /** 고른 상황(둘째 묶음), 고른 차례 상관없이 SITUATIONS 차례로 진행 */
  situations: SituationSlug[];
  parts: Partial<Record<SituationSlug, PartInput>>;
  installNeeded: boolean | null;
  roadAddress: string;
  detailAddress: string;
  lat: number | null;
  lon: number | null;
  pyeong: string;
  parking: "가능" | "불가" | "유료" | null;
  elevator: boolean | null;
  travelMinutes: number | null;
  contactName: string;
  contactPhone: string;
  callTime: string;
  accessInfo: string;
  preferredDate: string;
  receive: ReceiveInput | null;
  requestNote: string;
  /** 이미 올린 사진 경로 — 주문 직전 로그인하러 다녀오면 메모리의 사진이 사라져서, 떠나기 전에 올려 둔다 */
  photoPaths: Partial<Record<SituationSlug, string[]>>;
  set: (patch: Partial<RequestState>) => void;
  setPart: (slug: SituationSlug, patch: Partial<PartInput>) => void;
  reset: () => void;
}

const EMPTY = {
  urgent: false,
  situations: [] as SituationSlug[],
  parts: {},
  installNeeded: null,
  roadAddress: "",
  detailAddress: "",
  lat: null,
  lon: null,
  pyeong: "",
  parking: null,
  elevator: null,
  travelMinutes: null,
  contactName: "",
  contactPhone: "",
  callTime: "",
  accessInfo: "",
  preferredDate: "",
  receive: null,
  requestNote: "",
  photoPaths: {},
};

export const useRequestStore = create<RequestState>()(
  persist(
    (set) => ({
      ...EMPTY,
      set: (patch) => set(patch),
      setPart: (slug, patch) =>
        set((s) => ({
          parts: { ...s.parts, [slug]: { buttons: [], amountNote: "", memo: "", ...s.parts[slug], ...patch } },
        })),
      reset: () => {
        photoStore.clear();
        set(EMPTY);
      },
    }),
    { name: "situation-request", storage: createJSONStorage(() => sessionStorage) },
  ),
);

/** 상황별 사진 — 메모리에만 */
export const photoStore = new Map<SituationSlug, File[]>();

export const emptyPart = (): PartInput => ({ buttons: [], amountNote: "", memo: "" });
