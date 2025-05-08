type Category = {
  name: string;
  image: string;
  slug: string;
  header?: string;
};

export const CATEGORY_LIST: Category[]  = [
  { name: "문짝", image: "/img/Checker.png", slug: "door" },
  { name: "마감재", image: "/img/Checker.png", slug: "finish" },
  { name: "부분장", image: "/img/Checker.png", slug: "cabinet" },
  { name: "부속", image: "/img/Checker.png", slug: "accessory" },
  { name: "하드웨어", image: "/img/Checker.png", slug: "hardware" },
]


export const DOOR_CATEGORY_LIST: Category[] = [
  { name: "일반문(여닫이)", image: "/img/Checker.png", slug: "normal", header: "일반문" },
  { name: "플랩문(위로 열림)", image: "/img/Checker.png", slug: "flap" ,header: "플랩문" },
  { name: "서랍 마에다", image: "/img/Checker.png", slug: "drawer", header:"서랍문" },
];

export const ACCESSORY_CATEGORY_LIST: Category[] = [
  { name: "싱크볼", image: "/img/Checker.png", slug: "sinkbowl", header: "싱크볼" },
  { name: "쿡탑", image: "/img/Checker.png", slug: "cooktop" ,header: "쿡탑" },
  { name: "후드", image: "/img/Checker.png", slug: "hood", header:"후드" },
]

export const HARDWARE_CATEGORY_LIST: Category[] = [
  { name: "경첩", image: "/img/Checker.png", slug: "hinge", header: "경첩" },
  { name: "레일", image: "/img/Checker.png", slug: "rail" ,header: "레일" },
  { name: "피스", image: "/img/Checker.png", slug: "bolt", header:"피스" },
]