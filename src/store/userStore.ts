import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  id: number | null;
  userType: "INTERIOR" | "FACTORY" | null;
  user_phoneNumber: string | null;
  cart_id: number | null;
  user_road_address: string | null;
  user_detail_address: string | null;
  setUserId: (id: number) => void;
  setUserType: (userType: "INTERIOR" | "FACTORY") => void;
  setUserPhoneNumber: (phone: string) => void;
  setCartId: (cartId: number) => void;
  setUserAddress: (road: string, detail: string) => void;
  resetUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    set => ({
      id: null,
      userType: null,
      user_phoneNumber: null,
      cart_id: null,
      user_road_address: null,
      user_detail_address: null,
      setUserId: id => set({ id }),
      setUserType: userType => set({ userType }),
      setUserPhoneNumber: phone => set({ user_phoneNumber: phone }),
      setCartId: cartId => set({ cart_id: cartId }),
      setUserAddress: (road, detail) =>
        set({ user_road_address: road, user_detail_address: detail }),
      resetUser: () =>
        set({
          id: null,
          userType: null,
          user_phoneNumber: null,
          cart_id: null,
          user_road_address: null,
          user_detail_address: null,
        }),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
