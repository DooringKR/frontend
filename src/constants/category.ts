type Category = {
  name: string;
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
  { name: "일반문 (여닫이)", image: "/img/door-category/Door.png", slug: "normal", header: "일반문" },
  { name: "플랩문 (위로 열림)", image: "/img/door-category/FlapDoor.png", slug: "flap", header: "플랩문" },
  { name: "서랍 마에다", image: "/img/door-category/Drawer.png", slug: "drawer", header: "서랍문" },
];

export const ACCESSORY_CATEGORY_LIST: Category[] = [
  { name: "싱크볼", image: "/img/accessory-category/sinkbowl.png", slug: "sinkbowl", header: "싱크볼" },
  { name: "쿡탑", image: "/img/accessory-category/cooktop.png", slug: "cooktop", header: "쿡탑" },
  { name: "후드", image: "/img/accessory-category/hood.png", slug: "hood", header: "후드" },
]

export const HARDWARE_CATEGORY_LIST: Category[] = [
  { name: "경첩", image: "/img/hardware-category/hinge.png", slug: "hinge", header: "경첩" },
  { name: "레일", image: "/img/hardware-category/rail.png", slug: "rail", header: "레일" },
  { name: "피스", image: "/img/hardware-category/bolt.png", slug: "bolt", header: "피스" },
]

export const CABINET_CATEGORY_LIST: Category[] = [
  { name: "상부장", image: "/img/cabinet-category/Upper.png", slug: "upper", header: "상부장" },
  { name: "하부장", image: "/img/cabinet-category/Lower.png", slug: "lower", header: "하부장" },
  { name: "플랩장", image: "/img/cabinet-category/Flap.png", slug: "flap", header: "플랩장" },
  { name: "서랍장", image: "/img/cabinet-category/Drawers.png", slug: "drawer", header: "서랍장" },
  { name: "오픈장", image: "/img/cabinet-category/Open.png", slug: "open", header: "오픈장" },
]