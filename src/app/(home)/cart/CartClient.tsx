"use client";

// import {
//   ACCESSORY_CATEGORY_LIST,
//   CABINET_CATEGORY_LIST,
//   DOOR_CATEGORY_LIST,
//   FINISH_CATEGORY_LIST,
//   HARDWARE_CATEGORY_LIST,
// } from "@/constants/category";

// import { CART_PAGE } from "@/constants/pageName";
// import {
//   AccessoryItem,
//   CabinetItem,
//   DoorItem,
//   FinishItem,
//   HardwareItem,
// } from "@/types/newItemTypes";

import { DOOR_COLOR_LIST, CABINET_COLOR_LIST, FINISH_COLOR_LIST } from "@/constants/colorList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { Cabinet } from "dooring-core-domain/dist/models/InteriorMaterials/Cabinet";
import { Accessory } from "dooring-core-domain/dist/models/InteriorMaterials/Accessory";
import { Hinge } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hinge";
import { Rail } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Rail";
import { Piece } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Piece";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useCartStore from "@/store/cartStore";
import useCartItemStore from "@/store/cartItemStore";
// import { formatBoringDirection } from "@/utils/formatBoring";
// import formatColor from "@/utils/formatColor";
// import { getCategoryLabel } from "@/utils/getCategoryLabel";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { ReadCartItemsUsecase } from "@/DDD/usecase/read_cart_items_usecase";
import { UpdateCartItemCountUsecase } from "@/DDD/usecase/update_cart_item_count_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";

// const DOOR_TYPE_SLUG_MAP: Record<string, string> = {
//   standard: "STANDARD",
//   flap: "FLAP",
//   drawer: "DRAWER",
// };

// const CATEGORY_MAP: Record<string, string> = {
//   door: "문짝",
//   finish: "마감재",
//   cabinet: "부분장",
//   hardware: "하드웨어",
//   accessory: "부속",
// };

// export const PRODUCT_TYPE_KR_MAP: Record<string, string> = {
//   DOOR: "일반문",
//   FINISH: "마감재",
//   CABINET: "부분장",
//   HARDWARE: "하드웨어",
//   ACCESSORY: "부속",
// };

// type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;
export type AnyCartItem = CartItem;

// UI용 상세 정보 타입
type CartItemDetail = {
  cartItem: CartItem;
  detail: any | null; // Door | Finish | Cabinet | Hardware | Accessory 등
};

export default function CartClient() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const setCartId = useCartStore(state => state.setCartId);
  const userId = useCartStore(state => state.cart?.user_id);
  const cartItems = useCartItemStore(state => state.cartItems);
  // UI에 표시할 상세 정보 포함된 배열
  const [cartItemDetails, setCartItemDetails] = useState<CartItemDetail[]>([]);
  const setCartItems = useCartItemStore(state => state.setCartItems);
  const addCartItem = useCartItemStore(state => state.addCartItem);
  const updateCartItem = useCartItemStore(state => state.updateCartItem);
  const removeCartItem = useCartItemStore(state => state.removeCartItem);
  const clearCartItems = useCartItemStore(state => state.clearCartItems);

  const handleGoToReceiveOption = async () => {
    try {
      router.push("/cart/receive-option");
    } catch (err) {
      console.error("❌ 수량 반영 실패:", err);
      alert("수량 반영 중 문제가 발생했어요.");
    }
  };

  // 수량 변경 핸들러 (서버 동기화)
  const handleCountChange = async (category: string, index: number, newCount: number) => {
    const item = cartItems[index];
    console.log('[handleCountChange] category:', category, 'index:', index, 'newCount:', newCount, 'item:', item);
    if (!item || !item.id || newCount < 0) {
      console.warn('[handleCountChange] Invalid item or id or newCount < 0', { item, newCount });
      return;
    }
    const usecase = new UpdateCartItemCountUsecase(new CartItemSupabaseRepository());
    try {
      const result = await usecase.updateCount(item.id, newCount);
      console.log('[handleCountChange] updateCount result:', result);
      if (result) {
        updateCartItem(item.id, { item_count: newCount });
      } else {
        removeCartItem(item.id);
      }
    } catch (e: any) {
      console.error('[handleCountChange] Error:', e);
      alert("서버와 동기화 중 오류 발생: " + (e?.message || e));
    }
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  // 카트 아이템 상세정보 비동기 fetch
  useEffect(() => {
    let ignore = false;
    async function fetchDetails() {
      setIsLoading(true);
      console.log("cartItems in fetchDetails", cartItems); // 추가
      const details: CartItemDetail[] = await Promise.all(
        cartItems.map(async (cartItem) => {
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
            console.error("fetch detail error", e); // 추가
            detail = null;
          }
          return { cartItem, detail };
        })
      );
      console.log("details after fetch", details); // 추가
      if (!ignore) setCartItemDetails(details);
      setIsLoading(false);
    }
    fetchDetails();
    return () => { ignore = true; };
  }, [cartItems]);

  // 장바구니 아이템 서버에서 fetch하여 zustand에 동기화
  useEffect(() => {
    async function fetchCartItemsFromServer() {
      const cartId = useCartStore.getState().cart?.id;
      if (!cartId) return;
      const usecase = new ReadCartItemsUsecase();
      const response = await usecase.readCartItemsByCartId(cartId);
      setCartItems(response.data || []);
    }
    fetchCartItemsFromServer();
  }, []);

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-gray-500">
        <TopNavigator title="장바구니" page={"/cart"} />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <p className="text-[17px] font-500">장바구니 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 장바구니 비었을 때
  if (!cartItemDetails || cartItemDetails.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopNavigator title="장바구니" page={"/cart"} />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <img src="/icons/paper.svg" alt="빈 용지 아이콘" className="mb-3" />
          <p className="mb-5 text-center text-[17px] font-500 text-gray-500">장바구니가 비었어요</p>
          <Button text="상품추가" type="Brand" onClick={handleAddProduct} />
        </div>
      </div>
    );
  }

  const getTotalItemCount = () => {
    return cartItemDetails.length;
  };

  const getTotalPrice = () => {
    return cartItemDetails.reduce((sum, { cartItem }) => sum + (cartItem.unit_price ?? 0) * (cartItem.item_count ?? 0), 0);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="장바구니" page={"/cart"} />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>

          <div className="mb-4 flex flex-col gap-3">
            {cartItemDetails.map(({ cartItem, detail }, i) => {
              if (!cartItem) return null;
              const category = cartItem.detail_product_type;
              const key = `${category}-${i}`;
              const commonProps = {
                trashable: true,
                onIncrease: () => handleCountChange(category, i, (cartItem.item_count ?? 0) + 1),
                onDecrease: () => handleCountChange(category, i, (cartItem.item_count ?? 0) - 1),
                onRemove: () => { if (cartItem.id) handleCountChange(category, i, 0); },
              };

              // DOOR
              if (category === DetailProductType.DOOR && detail) {
                const colorName = DOOR_COLOR_LIST.find(c => c.id === detail.door_color)?.name || detail.door_color;
                return (
                  <ShoppingCartCard
                    key={key}
                    type="door"
                    totalPrice={cartItem.unit_price * cartItem.item_count}
                    title={category || "일반문"}
                    color={colorName}
                    width={Number(detail.door_width)}
                    height={Number(detail.door_height)}
                    hingeCount={detail.hinge?.length > 0 ? detail.hinge.length : undefined}
                    hingeDirection={detail.hinge_direction}
                    boring={detail.hinge}
                    location={detail.door_location ?? ""}
                    quantity={cartItem.item_count}
                    showQuantitySelector={true}
                    addOn_hinge={detail.addOn_hinge ?? undefined}
                    request={detail.door_request ?? undefined}
                    {...commonProps}
                  />
                );
              }
              // FINISH
              if (category === DetailProductType.FINISH && detail) {
                const colorName = FINISH_COLOR_LIST.find(c => c.id === detail.finish_color)?.name || detail.finish_color || detail.finish_color_direct_input || "";
                return (
                  <ShoppingCartCard
                    key={key}
                    type="finish"
                    totalPrice={cartItem.unit_price * cartItem.item_count}
                    title={category || "마감재"}
                    color={colorName}
                    edgeCount={detail.finish_edge_count ?? undefined}
                    depth={detail.finish_base_depth}
                    depthIncrease={detail.finish_additional_depth ?? undefined}
                    height={detail.finish_base_height}
                    heightIncrease={detail.finish_additional_height ?? undefined}
                    request={detail.finish_request ?? undefined}
                    location={detail.finish_location ?? ""}
                    quantity={cartItem.item_count}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }
              // CABINET
              if ((category === DetailProductType.UPPERCABINET || category === DetailProductType.LOWERCABINET || category === DetailProductType.FLAPCABINET || category === DetailProductType.DRAWERCABINET || category === DetailProductType.OPENCABINET) && detail) {
                const colorName = CABINET_COLOR_LIST.find(c => c.id === detail.cabinet_color)?.name || detail.cabinet_color;
                const behindTypeEnum = detail.behind_type ?? detail.cabinet_behind_type ?? "";
                const behindTypeLabel =
                  behindTypeEnum === "URAHOME" ? "우라홈" :
                  behindTypeEnum === "MAK_URA" ? "막우라" :
                  behindTypeEnum;
                // robust: 서랍장 직접입력 지원
                let drawerTypeLabel = "";
                if (category === DetailProductType.DRAWERCABINET) {
                  if (detail.drawer_type === 4 && detail.drawer_type_direct_input) {
                    drawerTypeLabel = detail.drawer_type_direct_input;
                  } else {
                    const found = CABINET_DRAWER_TYPE_LIST.find(opt => opt.id === detail.drawer_type);
                    drawerTypeLabel = found ? found.name : (detail.drawer_type ?? "");
                  }
                } else {
                  drawerTypeLabel = detail.drawer_type ?? "";
                }
                return (
                  <ShoppingCartCard
                    key={key}
                    type="cabinet"
                    totalPrice={cartItem.unit_price * cartItem.item_count}
                    title={category || "부분장"}
                    color={colorName}
                    width={Number(detail.cabinet_width ?? 0)}
                    height={Number(detail.cabinet_height ?? 0)}
                    depth={Number(detail.cabinet_depth ?? 0)}
                    bodyMaterial={detail.cabinet_body_material ?? ""}
                    body_material_direct_input={detail.cabinet_body_material_direct_input ?? ""}
                    absorberType={detail.absorber_type ?? ""}
                    absorber_type_direct_input={detail.absorber_type_direct_input ?? ""}
                    handleType={detail.handle_type ?? ""}
                    behindType={behindTypeLabel}
                    drawerType={drawerTypeLabel}
                    railType={detail.rail_type ?? ""}
                    request={detail.cabinet_request ?? ""}
                    location={detail.cabinet_location ?? ""}
                    quantity={cartItem.item_count ?? 0}
                    showQuantitySelector={true}
                    addOn_construction={detail.addOn_construction ?? undefined}
                    legType={detail.leg_type ?? undefined}
                    {...commonProps}
                  />
                );
              }
              // ACCESSORY
              if (category === DetailProductType.ACCESSORY && detail) {
                return (
                  <ShoppingCartCard
                    key={key}
                    type="accessory"
                    title={category || "부속"}
                    manufacturer={detail.accessory_madeby}
                    modelName={detail.accessory_model}
                    quantity={cartItem.item_count}
                    request={detail.accessory_request ?? undefined}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }
              // HARDWARE (HINGE, RAIL, PIECE)
              if ((category === DetailProductType.HINGE || category === DetailProductType.RAIL || category === DetailProductType.PIECE) && detail) {
                return (
                  <ShoppingCartCard
                    key={key}
                    type="hardware"
                    title={category || "하드웨어"}
                    manufacturer={detail.hinge_madeby || detail.rail_madeby || detail.piece_madeby || ""}
                    size={detail.piece_size || detail.rail_length || ""}
                    request={detail.hardware_request ?? ""}
                    quantity={cartItem.item_count}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }
              return null;
            })}
          </div>

          <BottomButton
            type="1button"
            button1Text="상품 추가"
            button1Type="BrandInverse"
            className="w-full pt-0"
            onButton1Click={handleAddProduct}
          />
        </div>
        <div className="px-5">
          <PriceSummaryCard getTotalPrice={getTotalPrice} />
        </div>
      </div>
      <div className="h-[100px]"></div>
      <div id="cart-next-button" className="fixed bottom-0 w-full max-w-[460px]">
        <BottomButton
          type="textcombo+button"
          textComboText={{
            title: `${getTotalPrice().toLocaleString()}원`,
            subtitle: "주문금액",
          }}
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={handleGoToReceiveOption}
        />
      </div>
    </div>
  );
}
