export type DoorItem = {
  category: "door";
  doorType: string;
  color: string;
  width: string;
  height: string;
  hingeCount: number;
  hingeDirection: string;
  boring: (number | null)[];
  boringCategory?: string;
  count: number;
  price: number;
  cartItemId?: number;
};

export type AccessoryItem = {
  category: "accessory";
  accessoryType: string;
  manufacturer: string;
  modelName: string;
  size: string;
  count: number;
  price: number;
  cartItemId?: number;
  accessoryRequest?: string;
};

export type CabinetItem = {
  category: "cabinet";
  cabinetType: string;
  color: string;
  width: string;
  height: string;
  depth: string;
  bodyMaterial: string;
  handleType: string;
  finishType: string;
  showBar: string;
  drawerType: string;
  railType: string;
  riceRail?: string;
  lowerDrawer?: string;
  request?: string;
  count: number;
  price: number;
  cartItemId?: number;
};

export type FinishItem = {
  category: "finish";
  color: string;
  baseDepth: number;
  additionalDepth: number;
  baseHeight: number;
  additionalHeight: number;
  finishRequest: string;
  count: number;
  price: number;
  cartItemId?: number;
};

export type HardwareItem = {
  category: "hardware";
  hardwareType: string;
  madeBy: string;
  model: string;
  size: string;
  hardwareRequest: string | null;
  count: number;
  price: number;
  cartItemId?: number;
};
