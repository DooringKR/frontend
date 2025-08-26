import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FoyerAccessType {
  type: "gate" | "call" | "doorfront" | "custom";
  gatePassword: string | null;
  customRequest: string | null;
}

interface Address {
  address1: string;
  address2: string;
}

type ReceiveMethod = "DELIVERY" | "PICK_UP" | null;

interface PickupInfo {
  vehicleType: string;
  customVehicleNote: string;
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

  deliveryType: "today" | "tomorrow" | null;
  deliveryHour: string;
  deliveryMinute: string;

  setDeliveryType: (type: "today" | "tomorrow" | null) => void;
  setDeliveryHour: (hour: string) => void;
  setDeliveryMinute: (minute: string) => void;

  userSelectedDeliveryType: "today" | "tomorrow" | null;
  setUserSelectedDeliveryType: (type: "today" | "tomorrow") => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    set => ({
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
      receiveMethod: null, // 배송인지 픽업인지
      pickupInfo: {
        vehicleType: "",
        customVehicleNote: "",
      },

      deliveryType: null, // 배송인 경우 오늘배송 내일배송 인지
      deliveryHour: "--",
      deliveryMinute: "--",

      // setDeliveryType: type => set({ deliveryType: type }),
      setDeliveryType: type => {
        set({ deliveryType: type });

        // 👉 "today" 선택 시 시간 초기화
        if (type === "today") {
          set({
            deliveryHour: "--",
            deliveryMinute: "--",
          });
        }
      },
      setDeliveryHour: hour => set({ deliveryHour: hour }),
      setDeliveryMinute: minute => set({ deliveryMinute: minute }),

      setAddress: address => set({ address }),
      setRecipientPhoneNumber: phone => set({ recipientPhoneNumber: phone }),
      setRequestMessage: message => set({ requestMessage: message }),
      setCustomerRequest: message => set({ customerRequest: message }),
      setFoyerAccessType: data => set({ foyerAccessType: data }),
      setDeliveryDate: date => set({ deliveryDate: date }),
      // setReceiveMethod: method => set({ receiveMethod: method }),
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
          deliveryType: null,
          deliveryHour: "--",
          deliveryMinute: "--",
          receiveMethod: null,
          pickupInfo: {
            vehicleType: "",
            customVehicleNote: "",
          },
          userSelectedDeliveryType: null,
        }),

      setReceiveMethod: method => {
        set({ receiveMethod: method });

        if (method === "PICK_UP") {
          set({
            deliveryDate: null,
            deliveryType: null,
            deliveryHour: "--",
            deliveryMinute: "--",
          });
        }
      },

      userSelectedDeliveryType: null,
      setUserSelectedDeliveryType: type => set({ userSelectedDeliveryType: type }),
    }),

    {
      name: "order-storage",
    },
  ),
);
