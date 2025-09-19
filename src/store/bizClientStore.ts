// src/store/bizClientStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";

interface BizClientStore {
    // BizClient 객체
    bizClient: BizClient | null;

    // 로딩 상태
    isLoading: boolean;

    // 에러 상태
    error: string | null;

    // Actions
    setBizClient: (bizClient: BizClient) => void;
    updateBizClient: (updates: Partial<BizClient>) => void;
    clearBizClient: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // 편의 메서드들
    getBizClientId: () => string | null;
    getBusinessType: () => BusinessType | null;
    getNickName: () => string | null;
    getPhoneNumber: () => string | null;
    isAuthenticated: () => boolean;
}

const useBizClientStore = create<BizClientStore>()(
    persist(
        (set, get) => ({
            // 초기 상태
            bizClient: null,
            isLoading: false,
            error: null,

            // Actions
            setBizClient: (bizClient) =>
                set({
                    bizClient,
                    error: null
                }),

            updateBizClient: (updates) =>
                set((state) => {
                    if (!state.bizClient) {
                        return { bizClient: null, error: null };
                    }

                    // 기존 bizClient와 업데이트를 병합
                    const updatedBizClient = {
                        ...state.bizClient,
                        ...updates
                    } as BizClient;

                    return {
                        bizClient: updatedBizClient,
                        error: null
                    };
                }),

            clearBizClient: () =>
                set({
                    bizClient: null,
                    error: null
                }),

            setLoading: (loading) =>
                set({ isLoading: loading }),

            setError: (error) =>
                set({ error }),

            // 편의 메서드들
            getBizClientId: () => {
                const state = get();
                return state.bizClient?.id || null;
            },

            getBusinessType: () => {
                const state = get();
                return state.bizClient?.business_type || null;
            },

            getNickName: () => {
                const state = get();
                return state.bizClient?.nick_name || null;
            },

            getPhoneNumber: () => {
                const state = get();
                return state.bizClient?.phone_number || null;
            },

            isAuthenticated: () => {
                const state = get();
                return !!state.bizClient;
            },
        }),
        {
            name: "bizClientData",
            storage: createJSONStorage(() => localStorage),
            // 민감한 정보는 제외하고 저장
            partialize: (state) => ({
                bizClient: state.bizClient,
                // isLoading, error는 저장하지 않음
            }),
        }
    )
);

export default useBizClientStore;
