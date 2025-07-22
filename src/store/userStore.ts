import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  id: number | null;
  userType: "company" | "factory" | null;
  user_phoneNumber: string | null;
  cart_id: number | null;
  setUserId: (id: number) => void;
  setUserType: (userType: "company" | "factory") => void;
  setUserPhoneNumber: (phone: string) => void;
  setCartId: (cartId: number) => void;
  resetUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: null,
      userType: null,
      user_phoneNumber: null,
      cart_id: null,
      setUserId: (id) => set({ id }),
      setUserType: (userType) => set({ userType }),
      setUserPhoneNumber: (phone) => set({ user_phoneNumber: phone }),
      setCartId: (cartId) => set({ cart_id: cartId }),
      resetUser: () =>
        set({
          id: null,
          userType: null,
          user_phoneNumber: null,
          cart_id: null,
        }),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
