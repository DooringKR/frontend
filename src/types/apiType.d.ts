// auth type

export type User = {
  id: number;
  userType: "company" | "factory";
  phoneNumber: string;
};

export type SignupUser = Pick<User, "userType" | "phoneNumber"> 

export type SigninUser = Pick<User, "phoneNumber"> 



// door type

export type Hinge = {
  hingeCount: number;
  hingePosition: "left" | "right";
  topHinge: number;
  bottomHinge: number;
  middleHinge?: number | null;
  middleTopHinge?: number | null;
  middleBottomHinge?: number | null;
};

export type DoorRequest = {
  category: "door";
  slug: "normal" | "flap" | "drawer" ;
  color: string;
  width: number;
  height: number;
  hinge: Hinge;
  doorRequest: string;
};

export type DoorResponse = DoorRequest & {
  price: number;
};



// finish type

export type FinishRequest = {
  category: "finish";
  color: string;
  depth: {
    baseDepth: number;
    additionalDepth: number | null;
  };
  height: {
    baseHeight: number;
    additionalHeight: number | null;
  };
  finishRequest: string;
};

export type FinishResponse = FinishRequest & {
  price: number;
};



// cabinet type

export type CabinetRequest = {
  category: "cabinet";
  slug: "lower" | "upper" | "open" | "flap";
  color: string;
  handleType: "channel" | "outer" | "pull-down";
  compartmentCount: number | null;
  flapStayType: string | null;
  material: string;
  thickness: string;
  width: number;
  height: number;
  depth: number;
  option: string[];
  finishType: "makura" | "urahome";
  drawerType: string | null;
  railType: string | null;
  cabinetRequests: string;
};

export type CabinetResponse = CabinetRequest & {
  price: number;
};



// accessory type

export type AccessoryRequest = {
  category: "accessory";
  slug: "sinkBowl" | "hood" | "cooktop";
  madeBy: string;
  model: string;
  accessoryRequests: string;
};

export type AccessoryResponse = AccessoryRequest & {
  price: number;
};



// hardware type

export type HardwareRequest = {
  category: "hardware";
  slug: "hinge" | "rail" | "screw";
  madeBy: string;
  model: string;
  hardwareRequests: string;
};

export type HardwareResponse = HardwareRequest & {
  price: number;
};



//order type

export type CartItem =
  | (DoorRequest & { count: number; price: number })
  | (FinishRequest & { count: number; price: number })
  | (CabinetRequest & { count: number; price: number })
  | (AccessoryRequest & { count: number; price: number })
  | (HardwareRequest & { count: number; price: number });


export type OrderRequest = {
  id: number;
  user: User;
  phoneNumber: string;
  address1: string;
  address2: string;
  foyerAccessType: {
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  };
  deliveryDate: string; // ISO8601
  deliveryRequest: string;
  otherRequests: string;
  description: string;
  cartItems: CartItem[];
  totalPrice: number;
};

export type OrderResponse = {
  success: boolean;
  orderId: number;
  totalPrice: number;
  itemCount: number;
  estimatedDeliveryDate: string;
  message: string;
}