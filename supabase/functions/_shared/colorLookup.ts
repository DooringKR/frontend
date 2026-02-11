// Simple color id->name lookup used by Edge Function
// Keep in sync with dooring-core-domain/dist/constants/color

type ColorItem = { id: number; name: string };

const DOOR_COLOR_LIST: ColorItem[] = [
  { id: 1, name: "MDF, 한솔, 18T, 크림화이트" },
  { id: 2, name: "MDF, 한솔, 18T, 퍼펙트화이트" },
  { id: 3, name: "MDF, 한솔, 18T, 새틴베이지" },
  { id: 4, name: "MDF, 한솔, 18T, 코튼블루" },
  { id: 5, name: "MDF, 한솔, 18T, 도브화이트" },
  { id: 6, name: "MDF, 한솔, 18T, 포그그레이" },
  { id: 7, name: "MDF, 한솔, 18T, 샌드그레이" },
  { id: 8, name: "MDF, 한솔, 18T, 테네시월넛" },
  { id: 9, name: "MDF, 한솔, 18T, 베이내츄럴오크" },
  { id: 10, name: "MDF, 한솔, 18T, 내츄럴크랙오크" },
  { id: 11, name: "MDF, 한솔, 18T, 칼프브라운" },
  { id: 12, name: "MDF, 한솔, 18T, 콘크리트샌드" },
  { id: 13, name: "MDF, 한솔, 18T, 콘크리트화이트" },
  { id: 14, name: "MDF, 동화, 18T, 밀크화이트" },
  { id: 15, name: "MDF, 동화, 18T, 카본그레이" },
  { id: 16, name: "MDF,, 18T, 필름 부착용 합판 (색깔 상관X)" },
];

const CABINET_COLOR_LIST: ColorItem[] = [
  { id: 1, name: "MDF, 한솔, 18T, 크림화이트" },
  { id: 2, name: "MDF, 한솔, 18T, 퍼펙트화이트" },
  { id: 3, name: "MDF, 한솔, 18T, 새틴베이지" },
  { id: 4, name: "MDF, 한솔, 18T, 코튼블루" },
  { id: 5, name: "MDF, 한솔, 18T, 도브화이트" },
  { id: 6, name: "MDF, 한솔, 18T, 포그그레이" },
  { id: 7, name: "MDF, 한솔, 18T, 샌드그레이" },
  { id: 8, name: "MDF, 한솔, 18T, 테네시월넛" },
  { id: 9, name: "MDF, 한솔, 18T, 베이내츄럴오크" },
  { id: 10, name: "MDF, 한솔, 18T, 내츄럴크랙오크" },
  { id: 11, name: "MDF, 한솔, 18T, 칼프브라운" },
  { id: 12, name: "MDF, 한솔, 18T, 콘크리트샌드" },
  { id: 13, name: "MDF, 한솔, 18T, 콘크리트화이트" },
  { id: 14, name: "MDF, 동화, 18T, 밀크화이트" },
  { id: 15, name: "MDF, 동화, 18T, 카본그레이" },
  { id: 16, name: "MDF,, 18T, 필름 부착용 합판 (색깔 상관X)" }
];

const FINISH_COLOR_LIST: ColorItem[] = [
  { id: 1, name: "MDF, 한솔, 18T, 크림화이트" },
  { id: 2, name: "MDF, 한솔, 18T, 퍼펙트화이트" },
  { id: 3, name: "MDF, 한솔, 18T, 새틴베이지" },
  { id: 4, name: "MDF, 한솔, 18T, 코튼블루" },
  { id: 5, name: "MDF, 한솔, 18T, 도브화이트" },
  { id: 6, name: "MDF, 한솔, 18T, 포그그레이" },
  { id: 7, name: "MDF, 한솔, 18T, 샌드그레이" },
  { id: 8, name: "MDF, 한솔, 18T, 테네시월넛" },
  { id: 9, name: "MDF, 한솔, 18T, 베이내츄럴오크" },
  { id: 10, name: "MDF, 한솔, 18T, 내츄럴크랙오크" },
  { id: 11, name: "MDF, 한솔, 18T, 칼프브라운" },
  { id: 12, name: "MDF, 한솔, 18T, 콘크리트샌드" },
  { id: 13, name: "MDF, 한솔, 18T, 콘크리트화이트" },
  { id: 14, name: "MDF, 동화, 18T, 밀크화이트" },
  { id: 15, name: "MDF, 동화, 18T, 카본그레이" },
  { id: 20, name: "PB, 한솔, 18T, 파타고니아크림" },
  { id: 16, name: "PB,, 18T, 헤링본" },
  { id: 17, name: "PB,, 15T, 헤링본" },
  { id: 18, name: "PB, 동화, 3T 우라, 헤링본" },
  { id: 19, name: "PB,, 15T, 헤링본 - 미백색" },
  { id: 20, name: "MDF,, 18T, 필름 부착용 합판 (색깔 상관X)" },
];

function findName(list: ColorItem[], id: number | string | null | undefined): string | undefined {
  if (id === null || id === undefined) return undefined;
  const n = typeof id === 'number' ? id : parseInt(String(id), 10);
  if (Number.isNaN(n)) return undefined;
  const found = list.find((c) => c.id === n);
  return found?.name;
}

export function getDoorColorName(id: number | string | null | undefined): string | undefined {
  return findName(DOOR_COLOR_LIST, id);
}

export function getCabinetColorName(id: number | string | null | undefined): string | undefined {
  return findName(CABINET_COLOR_LIST, id);
}

export function getFinishColorName(id: number | string | null | undefined): string | undefined {
  return findName(FINISH_COLOR_LIST, id);
}
