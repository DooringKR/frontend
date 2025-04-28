import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressState {
  selectedAddress: string;
  detailAddress: string;
  setAddress: (selectedAddress: string, detailAddress: string) => void;
  clearAddress: () => void;
}

const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      selectedAddress: "",
      detailAddress: "",
      setAddress: (selectedAddress, detailAddress) => set({ selectedAddress, detailAddress }),
      clearAddress: () => set({ selectedAddress: "", detailAddress: "" }),
    }),
    {
      name: "address-storage", // localStorage 키
    }
  )
);

export default useAddressStore;
