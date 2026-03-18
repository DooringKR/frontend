import { LongDoorColorTier } from "./types";

export const LONG_DOOR_CONSTRUCT_PRICE = 300_000;

export const LONG_DOOR_HINGE_SURCHARGE_PER_ONE = 10_000;

export const LONG_DOOR_PREMIUM_COLORS = [
  "한솔테네시월넛",
  "한솔베이내츄럴오크",
  "한솔내츄럴크랙오크",
  "한솔칼프브라운우드",
  "한솔콘크리트샌드",
  "한솔콘크리트화이트",
] as const;

export const LONG_DOOR_STANDARD_COLORS = [
  "한솔크림화이트",
  "한솔퍼펙트화이트",
  "한솔새틴베이지",
  "한솔코튼블루",
  "한솔도브화이트",
  "한솔포그그레이",
  "한솔샌드그레이",
  "동화밀크화이트",
  "동화카본그레이",
] as const;

export const LONG_DOOR_GLASS_COLORS = ["유리문", "거울문"] as const;

export const LONG_DOOR_UNIT_PRICE_TABLE: Record<LongDoorColorTier, [number, number, number]> = {
  film: [9, 11, 13],
  special: [12, 14, 16],
  signature: [16, 18, 20],
  other: [16, 18, 20],
  glass: [25, 25, 25],
};
