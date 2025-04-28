import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  userType: "company" | "factory" | null;
  user_phoneNumber: string | null;
  setUserType: (userType: "company" | "factory") => void;
  setUserPhoneNumber: (phone: string) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userType: null,
      user_phoneNumber: null,
      setUserType: (userType) => set({ userType }),
      setUserPhoneNumber: (phone) => set({ user_phoneNumber: phone }),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
