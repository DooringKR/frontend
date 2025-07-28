"use client";

import { deleteCartItem, getCartItems } from "@/api/cartApi";
import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
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

const DOOR_TYPE_SLUG_MAP: Record<string, string> = {
  standard: "normal",
  flap: "flap",
  drawer: "drawer",
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) {
          console.warn("유저 ID가 없습니다. 장바구니를 불러올 수 없습니다.");
          return;
        }
        const data = await getCartItems(userId);
        console.log("🍎 아이템 data확인:", data);
        console.log("🍎 price는?", data.items);
        const convertedItems: AnyCartItem[] = [];

        data.items.forEach((item: any) => {
          const category = item.product_type.toLowerCase();
          const rawType = item.item_options.door_type?.toLowerCase() ?? "";
          const slug = DOOR_TYPE_SLUG_MAP[rawType] ?? rawType;

          if (category === "door") {
            const hingeCount = Number(item.item_options.hinge_count ?? 0);

            // hinge_count에 따라 boring 배열 동적 생성
            const boringArray = [];
            for (let i = 0; i < hingeCount; i++) {
              switch (i) {
                case 0:
                  boringArray.push(item.item_options.first_hinge_size ?? null);
                  break;
                case 1:
                  boringArray.push(item.item_options.second_hinge_size ?? null);
                  break;
                case 2:
                  boringArray.push(item.item_options.third_hinge_size ?? null);
                  break;
                case 3:
                  boringArray.push(item.item_options.fourth_hinge_size ?? null);
                  break;
                default:
                  boringArray.push(null);
              }
            }

            const convertedItem: DoorItem = {
              category: "door",
              doorType: slug,
              color: item.item_options.door_color ?? "",
              width: String(item.item_options.door_width ?? ""),
              height: String(item.item_options.door_height ?? ""),
              hingeCount,
              hingeDirection: item.item_options.hinge_direction ?? "",
              boring: boringArray,
              boringCategory: item.item_options.door_type?.toLowerCase(),
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
              color: itemOptions.finish_color ?? "",
              baseDepth: Number(itemOptions.finish_base_depth ?? 0),
              additionalDepth: Number(itemOptions.finish_additional_depth ?? 0),
              baseHeight: Number(itemOptions.finish_base_height ?? 0),
              additionalHeight: Number(itemOptions.finish_additional_height ?? 0),
              finishRequest: itemOptions.finish_request ?? "",
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "cabinet") {
            const convertedItem: CabinetItem = {
              category,
              cabinetType: item.item_options.cabinet_type ?? "",
              color: item.item_options.cabinet_color ?? "",
              width: String(item.item_options.cabinet_width ?? ""),
              height: String(item.item_options.cabinet_height ?? ""),
              depth: String(item.item_options.cabinet_depth ?? ""),
              bodyMaterial: item.item_options.body_type ?? "",
              handleType: item.item_options.handle_type ?? "",
              finishType: item.item_options.finish_type ?? "",
              showBar: item.item_options.absorber_type ?? "",
              drawerType: item.item_options.drawer_type ?? "",
              railType: item.item_options.rail_type ?? "",
              request: item.item_options.cabinet_request ?? "",
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "hardware") {
            const convertedItem: HardwareItem = {
              category,
              hardwareType: item.item_options.hardware_type ?? "",
              madeBy: item.item_options.hardware_madeby ?? "",
              model: item.item_options.hardware_model ?? "",
              size: item.item_options.hardware_size ?? "",
              hardwareRequest: item.item_options.hardware_request ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "accessory") {
            const convertedItem: AccessoryItem = {
              category,
              accessoryType: item.item_options.accessory_type ?? "",
              manufacturer: item.item_options.accessory_madeby ?? "",
              modelName: item.item_options.accessory_model ?? "",
              size: item.item_options.accessory_size ?? "",
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
              accessoryRequest: item.item_options.accessory_request ?? null,
            };
            convertedItems.push(convertedItem);
          }
        });

        console.log("🧪 변환된 장바구니 아이템:", convertedItems);
        // useCartStore.getState().setCartItems(convertedItems);
        // setCartId(data.cart_id);
        console.log("🛒 setCartItems 호출 후 cartItems:", convertedItems);

        queueMicrotask(() => {
          const store = useCartStore.getState();
          store.setCartItems(convertedItems); // ❗ 렌더링 이후 호출
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
        });
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
    const targetItem = cartGroups[category]?.[index];
    if (!targetItem || targetItem.cartItemId == null) return;

    if (newCount < 1) {
      try {
        // 1. 서버에서 삭제
        await deleteCartItem(targetItem.cartItemId);

        // 2. 그룹 상태 업데이트 (UI 갱신용)
        const nextGroups = structuredClone(cartGroups); // 안전 복사
        const filteredItems = nextGroups[category]?.filter((_, i) => i !== index) ?? [];
        nextGroups[category] = filteredItems;
        setCartGroups(nextGroups);

        // 3. 장바구니 아이템 업데이트는 별도로 처리
        const updatedItems = Object.values(nextGroups)
          .flat()
          .filter((item): item is AnyCartItem => item !== null);

        // 4. queueMicrotask로 상태 업데이트
        queueMicrotask(() => {
          try {
            useCartStore.getState().setCartItems(updatedItems);
          } catch (err) {
            console.error("🧨 상태 업데이트 실패:", err);
          }
        });
      } catch (err) {
        console.error("❌ 장바구니 삭제 실패:", err);
      }
    } else {
      // 수량만 업데이트
      setCartGroups(prev => {
        const newGroups = { ...prev };
        const updatedItems = [...(newGroups[category] || [])];

        if (updatedItems[index]) {
          updatedItems[index] = {
            ...updatedItems[index],
            count: newCount,
          };
        }

        newGroups[category] = updatedItems;
        const allItems = Object.values(newGroups).flat().filter(Boolean);
        setCartItems(allItems);
        return newGroups;
      });
    }
  };

  const handleGoToReceiveOption = () => {
    router.push("/cart/receive-option");
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-gray-500">
        <TopNavigator title="장바구니" />
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
        <TopNavigator title="장바구니" />
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
      <TopNavigator title="장바구니" />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>
          {/* {Object.entries(cartGroups).map(([category, items], groupIdx) => (
            <div key={category + groupIdx} className="mb-4 flex flex-col gap-3">
              {items.map((item, i) => {
                if (!item) return null;

                const key = `${category}-${i}`;
                const commonProps = {
                  trashable: true,
                  onIncrease: () => handleCountChange(category, i, (item.count ?? 0) + 1),
                  onDecrease: () => handleCountChange(category, i, (item.count ?? 0) - 1),
                };

                if (category === "door") {
                  const doorItem = item as DoorItem;

                  return (
                    <ShoppingCartCard
                      key={key}
                      type="door"
                      title={getCategoryLabel(doorItem.doorType, DOOR_CATEGORY_LIST, "문짝")}
                      color={formatColor(doorItem.color)}
                      width={Number(doorItem.width)}
                      height={Number(doorItem.height)}
                      hingeCount={doorItem.hingeCount > 0 ? doorItem.hingeCount : undefined}
                      hingeDirection={formatBoringDirection(doorItem.hingeDirection)}
                      boring={doorItem.boring}
                      quantity={doorItem.count}
                      trashable={true}
                      onIncrease={() => handleCountChange(category, i, doorItem.count + 1)}
                      onDecrease={() => handleCountChange(category, i, doorItem.count - 1)}
                    />
                  );
                }

                if (category === "finish") {
                  const finishItem = item as FinishItem;

                  return (
                    <ShoppingCartCard
                      key={key}
                      type="finish"
                      title="마감재"
                      color={formatColor(finishItem.color)}
                      depth={finishItem.baseDepth}
                      depthIncrease={finishItem.additionalDepth}
                      height={finishItem.baseHeight}
                      heightIncrease={finishItem.additionalHeight}
                      request={finishItem.finishRequest}
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
                      title={getCategoryLabel(
                        cabinetItem.cabinetType,
                        CABINET_CATEGORY_LIST,
                        "부분장",
                      )}
                      color={formatColor(cabinetItem.color ?? "")}
                      width={Number(cabinetItem.width ?? 0)}
                      height={Number(cabinetItem.height ?? 0)}
                      depth={Number(cabinetItem.depth ?? 0)}
                      bodyMaterial={cabinetItem.bodyMaterial ?? ""}
                      handleType={cabinetItem.handleType ?? ""}
                      finishType={cabinetItem.finishType ?? ""}
                      showBar={cabinetItem.showBar ?? ""}
                      drawerType={cabinetItem.drawerType ?? ""}
                      railType={cabinetItem.railType ?? ""}
                      request={cabinetItem.request ?? ""}
                      quantity={cabinetItem.count ?? 0}
                      showQuantitySelector={true}
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
                        accessoryItem.accessoryType,
                        ACCESSORY_CATEGORY_LIST,
                        "부속",
                      )}
                      manufacturer={accessoryItem.manufacturer}
                      modelName={accessoryItem.modelName}
                      size={accessoryItem.size}
                      quantity={accessoryItem.count}
                      request={accessoryItem.accessoryRequest ?? undefined}
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
                        hardwareItem.hardwareType,
                        HARDWARE_CATEGORY_LIST,
                        "하드웨어",
                      )}
                      manufacturer={hardwareItem.madeBy}
                      size={hardwareItem.size ? `${hardwareItem.size}mm` : ""}
                      request={hardwareItem.hardwareRequest ?? ""}
                      quantity={hardwareItem.count}
                      showQuantitySelector={true}
                      {...commonProps}
                    />
                  );
                }

                return null;
              })}
            </div>
          ))} */}

          <div className="mb-4 flex flex-col gap-3 border">
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

                return (
                  <ShoppingCartCard
                    key={key}
                    type="door"
                    title={getCategoryLabel(doorItem.doorType, DOOR_CATEGORY_LIST, "문짝")}
                    color={formatColor(doorItem.color)}
                    width={Number(doorItem.width)}
                    height={Number(doorItem.height)}
                    hingeCount={doorItem.hingeCount > 0 ? doorItem.hingeCount : undefined}
                    hingeDirection={formatBoringDirection(doorItem.hingeDirection)}
                    boring={doorItem.boring}
                    boringCategory={doorItem.boringCategory}
                    quantity={doorItem.count}
                    trashable={true}
                    onIncrease={() => handleCountChange(category, i, doorItem.count + 1)}
                    onDecrease={() => handleCountChange(category, i, doorItem.count - 1)}
                  />
                );
              }

              if (category === "finish") {
                const finishItem = item as FinishItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="finish"
                    title="마감재"
                    color={formatColor(finishItem.color)}
                    depth={finishItem.baseDepth}
                    depthIncrease={finishItem.additionalDepth}
                    height={finishItem.baseHeight}
                    heightIncrease={finishItem.additionalHeight}
                    request={finishItem.finishRequest}
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
                    title={getCategoryLabel(
                      cabinetItem.cabinetType,
                      CABINET_CATEGORY_LIST,
                      "부분장",
                    )}
                    color={formatColor(cabinetItem.color ?? "")}
                    width={Number(cabinetItem.width ?? 0)}
                    height={Number(cabinetItem.height ?? 0)}
                    depth={Number(cabinetItem.depth ?? 0)}
                    bodyMaterial={cabinetItem.bodyMaterial ?? ""}
                    handleType={cabinetItem.handleType ?? ""}
                    finishType={cabinetItem.finishType ?? ""}
                    showBar={cabinetItem.showBar ?? ""}
                    drawerType={cabinetItem.drawerType ?? ""}
                    railType={cabinetItem.railType ?? ""}
                    request={cabinetItem.request ?? ""}
                    quantity={cabinetItem.count ?? 0}
                    showQuantitySelector={true}
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
                      accessoryItem.accessoryType,
                      ACCESSORY_CATEGORY_LIST,
                      "부속",
                    )}
                    manufacturer={accessoryItem.manufacturer}
                    modelName={accessoryItem.modelName}
                    size={accessoryItem.size}
                    quantity={accessoryItem.count}
                    request={accessoryItem.accessoryRequest ?? undefined}
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
                      hardwareItem.hardwareType,
                      HARDWARE_CATEGORY_LIST,
                      "하드웨어",
                    )}
                    manufacturer={hardwareItem.madeBy}
                    size={hardwareItem.size ? `${hardwareItem.size}mm` : ""}
                    request={hardwareItem.hardwareRequest ?? ""}
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

      <div className="w-full max-w-[500px] bg-white">
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
