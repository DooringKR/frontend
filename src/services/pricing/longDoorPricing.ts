import {
  calculateLongDoorUnitPriceCore,
  calculateLongDoorUnitPriceWithOptionsCore,
} from "./longdoor/calculateLongDoorPrice";
import { LONG_DOOR_CONSTRUCT_PRICE } from "./longdoor/constants";

export { LONG_DOOR_CONSTRUCT_PRICE };

/**
 * 롱문 전용 문짝 단가 계산
 * - 세로 길이는 무시
 * - 가로 길이 급간 + 색상 tier(필름/스페셜/기타/유리문)에 따라 문짝 1개 단가를 반환
 */
export function calculateLongDoorUnitPrice(color: string, width: number): number {
  return calculateLongDoorUnitPriceCore(color, width);
}

/**
 * 롱문 전용 문짝 단가 계산 (옵션 포함)
 * - 세로 길이는 무시
 * - 가로 길이 급간 + 색상 tier에 따른 기본 단가
 * - 경첩도 같이 받을래요(addOnHinge) 선택 시 문짝 1개당 1만원 추가
 */
export function calculateLongDoorUnitPriceWithOptions(params: {
  color: string;
  width: number;
  addOnHinge?: boolean;
  hinge?: Array<number | null | undefined> | null;
}): number {
  return calculateLongDoorUnitPriceWithOptionsCore(params);
}

