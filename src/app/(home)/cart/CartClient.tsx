"use client";
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

import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { transformCartItemToNewCardProps } from "@/utils/transformers/transformCartItemToNewCardProps";

import useCartStore from "@/store/cartStore";
import useCartItemStore from "@/store/cartItemStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { ReadCartItemsUsecase } from "@/DDD/usecase/read_cart_items_usecase";
import { UpdateCartItemCountUsecase } from "@/DDD/usecase/update_cart_item_count_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { useOrderStore } from "@/store/orderStore";
import { track } from "@amplitude/analytics-browser";
import { trackClick } from "@/services/analytics/amplitude";
import { getScreenName } from "@/utils/screenName";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";


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
    trackClick({
      object_type: "button",
      object_name: "confirm",
      current_page: getScreenName(),
      modal_name: null,
    });
    try {
      router.push("/order");
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
    trackClick({
      object_type: "button",
      object_name: "addanother",
      current_page: getScreenName(),
      modal_name: null,
    });
    router.push("/");
  };

  useEffect(() => {
    useOrderStore.setState({ order: null });
  }, []);

  // 카트 아이템 상세정보 비동기 fetch
  useEffect(() => {
    let ignore = false;
    async function fetchDetails() {
      setIsLoading(true);
      console.log("cartItems in fetchDetails", cartItems); // 추가
      setCartItemDetails([]);
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
      <div className="flex min-h-screen flex-col items-center justify-center text-gray-500 pt-[60px]">
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
      <div className="flex min-h-screen flex-col pt-[60px]">
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
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator title="장바구니" page={"/cart"} />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>

          <div className="mb-4 flex flex-col gap-3">
            {cartItemDetails.map(({ cartItem, detail }, i) => {
              if (!cartItem) return null;
              
              const category = cartItem.detail_product_type;
              const key = `${category}-${i}`;
              const cardProps = transformCartItemToNewCardProps(cartItem, detail);
              
              if (!cardProps) return null;

              return (
                <ShoppingCartCardNew
                  key={key}
                  {...cardProps}
                  onIncrease={() => handleCountChange(category, i, (cartItem.item_count ?? 0) + 1)}
                  onDecrease={() => handleCountChange(category, i, (cartItem.item_count ?? 0) - 1)}
                  onTrash={() => { if (cartItem.id) handleCountChange(category, i, 0); }}
                />
              );
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
        <div className="px-5 flex flex-col gap-3">
          <PriceSummaryCard getTotalPrice={getTotalPrice} />
          <div>
            {(() => {
              // 양문 아이템 개수 계산
              const pairDoorCount = cartItemDetails
                .filter(({ cartItem, detail }) => 
                  cartItem.detail_product_type === DetailProductType.DOOR && 
                  detail?.is_pair_door === true
                )
                .reduce((sum, { cartItem }) => sum + (cartItem.item_count ?? 0), 0);
              
              if (pairDoorCount > 0) {
                const totalDoorCount = pairDoorCount * 2;
                return (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800 text-base font-medium">
                      양문 아이템이 {pairDoorCount}개 있어요. 문짝이 {totalDoorCount}개 제작될 예정이에요.
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          <PaymentNoticeCard />
        </div>
      </div>
      <div className="h-[100px]"></div>
      <div id="cart-next-button" className="fixed bottom-0 w-full max-w-[460px]">
        <BottomButton
          type="textcombo+button"
          textComboText={{
            title: `${getTotalPrice().toLocaleString()}원`,
            subtitle: "예상 주문금액",
          }}
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={handleGoToReceiveOption}
        />
      </div>
    </div>
  );
}
