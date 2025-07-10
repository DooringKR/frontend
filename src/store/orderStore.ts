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

type ReceiveMethod = "delivery" | "pickup" | null;

interface PickupInfo {
  vehicleType: string; // "승용차", "트럭", "기타"
  customVehicleNote: string; // 기타 설명 직접 입력
}

interface OrderStore {
  address: Address;
  recipientPhoneNumber: string;
  requestMessage: string;
  customerRequest: string;
  foyerAccessType: FoyerAccessType;
  deliveryDate: string | null;
  receiveMethod: ReceiveMethod;
  pickupInfo: PickupInfo;

  setAddress: (addr: Address) => void;
  setRecipientPhoneNumber: (phone: string) => void;
  setRequestMessage: (message: string) => void;
  setCustomerRequest: (message: string) => void;
  setFoyerAccessType: (data: FoyerAccessType) => void;
  setDeliveryDate: (date: string | null) => void;
  setReceiveMethod: (method: ReceiveMethod) => void;
  setPickupInfo: (info: PickupInfo) => void;
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
  receiveMethod: null,
  pickupInfo: {
    vehicleType: "",
    customVehicleNote: "",
  },

  setAddress: address => set({ address }),
  setRecipientPhoneNumber: phone => set({ recipientPhoneNumber: phone }),
  setRequestMessage: message => set({ requestMessage: message }),
  setCustomerRequest: message => set({ customerRequest: message }),
  setFoyerAccessType: data => set({ foyerAccessType: data }),
  setDeliveryDate: date => set({ deliveryDate: date }),
  setReceiveMethod: method => set({ receiveMethod: method }),
  setPickupInfo: info => set({ pickupInfo: info }),
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
      receiveMethod: null,
      pickupInfo: {
        vehicleType: "",
        customVehicleNote: "",
      },
    }),
}));
