"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { LongDoor } from "dooring-core-domain/dist/models/CompositeProducts/LongDoor";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { Cabinet } from "dooring-core-domain/dist/models/InteriorMaterials/Cabinet";
import { Accessory } from "dooring-core-domain/dist/models/InteriorMaterials/Accessory";
import { Hinge } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hinge";
import { Rail } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Rail";
import { Piece } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Piece";
import { HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

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
import { supabase } from "@/lib/supabase";


// type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;
export type AnyCartItem = CartItem;

// 롱문 카드와 개별 문 정보 토글 컴포넌트
function LongDoorCardWithToggle({
  cartItem,
  cardProps,
  relatedDoors,
  category,
  originalIndex,
  onIncrease,
  onDecrease,
  onTrash,
}: {
  cartItem: CartItem;
  cardProps: any;
  relatedDoors?: Door[];
  category: string;
  originalIndex: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onTrash: () => void;
}) {
  const [isDoorsExpanded, setIsDoorsExpanded] = useState(false);

  return (
    <div className="flex w-full flex-col rounded-[16px] border-[1px] border-gray-200 bg-white overflow-hidden">
      {/* ShoppingCartCardNew를 border 없이 렌더링하기 위해 스타일 오버라이드 */}
      <div className="[&>div]:border-0 [&>div]:rounded-none [&>div]:shadow-none">
        <ShoppingCartCardNew
          {...cardProps}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onTrash={onTrash}
        />
      </div>

      {/* 관련 Door 정보 토글 */}
      {relatedDoors && relatedDoors.length > 0 && (
        <>
          <div className="h-px bg-gray-100 mx-[20px]" />
          <div
            className="flex items-center justify-between px-[20px] py-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsDoorsExpanded(!isDoorsExpanded)}
          >
            <div className="text-[14px] font-600 text-gray-800">개별 문 정보 ({relatedDoors.length}개)</div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDoorsExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {isDoorsExpanded && (
            <div className="px-[20px] pb-4 pt-2">
              <div className="space-y-2">
                {relatedDoors.map((door, idx) => {
                  const hinge = (door.hinge ?? []) as (number | null)[];
                  const boringLabel = hinge.length === 1 && (hinge[0] === null || hinge[0] === undefined)
                    ? "모름"
                    : hinge.length > 0
                      ? `${hinge.length}개`
                      : "미입력";
                  const boringSizeLabel = hinge.length > 0
                    ? `[${hinge.map(x => x ?? "null").join(", ")}]`
                    : "미입력";
                  return (
                    <div key={door.id || idx} className="rounded-lg bg-gray-50 p-3 text-[12px] font-400 text-gray-700">
                      <div className="mb-1 font-600 text-gray-800">{idx + 1}번 문</div>
                      <div>가로 길이: {door.door_width ? `${door.door_width}mm` : "미입력"}</div>
                      <div>높이: {door.door_height ? `${door.door_height}mm` : "미입력"}</div>
                      <div>경첩 방향: {
                        door.hinge_direction === HingeDirection.LEFT ? "좌경첩" :
                          door.hinge_direction === HingeDirection.RIGHT ? "우경첩" :
                            door.hinge_direction === HingeDirection.UNKNOWN ? "모름" :
                              "미입력"
                      }</div>
                      <div>보링 개수: {boringLabel}</div>
                      <div>보링 치수: {boringSizeLabel}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// UI용 상세 정보 타입
type CartItemDetail = {
  cartItem: CartItem;
  detail: any | null; // Door | Finish | Cabinet | Hardware | Accessory | LongDoor 등
  relatedDoors?: Door[]; // 롱문의 경우 관련 Door 배열
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

    // 세트상품이 있으면 세트상품만 주문하도록 CreateOrderUsecase에서 필터링됨
    // 여기서는 단순히 주문 페이지로 이동
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
    // 롱문은 1회 1개 주문만 가능(수량 증가 불가)
    if (item.detail_product_type === DetailProductType.LONGDOOR && newCount > 1) {
      alert("롱문은 1회 1개 주문만 가능합니다.");
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
              case DetailProductType.LONGDOOR:
                const longDoorData = await new CrudInteriorMaterialsUsecase(
                  new InteriorMaterialsSupabaseRepository<LongDoor>("LongDoor")
                ).findById(cartItem.item_detail);
                // DB에서 가져온 raw 데이터를 LongDoor 객체로 변환
                const longDoor = longDoorData ? LongDoor.fromDB(longDoorData as any) : null;
                detail = longDoor;

                // 롱문에 연결된 Door들 조회
                let relatedDoors: Door[] = [];
                if (longDoor && longDoor.id) {
                  try {
                    const { data: doorsData, error: doorsError } = await supabase
                      .from("Door")
                      .select("*")
                      .eq("long_door_id", longDoor.id)
                      .order("long_door_order", { ascending: true });

                    if (!doorsError && doorsData) {
                      relatedDoors = doorsData.map((doorData: any) => Door.fromDB(doorData));
                    }
                  } catch (e) {
                    console.error("Failed to fetch related doors for LongDoor:", e);
                  }
                }

                return { cartItem, detail, relatedDoors };
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
          return { cartItem, detail, relatedDoors: undefined };
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

  // 세트 상품과 개별 상품 분리
  const setProducts = cartItemDetails.filter(({ cartItem }) => cartItem.detail_product_type === DetailProductType.LONGDOOR);
  const individualProducts = cartItemDetails.filter(({ cartItem }) => cartItem.detail_product_type !== DetailProductType.LONGDOOR);

  // 세트상품이 있으면 세트상품만 구매 가능
  const hasSetProducts = setProducts.length > 0;
  const purchasableItems = hasSetProducts ? setProducts : cartItemDetails;

  const getTotalItemCount = () => {
    return purchasableItems.length;
  };

  const getTotalPrice = () => {
    return purchasableItems.reduce((sum, { cartItem }) => sum + (cartItem.unit_price ?? 0) * (cartItem.item_count ?? 0), 0);
  };

  const getSetProductPrice = () => {
    return setProducts.reduce((sum, { cartItem }) => sum + (cartItem.unit_price ?? 0) * (cartItem.item_count ?? 0), 0);
  };

  // 예상 주문금액: 세트상품이 있으면 세트상품만, 없으면 전체
  const getExpectedOrderPrice = () => {
    return hasSetProducts ? getSetProductPrice() : getTotalPrice();
  };

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator title="장바구니" page={"/cart"} />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>

          {/* 세트 상품 섹션 */}
          {setProducts.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 text-[16px] font-600 text-gray-800">세트 상품</div>
              <div className="flex flex-col gap-3">
                {setProducts.map(({ cartItem, detail, relatedDoors }, i) => {
                  if (!cartItem) return null;

                  const category = cartItem.detail_product_type;
                  const originalIndex = cartItems.findIndex(ci => ci.id === cartItem.id);
                  const key = `${category}-${originalIndex}`;
                  const cardProps = transformCartItemToNewCardProps(cartItem, detail, relatedDoors);

                  if (!cardProps) return null;

                  return (
                    <LongDoorCardWithToggle
                      key={key}
                      cartItem={cartItem}
                      cardProps={cardProps}
                      relatedDoors={relatedDoors}
                      category={category}
                      originalIndex={originalIndex}
                      onIncrease={() => {
                        // 롱문은 수량 증가 불가
                        alert("롱문은 1회 1개 주문만 가능합니다.");
                      }}
                      onDecrease={() => handleCountChange(category, originalIndex, (cartItem.item_count ?? 0) - 1)}
                      onTrash={() => { if (cartItem.id) handleCountChange(category, originalIndex, 0); }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 개별 상품 섹션 */}
          {individualProducts.length > 0 && (
            <div className="mb-4">
              <div className="mb-3 text-[16px] font-600 text-gray-800">개별 상품</div>
              {hasSetProducts && (
                <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-[14px] font-500 text-amber-800">
                    세트상품 구매 후 개별 상품을 구매할 수 있습니다.
                  </p>
                </div>
              )}
              <div className={`flex flex-col gap-3 ${hasSetProducts ? 'opacity-50 pointer-events-none' : ''}`}>
                {individualProducts.map(({ cartItem, detail }, i) => {
                  if (!cartItem) return null;

                  const category = cartItem.detail_product_type;
                  const originalIndex = cartItems.findIndex(ci => ci.id === cartItem.id);
                  const key = `${category}-${originalIndex}`;
                  const cardProps = transformCartItemToNewCardProps(cartItem, detail);

                  if (!cardProps) return null;

                  return (
                    <ShoppingCartCardNew
                      key={key}
                      {...cardProps}
                      onIncrease={() => handleCountChange(category, originalIndex, (cartItem.item_count ?? 0) + 1)}
                      onDecrease={() => handleCountChange(category, originalIndex, (cartItem.item_count ?? 0) - 1)}
                      onTrash={() => { if (cartItem.id) handleCountChange(category, originalIndex, 0); }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <BottomButton
            type="1button"
            button1Text="상품 추가"
            button1Type="BrandInverse"
            className="w-full pt-0"
            onButton1Click={handleAddProduct}
          />
        </div>
        <div className="px-5 flex flex-col gap-3">
          <PriceSummaryCard
            getTotalPrice={getExpectedOrderPrice}
            filteredCartItems={hasSetProducts ? setProducts.map(({ cartItem }) => cartItem) : undefined}
          />
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
          {!hasSetProducts && <PaymentNoticeCard />}
        </div>
      </div>
      <div className="h-[100px]"></div>
      <div id="cart-next-button" className="fixed bottom-0 w-full max-w-[460px]">
        <BottomButton
          type="textcombo+button"
          textComboText={{
            title: `${getExpectedOrderPrice().toLocaleString()}원`,
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
