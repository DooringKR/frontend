/**
 * CartItem에서 product_type과 detail_product_type을 추출하는 유틸리티
 */

import { DetailProductType, ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

/**
 * DetailProductType enum 값을 ProductType으로 매핑
 */
export function getProductTypeFromDetailType(detailType: string): string {
  switch (detailType) {
    case DetailProductType.DOOR:
      return ProductType.DOOR;
    
    case DetailProductType.FINISH:
      return ProductType.FINISH;
    
    case DetailProductType.UPPERCABINET:
    case DetailProductType.LOWERCABINET:
    case DetailProductType.TALLCABINET:
    case DetailProductType.DRAWERCABINET:
    case DetailProductType.OPENCABINET:
    case DetailProductType.FLAPCABINET:
      return ProductType.CABINET;
    
    case DetailProductType.HINGE:
    case DetailProductType.RAIL:
    case DetailProductType.PIECE:
      return ProductType.HARDWARE;
    
    case DetailProductType.ACCESSORY:
      return ProductType.ACCESSORY;
    
    default:
      return "기타";
  }
}

/**
 * DetailProductType enum 값을 한글 문자열로 변환
 */
export function getDetailProductTypeLabel(detailType: string): string {
  switch (detailType) {
    case DetailProductType.DOOR:
      return "일반문";
    case DetailProductType.FINISH:
      return "EP마감";
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
    case DetailProductType.HINGE:
      return "경첩";
    case DetailProductType.RAIL:
      return "레일 피스";
    case DetailProductType.PIECE:
      return "레일 피스";
    case DetailProductType.ACCESSORY:
      return "부속";
    default:
      return detailType;
  }
}
