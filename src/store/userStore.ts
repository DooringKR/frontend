import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  userType: "company" | "factory" | null;
  user_phoneNumber: string | null; 
  setUserPhoneNumber: (userData: Partial<UserStore>) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userType: null,
      user_phoneNumber: null,
      setUserPhoneNumber: (userData) => set((state) => ({ ...state, ...userData })),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
