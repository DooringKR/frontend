// src/store/signupStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";

interface SignupStore {
    businessType: BusinessType | null;
    phoneNumber: string | null;
    setBusinessType: (businessType: BusinessType) => void;
    resetBusinessType: () => void;
    setPhoneNumber: (phoneNumber: string) => void;
    resetPhoneNumber: () => void;
}

const useSignupStore = create<SignupStore>()(
    persist(
        (set) => ({
            businessType: null,
            phoneNumber: null,
            setBusinessType: (businessType) => set({ businessType }),
            resetBusinessType: () => set({ businessType: null }),
            setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
            resetPhoneNumber: () => set({ phoneNumber: null }),
        }),
        {
            name: "signupData",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSignupStore;
