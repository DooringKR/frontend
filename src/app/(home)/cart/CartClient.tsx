"use client";

import { deleteCartItem, getCartItems, updateCartItem } from "@/api/cartApi";
import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  FINISH_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
import { CART_PAGE } from "@/constants/pageName";
import {
  AccessoryItem,
  CabinetItem,
  DoorItem,
  FinishItem,
  HardwareItem,
} from "@/types/newItemTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useCartStore from "@/store/cartStore";
import useUserStore from "@/store/userStore";
import { formatBoringDirection } from "@/utils/formatBoring";
import formatColor from "@/utils/formatColor";
import { getCategoryLabel } from "@/utils/getCategoryLabel";
import { usePageView } from "@/services/hooks/usePageView";
import { useButtonClick } from "@/services/hooks/useButtonClick";

const DOOR_TYPE_SLUG_MAP: Record<string, string> = {
  standard: "STANDARD",
  flap: "FLAP",
  drawer: "DRAWER",
};

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  cabinet: "부분장",
  hardware: "하드웨어",
  accessory: "부속",
};

export const PRODUCT_TYPE_KR_MAP: Record<string, string> = {
  DOOR: "일반문",
  FINISH: "마감재",
  CABINET: "부분장",
  HARDWARE: "하드웨어",
  ACCESSORY: "부속",
};

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;
export type AnyCartItem = DoorItem | CabinetItem | AccessoryItem | FinishItem | HardwareItem;

export default function CartClient() {
  const router = useRouter();

  const [cartGroups, setCartGroups] = useState<Record<string, OrderItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const setCartItems = useCartStore(state => state.setCartItems);
  const setCartId = useCartStore(state => state.setCartId);
  const cartItems = useCartStore(state => state.cartItems);
  const userId = useUserStore.getState().id;

  const [originalItemOptionsMap, setOriginalItemOptionsMap] = useState<Record<number, any>>({});

  usePageView("Cart");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) {
          console.warn("유저 ID가 없습니다. 장바구니를 불러올 수 없습니다.");
          return;
        }
        const data = await getCartItems(userId);
        console.log("🍎 아이템 data확인:", data);
        const convertedItems: AnyCartItem[] = [];
        const itemOptionsMap: Record<number, any> = {};
        data.items.forEach((item: any) => {
          const id = item.cart_item_id;
          itemOptionsMap[id] = item.item_options;

          const category = item.product_type.toLowerCase();
          const rawType = item.item_options.door_type?.toLowerCase() ?? "";
          const slug = DOOR_TYPE_SLUG_MAP[rawType] ?? rawType;

          if (category === "door") {
            const hingeCount = Number(item.item_options.hinge_count ?? 0);

            const convertedItem: DoorItem = {
              category: "door",
              door_type: slug,
              door_color: item.item_options.door_color ?? "",
              door_width: Number(item.item_options.door_width ?? 0),
              door_height: Number(item.item_options.door_height ?? 0),
              hinge_count: hingeCount,
              hinge_direction: item.item_options.hinge_direction ?? "",
              first_hinge: item.item_options.first_hinge_size ?? null,
              second_hinge: item.item_options.second_hinge_size ?? null,
              third_hinge: item.item_options.third_hinge_size ?? null,
              fourth_hinge: item.item_options.fourth_hinge_size ?? null,
              door_location: item.item_options.door_location ?? null,
              addOn_hinge: item.item_options.addOn_hinge ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "finish") {
            const itemOptions = item.item_options ?? {};

            const convertedItem: FinishItem = {
              category: "finish",
              finish_category: itemOptions.finish_category ?? "",
              finish_color: itemOptions.finish_color ?? "",
              finish_edge_count: Number(itemOptions.finish_edge_count ?? 0),
              finish_base_depth: Number(itemOptions.finish_base_depth ?? 0),
              finish_additional_depth: Number(itemOptions.finish_additional_depth ?? 0),
              finish_base_height: Number(itemOptions.finish_base_height ?? 0),
              finish_additional_height: Number(itemOptions.finish_additional_height ?? 0),
              finish_request: itemOptions.finish_request ?? "",
              finish_location: itemOptions.finish_location ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "cabinet") {
            const convertedItem: CabinetItem = {
              category,
              cabinet_type: item.item_options.cabinet_type ?? "",
              cabinet_color: item.item_options.cabinet_color ?? "",
              cabinet_width: Number(item.item_options.cabinet_width ?? 0),
              cabinet_height: Number(item.item_options.cabinet_height ?? 0),
              cabinet_depth: Number(item.item_options.cabinet_depth ?? 0),
              cabinet_location: item.item_options.cabinet_location ?? null,
              cabinet_request: item.item_options.cabinet_request ?? null,
              handle_type: item.item_options.handle_type ?? "",
              finish_type: item.item_options.finish_type ?? "",
              body_type: item.item_options.body_type ?? "",
              body_type_direct_input: item.item_options.body_type_direct_input ?? null,
              absorber_type: item.item_options.absorber_type ?? null,
              absorber_type_direct_input: item.item_options.absorber_type_direct_input ?? null,
              drawer_type: item.item_options.drawer_type ?? null,
              rail_type: item.item_options.rail_type ?? null,
              add_rice_cooker_rail: item.item_options.add_rice_cooker_rail ?? null,
              add_bottom_drawer: item.item_options.add_bottom_drawer ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
              addOn_construction: item.item_options.addOn_construction ?? null,
              leg_type: item.item_options.leg_type ?? null,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "hardware") {
            const convertedItem: HardwareItem = {
              category,
              hardware_type: item.item_options.hardware_type ?? "",
              hardware_madeby: item.item_options.hardware_madeby ?? "",
              hardware_size: item.item_options.hardware_size ? `${item.item_options.hardware_size}mm` : "",
              hardware_request: item.item_options.hardware_request ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "accessory") {
            const convertedItem: AccessoryItem = {
              category,
              accessory_type: item.item_options.accessory_type ?? "",
              accessory_madeby: item.item_options.accessory_madeby ?? "",
              accessory_model: item.item_options.accessory_model ?? "",
              accessory_request: item.item_options.accessory_request ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }
        });

        setOriginalItemOptionsMap(itemOptionsMap);

        console.log("🧪 변환된 장바구니 아이템:", convertedItems);

        console.log("🛒 setCartItems 호출 후 cartItems:", convertedItems);

        setTimeout(() => {
          const store = useCartStore.getState();
          store.setCartItems(convertedItems);
          store.setCartId(data.cart_id);

          const sortedItems = [...convertedItems].sort(
            (a, b) => (a.cartItemId ?? 0) - (b.cartItemId ?? 0),
          );
          const grouped: Record<string, OrderItem[]> = {};
          sortedItems.forEach(item => {
            if (!item) return;
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
          });
          setCartGroups(grouped);
        }, 0); // 렌더링 이후 실행
      } catch (err) {
        console.error("장바구니 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    console.log("🛒 cartItems 상태:", cartItems);
  }, [cartItems]);

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      if (!item) return sum;
      return sum + (item.price ?? 0) * (item.count ?? 1);
    }, 0);
  };

  const handleCountChange = async (category: string, index: number, newCount: number) => {
    // cartItems 배열에서 해당 인덱스의 아이템을 찾음
    const targetItem = cartItems[index];
    if (!targetItem || targetItem.cartItemId == null) return;

    if (newCount < 1) {
      try {
        // 1. 서버에서 삭제
        await deleteCartItem(targetItem.cartItemId);

        // 2. cartItems에서 해당 아이템 제거
        const updatedItems = cartItems.filter(item => item?.cartItemId !== targetItem.cartItemId);
        setCartItems(updatedItems);

        // 3. cartGroups도 업데이트
        setCartGroups(prev => {
          const newGroups = { ...prev };
          newGroups[category] =
            newGroups[category]?.filter(item => item?.cartItemId !== targetItem.cartItemId) ?? [];
          return newGroups;
        });
      } catch (err) {
        console.error("❌ 장바구니 삭제 실패:", err);
      }
    } else {
      // 수량만 업데이트
      // cartItems 업데이트
      const updatedItems: AnyCartItem[] = cartItems.map(item => {
        if (item?.cartItemId === targetItem.cartItemId) {
          return { ...item, count: newCount };
        }
        return item;
      });
      setCartItems(updatedItems);

      // cartGroups도 업데이트
      setCartGroups(prev => {
        const newGroups = { ...prev };
        const categoryItems = newGroups[category] || [];
        const updatedCategoryItems = categoryItems.map(item => {
          if (item?.cartItemId === targetItem.cartItemId) {
            return { ...item, count: newCount } as OrderItem;
          }
          return item;
        });
        newGroups[category] = updatedCategoryItems;
        return newGroups;
      });
    }
  };

  useEffect(() => {
    const allItems = Object.values(cartGroups)
      .flat()
      .filter((item): item is AnyCartItem => item !== null);

    setCartItems(allItems);
  }, [cartGroups]);

  const getOriginalItemOptions = (item: AnyCartItem) => {
    return originalItemOptionsMap[item.cartItemId ?? -1] ?? {};
  };

  const buttonClick = useButtonClick("Cart", "CartNextButton");
  const handleGoToReceiveOption = async () => {
    buttonClick();
    try {
      const promises = cartItems.map(item => {
        if (!item.cartItemId) return null;

        const itemOptions = getOriginalItemOptions(item);
        console.log("🧾 updateCartItem 호출 직전 count:", item.count);
        return updateCartItem(item.cartItemId, itemOptions, item.count);
      });

      await Promise.all(promises.filter(Boolean));
      router.push("/cart/receive-option");
    } catch (err) {
      console.error("❌ 수량 반영 실패:", err);
      alert("수량 반영 중 문제가 발생했어요.");
    }
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-gray-500">
        <TopNavigator title="장바구니" page={CART_PAGE} />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <p className="text-[17px] font-500">장바구니 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 장바구니 비었을 때
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopNavigator title="장바구니" page={CART_PAGE} />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <img src="/icons/paper.svg" alt="빈 용지 아이콘" className="mb-3" />
          <p className="mb-5 text-center text-[17px] font-500 text-gray-500">장바구니가 비었어요</p>
          <Button text="상품추가" type="Brand" onClick={handleAddProduct} />
        </div>
      </div>
    );
  }

  const getTotalItemCount = () => {
    return cartItems.reduce((sum, item) => {
      if (!item) return sum;
      return sum + (item.count ?? 0);
    }, 0);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="장바구니" page={CART_PAGE} />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>

          <div className="mb-4 flex flex-col gap-3">
            {cartItems.map((item, i) => {
              if (!item) return null;

              const category = item.category;
              const key = `${category}-${i}`;
              const commonProps = {
                trashable: true,
                onIncrease: () => handleCountChange(category, i, (item.count ?? 0) + 1),
                onDecrease: () => handleCountChange(category, i, (item.count ?? 0) - 1),
              };

              if (category === "door") {
                const doorItem = item as DoorItem;

                // hinge_count에 따라 boring 배열 동적 생성
                const boringArray = [];
                for (let i = 0; i < doorItem.hinge_count; i++) {
                  switch (i) {
                    case 0:
                      boringArray.push(doorItem.first_hinge ?? null);
                      break;
                    case 1:
                      boringArray.push(doorItem.second_hinge ?? null);
                      break;
                    case 2:
                      boringArray.push(doorItem.third_hinge ?? null);
                      break;
                    case 3:
                      boringArray.push(doorItem.fourth_hinge ?? null);
                      break;
                    default:
                      boringArray.push(null);
                  }
                }

                return (
                  <ShoppingCartCard
                    key={key}
                    type="door"
                    totalPrice={doorItem.price * doorItem.count} // 총 금액
                    title={getCategoryLabel(doorItem.door_type, DOOR_CATEGORY_LIST, "문짝")}
                    color={formatColor(doorItem.door_color)}
                    width={Number(doorItem.door_width)}
                    height={Number(doorItem.door_height)}
                    hingeCount={doorItem.hinge_count > 0 ? doorItem.hinge_count : undefined}
                    hingeDirection={formatBoringDirection(doorItem.hinge_direction)}
                    boring={boringArray}
                    location={doorItem.door_location ?? ""}
                    // boringCategory={doorItem.boringCategory}
                    quantity={doorItem.count}
                    trashable={true}
                    onIncrease={() => handleCountChange(category, i, doorItem.count + 1)}
                    onDecrease={() => handleCountChange(category, i, doorItem.count - 1)}
                    addOn_hinge={doorItem.addOn_hinge ?? undefined}
                  />
                );
              }

              if (category === "finish") {
                const finishItem = item as FinishItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="finish"
                    totalPrice={finishItem.price * finishItem.count} // 총 금액
                    title={FINISH_CATEGORY_LIST.find(item => item.slug === finishItem.finish_category.toLowerCase())?.header ?? ""}
                    color={formatColor(finishItem.finish_color)}
                    edgeCount={finishItem.finish_edge_count ?? undefined}
                    depth={finishItem.finish_base_depth}
                    depthIncrease={finishItem.finish_additional_depth ?? undefined}
                    height={finishItem.finish_base_height}
                    heightIncrease={finishItem.finish_additional_height ?? undefined}
                    request={finishItem.finish_request ?? undefined}
                    location={finishItem.finish_location ?? ""}
                    quantity={finishItem.count}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }

              if (category === "cabinet") {
                const cabinetItem = item as CabinetItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="cabinet"
                    totalPrice={cabinetItem.price * cabinetItem.count} // 총 금액
                    title={getCategoryLabel(
                      cabinetItem.cabinet_type,
                      CABINET_CATEGORY_LIST,
                      "부분장",
                    )}
                    color={formatColor(cabinetItem.cabinet_color ?? "")}
                    width={Number(cabinetItem.cabinet_width ?? 0)}
                    height={Number(cabinetItem.cabinet_height ?? 0)}
                    depth={Number(cabinetItem.cabinet_depth ?? 0)}
                    bodyMaterial={cabinetItem.body_type ?? ""}
                    handleType={cabinetItem.handle_type ?? ""}
                    finishType={cabinetItem.finish_type ?? ""}
                    showBar={cabinetItem.absorber_type ?? ""}
                    drawerType={cabinetItem.drawer_type ?? ""}
                    railType={cabinetItem.rail_type ?? ""}
                    request={cabinetItem.cabinet_request ?? ""}
                    location={cabinetItem.cabinet_location ?? ""}
                    quantity={cabinetItem.count ?? 0}
                    showQuantitySelector={true}
                    addOn_construction={cabinetItem.addOn_construction ?? undefined}
                    legType={cabinetItem.leg_type ?? undefined}
                    {...commonProps}
                  />
                );
              }

              if (category === "accessory") {
                const accessoryItem = item as AccessoryItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="accessory"
                    title={getCategoryLabel(
                      accessoryItem.accessory_type,
                      ACCESSORY_CATEGORY_LIST,
                      "부속",
                    )}
                    manufacturer={accessoryItem.accessory_madeby}
                    modelName={accessoryItem.accessory_model}
                    quantity={accessoryItem.count}
                    request={accessoryItem.accessory_request ?? undefined}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }

              if (category === "hardware") {
                const hardwareItem = item as HardwareItem;
                return (
                  <ShoppingCartCard
                    key={key}
                    type="hardware"
                    title={getCategoryLabel(
                      hardwareItem.hardware_type,
                      HARDWARE_CATEGORY_LIST,
                      "하드웨어",
                    )}
                    manufacturer={hardwareItem.hardware_madeby}
                    size={hardwareItem.hardware_size ? `${hardwareItem.hardware_size}mm` : ""}
                    request={hardwareItem.hardware_request ?? ""}
                    quantity={hardwareItem.count}
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
          <PriceSummaryCard getTotalPrice={getTotalPrice} categoryMap={CATEGORY_MAP} />
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
