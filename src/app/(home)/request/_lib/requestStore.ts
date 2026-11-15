/**
 * 상황 주문 입력값 — 기기(localStorage)에 7일 둔다(2026-11-13 QA). 다시 들어오면 화면 1이 「이어서 하기 / 새로 시작」을 묻는다.
 * 출입 정보(현관 비밀번호 등)는 기기에 남기지 않는다(partialize) — 새로고침하면 그 칸만 비어 있다.
 * 사진은 고르는 즉시 올리고 경로(photoPaths)만 둔다.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type SituationSlug, validButtons } from "./situations";

const KEEP_MS = 7 * 24 * 3600_000;

export interface PartInput {
  buttons: string[];
  /** 필요한 가구 또는 상황 설명(옛 「대략적인 양」 칸 — DB amount_note·현장허브 「가구 규모 메모」, QA 「단계별 가구 종류 및 시나리오 수정」 2026-11-15) */
  amountNote: string;
  /** 옛 메모 칸(화면에서는 뺐다 — 남은 값만 보낸다) */
  memo: string;
  /** 품목 대신 「AS가 필요한 상황을 직접 입력할게요」 — 설명 글이 꼭 있어야 한다 */
  direct?: boolean;
  /** 경첩도 필요한가요(선택) — 문짝 교체 · 설치·가구 추가 */
  hinge?: boolean | null;
}

export interface ReceiveInput {
  method: "delivery" | "pickup";
  /** 배송: 구 바로가구 DeliveryMethod 이름 그대로 */
  deliveryMethod?: string;
  deliveryMethodInput?: string;
  /** 배송·픽업 희망 날짜(YYYY-MM-DD) */
  date?: string;
  /** 배송·픽업 희망 시간(HH:MM) — QA 「희망 도착 날짜에 시간도」(2026-11-15) */
  time?: string;
  /** 픽업: 구 바로가구 VehicleType 이름 그대로 */
  vehicle?: string;
  vehicleInput?: string;
}

export interface RequestState {
  urgent: boolean;
  /** 고른 상황(둘째 묶음), 고른 차례 상관없이 SITUATIONS 차례로 쌓는다 */
  situations: SituationSlug[];
  parts: Partial<Record<SituationSlug, PartInput>>;
  installNeeded: boolean | null;
  roadAddress: string;
  detailAddress: string;
  lat: number | null;
  lon: number | null;
  /** 현장허브 「건물 종류」 선택지 그대로 — 허브 「주소·출입정보」 완료 조건이라 받는다 */
  buildingType: string | null;
  pyeong: string;
  /** 주차·엘리베이터는 시공이 필요할 때만 묻는다 */
  parking: "가능" | "불가" | "유료" | null;
  elevator: boolean | null;
  travelMinutes: number | null;
  /** 수령인 — 어드민이 현장허브 「수령인 성함·수령인 연락처」로 옮긴다 */
  contactName: string;
  contactPhone: string;
  callTime: string;
  accessInfo: string;
  preferredDate: string;
  /** 바로배송이면 희망 시공 시간 'HH:MM'(30분 단위, 바로가구 QA 2026-11-15) */
  preferredTime: string;
  receive: ReceiveInput | null;
  requestNote: string;
  /** 올린 사진 경로(customer-input-image 버킷 안) */
  photoPaths: Partial<Record<SituationSlug, string[]>>;
  /** 마지막으로 고친 때 — 7일 지나면 비운다 */
  savedAt: number | null;
  /** 마지막으로 연 화면 — 「이어서 하기」가 여기로 간다 */
  lastPath: string;
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
  buildingType: null,
  pyeong: "",
  parking: null,
  elevator: null,
  travelMinutes: null,
  contactName: "",
  contactPhone: "",
  callTime: "",
  accessInfo: "",
  preferredDate: "",
  preferredTime: "",
  receive: null,
  requestNote: "",
  photoPaths: {},
  savedAt: null,
  lastPath: "/request",
};

export const useRequestStore = create<RequestState>()(
  persist(
    (set) => ({
      ...EMPTY,
      set: (patch) => set({ ...patch, savedAt: Date.now() }),
      setPart: (slug, patch) =>
        set((s) => ({
          parts: { ...s.parts, [slug]: { ...emptyPart(), ...s.parts[slug], ...patch } },
          savedAt: Date.now(),
        })),
      reset: () => set(EMPTY),
    }),
    {
      name: "situation-request",
      storage: createJSONStorage(() => localStorage),
      // 서버가 그린 빈 화면과 첫 화면을 맞추려고 읽기를 미룬다 — request/layout 이 화면을 그린 뒤 읽는다
      skipHydration: true,
      partialize: ({ accessInfo: _skip, ...rest }) => rest,
      // 품목정리(2026-11-15)로 바뀐 옛 품목 이름은 읽어 올 때 버린다 — 안 보이는 품목이 골라진 채 「끝난 장」으로 세지지 않게
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<RequestState>;
        const parts = Object.fromEntries(
          Object.entries(p.parts ?? {}).map(([slug, part]) => [slug, part && { ...part, buttons: validButtons(slug as SituationSlug, part.buttons ?? []) }]),
        );
        return { ...current, ...p, parts };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.savedAt && Date.now() - state.savedAt > KEEP_MS) state.reset();
      },
    },
  ),
);

/** 이어서 할 만한 입력이 있는지 */
export const hasDraft = (s: RequestState) => s.savedAt != null && (s.situations.length > 0 || s.urgent);

export const emptyPart = (): PartInput => ({ buttons: [], amountNote: "", memo: "" });
