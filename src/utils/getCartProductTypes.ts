import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { DetailProductType, ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { getAmplitudeDetailProductType } from "./amplitudeProductTypeMapper";
import { sortDetailProductTypes } from "./formatCartProductTypes";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { Cabinet } from "dooring-core-domain/dist/models/InteriorMaterials/Cabinet";
import { Accessory } from "dooring-core-domain/dist/models/InteriorMaterials/Accessory";
import { Hinge } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hinge";
import { Rail } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Rail";
import { Piece } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Piece";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";

/**
 * DetailProductType을 ProductType으로 매핑
 */
export function getProductTypeFromDetailProductType(detailProductType: string): string {
  switch (detailProductType) {
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
    
    case DetailProductType.ACCESSORY:
      return ProductType.ACCESSORY;
    
    case DetailProductType.HINGE:
    case DetailProductType.RAIL:
    case DetailProductType.PIECE:
      return ProductType.HARDWARE;
    
    default:
      return "알 수 없음";
  }
}

/**
 * DetailProductType enum 값을 한글 문자열로 변환
 */
export function getDetailProductTypeLabel(detailProductType: string): string {
  switch (detailProductType) {
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
      return detailProductType;
  }
}

/**
 * CartItem 배열에서 product_type 배열을 추출 (추가 후 상태)
 */
export function getProductTypesFromCartItems(cartItems: CartItem[], newDetailProductType?: string): string[] {
  const types = cartItems.map(item => 
    getProductTypeFromDetailProductType(item.detail_product_type)
  );
  
  // 새로 추가할 아이템이 있으면 포함
  if (newDetailProductType) {
    types.push(getProductTypeFromDetailProductType(newDetailProductType));
  }
  
  return types;
}

/**
 * CartItem 배열에서 detail_product_type 배열을 추출 (추가 후 상태)
 * Amplitude용으로 세분화된 타입 반환
 * 
 * 기존 CartItem들의 실제 제품 데이터를 DB에서 조회하여
 * 정확한 세부 타입(일반문/플랩문/서랍 마에다 등)을 반환합니다.
 * 
 * @param cartItems - 현재 카트의 CartItem 배열 (기존 아이템들)
 * @param newDetailProductType - 새로 추가할 아이템의 detail_product_type (enum)
 * @param newItemData - 새로 추가할 아이템의 실제 데이터 (Door, Finish, Cabinet 등)
 */
export async function getDetailProductTypesFromCartItems(
  cartItems: CartItem[], 
  newDetailProductType?: string,
  newItemData?: any
): Promise<string[]> {
  // 기존 카트 아이템들의 실제 제품 데이터를 조회하여 세분화된 타입 추출
  const existingTypesPromises = cartItems.map(async (cartItem) => {
    let detail: any = null;
    try {
      switch (cartItem.detail_product_type) {
        case DetailProductType.DOOR:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Door>("Door")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.FINISH:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Finish>("Finish")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.UPPERCABINET:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Cabinet>("UpperCabinet")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.LOWERCABINET:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Cabinet>("LowerCabinet")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.TALLCABINET:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Cabinet>("TallCabinet")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.FLAPCABINET:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Cabinet>("FlapCabinet")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.DRAWERCABINET:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Cabinet>("DrawerCabinet")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.OPENCABINET:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Cabinet>("OpenCabinet")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.ACCESSORY:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Accessory>("Accessory")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.HINGE:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Hinge>("Hinge")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.RAIL:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Rail>("Rail")
          ).findById(cartItem.item_detail);
          break;
        case DetailProductType.PIECE:
          detail = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Piece>("Piece")
          ).findById(cartItem.item_detail);
          break;
        default:
          detail = null;
      }
    } catch (e) {
      console.error("기존 CartItem 세부 정보 조회 오류:", e);
      detail = null;
    }
    
    // 조회된 실제 데이터를 기반으로 세분화된 타입 반환
    if (detail) {
      return getAmplitudeDetailProductType(cartItem.detail_product_type, detail);
    } else {
      // 조회 실패 시 enum 기반 기본 라벨 사용
      return getDetailProductTypeLabel(cartItem.detail_product_type);
    }
  });
  
  const existingTypes = await Promise.all(existingTypesPromises);
  
  // 새로 추가할 아이템이 있으면 포함 (세분화된 타입)
  if (newDetailProductType) {
    const amplitudeType = getAmplitudeDetailProductType(newDetailProductType, newItemData);
    existingTypes.push(amplitudeType);
  }
  
  // 중복 제거 및 정렬
  return sortDetailProductTypes(Array.from(new Set(existingTypes)));
}

/**
 * CartItem 배열에서 총 수량 계산
 */
export function getTotalQuantityFromCartItems(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => sum + (item.item_count || 0), 0);
}

/**
 * CartItem 배열에서 총 금액 계산
 */
export function getTotalValueFromCartItems(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => {
    const unitPrice = item.unit_price || 0;
    const quantity = item.item_count || 0;
    return sum + (unitPrice * quantity);
  }, 0);
}
