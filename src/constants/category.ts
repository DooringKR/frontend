export type Category = {
  name: string;
  href: string;
};

export const CATEGORY_LIST: Category[] = [
  { name: "문짝", href: "/address-check?category=문짝" },
  { name: "마감재", href: "/address-check?category=마감재" },
  { name: "부분장", href: "/address-check?category=부분장" },
  { name: "부속", href: "/address-check?category=부속" },
  { name: "기타", href: "/address-check?category=기타" },
];