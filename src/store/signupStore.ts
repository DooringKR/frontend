// src/store/signupStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";

interface SignupStore {
    businessType: BusinessType | null;
    setBusinessType: (businessType: BusinessType) => void;
    resetBusinessType: () => void;
}

const useSignupStore = create<SignupStore>()(
    persist(
        (set) => ({
            businessType: null,
            setBusinessType: (businessType) => set({ businessType }),
            resetBusinessType: () => set({ businessType: null }),
        }),
        {
            name: "signupData",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSignupStore;
