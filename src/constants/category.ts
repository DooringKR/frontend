import { AccessoryType, DoorType, FinishType, HardwareType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

type Category = {
  type?: FinishType | AccessoryType | HardwareType | DoorType | DetailProductType;
  name?: string;
  image: string;
  slug: string;
  header?: string;
};

export const CATEGORY_LIST: Category[] = [
  { name: "문짝", image: "/img/Checker.png", slug: "door" },
  { name: "마감재", image: "/img/Checker.png", slug: "finish" },
  { name: "부분장", image: "/img/Checker.png", slug: "cabinet" },
  { name: "부속", image: "/img/Checker.png", slug: "accessory" },
  { name: "하드웨어", image: "/img/Checker.png", slug: "hardware" },
]


export const DOOR_CATEGORY_LIST: Category[] = [
  { type: DoorType.STANDARD, image: "/img/door-category/Door.png", slug: "standard" },
  { type: DoorType.FLAP, image: "/img/door-category/FlapDoor.png", slug: "flap" },
  { type: DoorType.DRAWER, image: "/img/door-category/Drawer.png", slug: "drawer" },
];

export const ACCESSORY_CATEGORY_LIST: Category[] = [
  { type: AccessoryType.SINK, image: "/img/accessory-category/sinkbowl.png", slug: "sinkbowl" },
  { type: AccessoryType.COOKTOP, image: "/img/accessory-category/cooktop.png", slug: "cooktop" },
  { type: AccessoryType.HOOD, image: "/img/accessory-category/hood.png", slug: "hood" },
]

export const HARDWARE_CATEGORY_LIST: Category[] = [
  { type: HardwareType.HINGE, image: "/img/hardware-category/hinge.png", slug: "hinge" },
  { type: HardwareType.RAIL, image: "/img/hardware-category/rail.png", slug: "rail" },
  { type: HardwareType.PIECE, image: "/img/hardware-category/bolt.png", slug: "piece" },
]

export const CABINET_CATEGORY_LIST: Category[] = [
  { type: DetailProductType.LOWERCABINET, image: "/img/cabinet-category/Lower.png", slug: "lower" },
  { type: DetailProductType.UPPERCABINET, image: "/img/cabinet-category/Upper.png", slug: "upper" },
  { type: DetailProductType.DRAWERCABINET, image: "/img/cabinet-category/Drawers.png", slug: "drawer" },
  { type: DetailProductType.FLAPCABINET, image: "/img/cabinet-category/Flap.png", slug: "flap" },
  { type: DetailProductType.TALLCABINET, image: "/img/cabinet-category/Tall.png", slug: "tall" },
  { type: DetailProductType.OPENCABINET, image: "/img/cabinet-category/Open.png", slug: "open" },
]

export const FINISH_CATEGORY_LIST: Category[] = [
  { type: FinishType.EP, image: "/img/finish-category/EP.png", slug: "ep" },
  { type: FinishType.MOLDING, image: "/img/finish-category/Molding.png", slug: "molding" },
  { type: FinishType.GALLE, image: "/img/finish-category/Galle.png", slug: "galle" },
]