// store/orderStore.ts
import { create } from "zustand";

interface FoyerAccessType {
  type: "gate" | "call" | "doorfront" | "custom";
  gatePassword: string | null;
  customRequest: string | null;
}

interface Address {
  address1: string;
  address2: string;
}

interface OrderStore {
  address: Address;
  recipientPhoneNumber: string;
  requestMessage: string;
  customerRequest: string;
  foyerAccessType: FoyerAccessType;
  deliveryDate: string | null;

  setAddress: (addr: Address) => void;
  setRecipientPhoneNumber: (phone: string) => void;
  setRequestMessage: (message: string) => void;
  setCustomerRequest: (message: string) => void;
  setFoyerAccessType: (data: FoyerAccessType) => void;
  setDeliveryDate: (date: string | null) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>(set => ({
  address: { address1: "", address2: "" },
  recipientPhoneNumber: "",
  requestMessage: "",
  customerRequest: "",
  foyerAccessType: {
    type: "call",
    gatePassword: null,
    customRequest: null,
  },
  deliveryDate: null,

  setAddress: address => set({ address }),
  setRecipientPhoneNumber: phone => set({ recipientPhoneNumber: phone }),
  setRequestMessage: message => set({ requestMessage: message }),
  setCustomerRequest: message => set({ customerRequest: message }),
  setFoyerAccessType: data => set({ foyerAccessType: data }),
  setDeliveryDate: date => set({ deliveryDate: date }),
  clearOrder: () =>
    set({
      address: { address1: "", address2: "" },
      recipientPhoneNumber: "",
      requestMessage: "",
      customerRequest: "",
      foyerAccessType: {
        type: "call",
        gatePassword: null,
        customRequest: null,
      },
      deliveryDate: null,
    }),
}));
