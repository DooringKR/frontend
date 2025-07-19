export type AccessoryItem = {
  category: "accessory";
  slug: "sink_bowl" | "hood" | "cooktop" | null;
  madeBy: string;
  model: string;
  accessoryRequest: string | null; // 단수형으로 수정 (request)
  count: number | null;
  price: number | null;
  cartItemId?: number;
};

export type CabinetItem = {
  category: "cabinet";
  slug: "lower" | "upper" | "open" | "flap" | "drawer" | null;
  color: string;
  width: number | null;
  height: number | null;
  depth: number | null;
  cabinetRequests: string | null;
  handleType: "channel" | "outer" | "pull-down" | null;

  // 조건부 필드들 포함
  finishType: "makura" | "urahome" | null;
  bodyType: string | null;
  bodyTypeDirectInput: string | null;

  absorberType: string | null;
  absorberTypeDirectInput: string | null;

  drawerType: string | null;
  railType: string | null;

  addRiceCookerRail: boolean | null;
  addBottomDrawer: boolean | null;

  // 기존 유지
  count: number | null;
  price: number | null;
  cartItemId?: number;

  // 직접 입력 속성들
  compartmentCount: number | null;
  flapStayType: string | null;
  material: string;
  thickness: string;
  option: string[];
};

export type DoorSlug = "normal" | "flap" | "drawer";

export type DoorItem = {
  category: "door";
  slug: DoorSlug | null;
  color: string;
  width: number | null;
  height: number | null;
  hinge: {
    hingeCount: number | null;
    hingePosition: "left" | "right" | null;
    topHinge: number | null;
    bottomHinge: number | null;
    middleHinge: number | null;
    middleTopHinge: number | null;
    middleBottomHinge: number | null;
  };
  doorRequest: string | null;
  count: number | null;
  price: number | null;
  cartItemId?: number;
};

export type FinishItem = {
  category: "finish";
  color: string;
  baseDepth: number | null;
  additionalDepth: number | null;
  baseHeight: number | null;
  additionalHeight: number | null;
  finishRequest: string | null;
  count: number | null;
  price: number | null;
  cartItemId?: number;
};

export type HardwareItem = {
  category: "hardware";
  slug: "sink" | "cooktop" | "hood" | null; // ← ENUM에 맞춰 소문자로 맞춤
  madeBy: string;
  model: string;
  hardwareRequest: string | null;
  count: number | null;
  price: number | null;
  cartItemId?: number;
};
