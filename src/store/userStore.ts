import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  id: number | null;
  userType: "company" | "factory" | null;
  user_phoneNumber: string | null;
  setUserId: (id: number) => void;
  setUserType: (userType: "company" | "factory") => void;
  setUserPhoneNumber: (phone: string) => void;
  resetUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: null,
      userType: null,
      user_phoneNumber: null,
      setUserId: (id) => set({ id }),
      setUserType: (userType) => set({ userType }),
      setUserPhoneNumber: (phone) => set({ user_phoneNumber: phone }),
      resetUser: () =>
        set({
          id: null,
          userType: null,
          user_phoneNumber: null,
        }),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
