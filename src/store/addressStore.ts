import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressState {
  address1: string;
  address2: string;
  setAddress: (address1: string, address2: string) => void;
  clearAddress: () => void;
}

const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address1: "",
      address2: "",
      setAddress: (address1, address2) => set({ address1, address2 }),
      clearAddress: () => set({ address1: "", address2: "" }),
    }),
    {
      name: "address-storage", // localStorage 키
    }
  )
);

export default useAddressStore;
