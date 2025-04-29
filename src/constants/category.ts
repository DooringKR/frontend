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

