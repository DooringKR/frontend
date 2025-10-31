/**
 * Amplitude 이벤트용 세부 제품 타입 매핑
 * DetailProductType enum과 달리, 실제 제품의 세부 타입을 반영
 */

import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

/**
 * CartItem의 detail_product_type과 실제 제품 데이터를 기반으로
 * Amplitude용 세부 제품 타입 문자열을 반환
 * 
 * @param detailProductType - CartItem.detail_product_type (enum 값)
 * @param itemDetail - 실제 제품 객체 (Door, Finish, Cabinet 등)
 * @returns Amplitude에 전송할 세부 타입 문자열
 */
export function getAmplitudeDetailProductType(
  detailProductType: string,
  itemDetail?: any
): string {
  switch (detailProductType) {
    // 문짝 - door_type으로 구분 (Door 객체)
    case DetailProductType.DOOR:
      // Door 객체의 door_type은 "일반문" | "플랩문" | "서랍문" 형태
      if (itemDetail?.door_type === "플랩문") return "플랩문";
      if (itemDetail?.door_type === "서랍문") return "서랍 마에다";
      return "일반문"; // 기본값
    
    // 마감재 - finish_type으로 구분 (Finish 객체)
    case DetailProductType.FINISH:
      if (itemDetail?.finish_type === "몰딩") return "몰딩";
      if (itemDetail?.finish_type === "걸레받이") return "걸레받이";
      return "EP마감"; // 기본값
    
    // 부분장 - 이미 세분화되어 있음
    case DetailProductType.UPPERCABINET:
      return "상부장";
    case DetailProductType.LOWERCABINET:
      return "하부장";
    case DetailProductType.TALLCABINET:
      return "키큰장";
    case DetailProductType.DRAWERCABINET:
      return "서랍장";
    case DetailProductType.OPENCABINET:
      return "오픈장";
    case DetailProductType.FLAPCABINET:
      return "플랩장";
    
    // 부속 - accessory_type으로 구분 (Accessory 객체)
    case DetailProductType.ACCESSORY:
      // Accessory 객체의 accessory_type은 "싱크볼" | "쿡탑" | "후드" 형태
      if (itemDetail?.accessory_type === "싱크볼") return "싱크볼";
      if (itemDetail?.accessory_type === "쿡탑") return "쿡탑";
      if (itemDetail?.accessory_type === "후드") return "후드";
      return "부속"; // 기본값
    
    // 하드웨어
    case DetailProductType.HINGE:
      return "경첩";
    case DetailProductType.RAIL:
      return "레일 피스";
    case DetailProductType.PIECE:
      return "레일 피스";
    
    default:
      return detailProductType; // 알 수 없는 경우 원본 반환
  }
}
