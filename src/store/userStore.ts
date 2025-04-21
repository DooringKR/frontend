import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  name: string | null;
  user_phoneNumber: number | null;
  setUser: (user: Partial<UserStore>) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    set => ({
      name: null,
      user_phoneNumber: null,
      setUser: user => set(state => ({ ...state, ...user })),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
