/**
 * 카트의 product_type과 detail_product_type을 중복 제거하고 정렬하는 유틸리티
 */

// product_type 순서 정의
const PRODUCT_TYPE_ORDER = ["문짝", "마감재", "부분장", "부속", "하드웨어"] as const;

// detail_product_type 순서 정의
const DETAIL_PRODUCT_TYPE_ORDER = [
  "일반문",
  "플랩문",
  "서랍 마에다",
  "EP마감",
  "몰딩",
  "걸레받이",
  "하부장",
  "상부장",
  "서랍장",
  "플랩장",
  "키큰장",
  "오픈장",
  "싱크볼",
  "쿡탑",
  "후드",
  "경첩",
  "레일 피스",
] as const;

/**
 * product_type 배열을 중복 제거하고 정렬
 * @param types - product_type 배열
 * @returns 중복 제거 및 정렬된 배열
 */
export function sortProductTypes(types: string[]): string[] {
  const uniqueTypes = Array.from(new Set(types));
  return uniqueTypes.sort((a, b) => {
    const indexA = PRODUCT_TYPE_ORDER.indexOf(a as any);
    const indexB = PRODUCT_TYPE_ORDER.indexOf(b as any);
    
    // 정의되지 않은 타입은 뒤로 보냄
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
}

/**
 * detail_product_type 배열을 중복 제거하고 정렬
 * @param types - detail_product_type 배열
 * @returns 중복 제거 및 정렬된 배열
 */
export function sortDetailProductTypes(types: string[]): string[] {
  const uniqueTypes = Array.from(new Set(types));
  return uniqueTypes.sort((a, b) => {
    const indexA = DETAIL_PRODUCT_TYPE_ORDER.indexOf(a as any);
    const indexB = DETAIL_PRODUCT_TYPE_ORDER.indexOf(b as any);
    
    // 정의되지 않은 타입은 뒤로 보냄
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
}
