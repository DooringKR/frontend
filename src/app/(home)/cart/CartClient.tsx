"use client";

import { deleteCartItem, getCartItems } from "@/api/cartApi";
import { AccessoryItem, CabinetItem, DoorItem, FinishItem, HardwareItem } from "@/types/itemTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useCartStore from "@/store/cartStore";
import useUserStore from "@/store/userStore";
import formatColor from "@/utils/formatColor";
import formatSize from "@/utils/formatSize";

import { getCategoryLabel } from "../order/cabinet/confirm/page";
import { formatBoring, formatBoringDirection } from "../order/door/confirm/page";

const DOOR_TYPE_KR_MAP: Record<string, string> = {
  normal: "일반문",
  flap: "플랩문",
  drawer: "서랍",
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

        const convertedItems: AnyCartItem[] = [];

        data.items.forEach((item: any) => {
          const category = item.product_type.toLowerCase();

          if (category === "door") {
            // const convertedItem: DoorItem = {
            //   slug: item.item_options.door_type?.toLowerCase() ?? "standard",
            //   color: item.item_options.door_color ?? "",
            //   width: Number(item.item_options.door_width ?? 0),
            //   height: Number(item.item_options.door_height ?? 0),
            //   doorRequest: item.item_options.door_request ?? "",
            //   hinge: {
            //     hingeCount: item.item_options.hinge_count ?? 0,
            //     hingePosition: item.item_options.hinge_direction ?? "left",
            //     topHinge: item.item_options.first_hinge_size ?? 0,
            //     middleHinge: item.item_options.second_hinge_size ?? 0,
            //     bottomHinge: item.item_options.third_hinge_size ?? 0,
            //     middleTopHinge: null,
            //     middleBottomHinge: null,
            //   },
            //   category,
            //   price: 10000, // 임시 가격
            //   count: item.item_count,
            //   cartItemId: item.cart_item_id,
            // };
            const convertedItem: DoorItem = {
              category: "door",
              color: item.item_options.door_color ?? "",
              width: String(item.item_options.door_width ?? ""),
              height: String(item.item_options.door_height ?? ""),
              hingeCount: Number(item.item_options.hinge_count ?? 0),
              hingeDirection: item.item_options.hinge_direction ?? "",
              boring: formatBoring(
                [
                  item.item_options.first_hinge_size ?? null,
                  item.item_options.second_hinge_size ?? null,
                  item.item_options.third_hinge_size ?? null,
                  item.item_options.fourth_hinge_size ?? null,
                ],
                item.item_options.door_type?.toLowerCase(),
              ),
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
            // const options = item.item_options;

            // const convertedItem: CabinetItem = {
            //   category: "cabinet",
            //   slug: options.cabinet_type?.toLowerCase() ?? null,
            //   color: options.cabinet_color ?? "",
            //   width: Number(options.cabinet_width ?? 0),
            //   height: Number(options.cabinet_height ?? 0),
            //   depth: Number(options.cabinet_depth ?? 0),
            //   cabinetRequests: options.cabinet_request ?? null,
            //   handleType: options.handle_type?.toLowerCase() ?? null,

            //   finishType: options.finish_type?.toLowerCase() ?? null,
            //   bodyType: options.body_type ?? null,
            //   bodyTypeDirectInput: options.body_type_direct_input ?? null,

            //   absorberType: options.absorber_type ?? null,
            //   absorberTypeDirectInput: options.absorber_type_direct_input ?? null,

            //   drawerType: options.drawer_type ?? null,
            //   railType: options.rail_type ?? null,

            //   addRiceCookerRail: options.add_rice_cooker_rail ?? null,
            //   addBottomDrawer: options.add_bottom_drawer ?? null,

            //   count: item.item_count ?? null,
            //   price: item.unit_price ?? 10000, // 가격 없으면 임시 값
            //   cartItemId: item.cart_item_id,

            //   compartmentCount: options.compartment_count ?? null,
            //   flapStayType: options.flap_stay_type ?? null,
            //   material: options.material ?? "",
            //   thickness: options.thickness ?? "",
            //   option: options.option ?? [],
            // };
            const convertedItem: CabinetItem = {
              category,
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
              riceRail: item.item_options.add_rice_cooker_rail ? "추가" : "없음",
              lowerDrawer: item.item_options.add_bottom_drawer ? "추가" : "없음",
              request: item.item_options.cabinet_request ?? "",
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "hardware") {
            // const convertedItem: HardwareItem = {
            //   category,
            //   slug: item.item_options.hardware_type?.toLowerCase() ?? null, // "SINK" → "sink"
            //   madeBy: item.item_options.hardware_madeby ?? "",
            //   model: item.item_options.hardware_model ?? "",
            //   hardwareRequest: item.item_options.hardware_request ?? null,
            //   price: item.unit_price ?? 10000, // 임시 가격 처리
            //   count: item.item_count ?? 1,
            //   cartItemId: item.cart_item_id,
            // };
            const convertedItem: HardwareItem = {
              category,
              madeBy: item.item_options.hardware_madeby ?? "",
              model: item.item_options.hardware_model ?? "",
              hardwareRequest: item.item_options.hardware_request ?? null,
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }

          if (category === "accessory") {
            // const convertedItem: AccessoryItem = {
            //   category: "accessory",
            //   slug: item.item_options.accessory_type?.toLowerCase() ?? null,
            //   madeBy: item.item_options.accessory_madeby ?? "",
            //   model: item.item_options.accessory_model ?? "",
            //   accessoryRequest: item.item_options.accessory_request ?? null,
            //   price: 10000, // 임시 가격 처리
            //   count: item.item_count ?? 1,
            //   cartItemId: item.cart_item_id,
            // };
            const convertedItem: AccessoryItem = {
              category,
              manufacturer: item.item_options.accessory_manufacturer ?? "",
              modelName: item.item_options.accessory_model_name ?? "",
              size: item.item_options.accessory_size ?? "",
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
          }
        });

        // setHasItems(data.items.length > 0);
        console.log("🧪 변환된 장바구니 아이템:", convertedItems);
        // setCartItems(convertedItems);
        useCartStore.getState().setCartItems(convertedItems);
        setCartId(data.cart_id);
        console.log("🛒 setCartItems 호출 후 cartItems:", convertedItems);
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

  useEffect(() => {
    const grouped: Record<string, OrderItem[]> = {};
    cartItems.forEach(item => {
      if (!item) return;
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    setCartGroups(grouped);
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
        await deleteCartItem(targetItem.cartItemId);

        setCartGroups(prev => {
          const updatedGroups = { ...prev };
          const filteredItems = updatedGroups[category].filter((_, i) => i !== index);
          updatedGroups[category] = filteredItems;
          const updatedItems = Object.values(updatedGroups).flat().filter(Boolean);
          setCartItems(updatedItems);
          return updatedGroups;
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
  if (!Object.keys(cartGroups).length) {
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

  // const getTotalItemCount = () => {
  //   return Object.values(cartGroups)
  //     .flat()
  //     .reduce((sum, item) => sum + (item?.count ?? 0), 0);
  // };

  const getTotalItemCount = () => {
    return cartItems.reduce((sum, item) => {
      if (!item) return sum;
      return sum + (item.count ?? 0);
    }, 0);
  };
  // const sanitizedCartGroups = Object.fromEntries(
  //   Object.entries(cartGroups).map(([key, items]) => [key, items.filter(Boolean)]),
  // );

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="장바구니" />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>
          {Object.entries(cartGroups).map(([category, items], groupIdx) => (
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

                  // return (
                  //   <ShoppingCartCard
                  //     key={key}
                  //     title={category === "door" ? "일반문" : (CATEGORY_MAP[category] ?? "")}
                  //     color={doorItem.color ?? ""}
                  //     width={String(doorItem.width ?? "")}
                  //     height={String(doorItem.height ?? "")}
                  //     hingeCount={doorItem.hinge?.hingeCount ?? 0}
                  //     hingeDirection={doorItem.hinge?.hingePosition === "left" ? "좌경" : "우경"}
                  //     boring={`상 ${doorItem.hinge?.topHinge} 중 ${doorItem.hinge?.middleHinge} 하 ${doorItem.hinge?.bottomHinge}`}
                  //     quantity={doorItem.count ?? 0}
                  //     trashable={true}
                  //     onIncrease={() => handleCountChange(category, i, (doorItem.count ?? 0) + 1)}
                  //     onDecrease={() => handleCountChange(category, i, (doorItem.count ?? 0) - 1)}
                  //     type={"door"}
                  //   />
                  // );
                  return (
                    <ShoppingCartCard
                      key={key}
                      type="door"
                      title="문짝"
                      color={formatColor(doorItem.color)}
                      width={formatSize(doorItem.width)}
                      height={formatSize(doorItem.height)}
                      hingeCount={doorItem.hingeCount}
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
                      depth={String(finishItem.baseDepth)}
                      depthIncrease={String(finishItem.additionalDepth)}
                      height={String(finishItem.baseHeight)}
                      heightIncrease={String(finishItem.additionalHeight)}
                      request={finishItem.finishRequest}
                      quantity={finishItem.count}
                      showQuantitySelector={true}
                      {...commonProps}
                    />
                  );
                }

                if (category === "cabinet") {
                  const cabinetItem = item as CabinetItem;
                  // return (
                  //   <ShoppingCartCard
                  //     type={"cabinet"}
                  //     key={key}
                  //     title={cabinetItem.slug ?? "부분장"}
                  //     color={cabinetItem.color ?? ""}
                  //     width={String(cabinetItem.width ?? "")}
                  //     height={String(cabinetItem.height ?? "")}
                  //     hingeCount={0}
                  //     hingeDirection={"없음"}
                  //     boring={"-"}
                  //     quantity={cabinetItem.count ?? 0}
                  //     {...commonProps}
                  //   />
                  // );
                  return (
                    <ShoppingCartCard
                      key={key}
                      type="cabinet"
                      title={getCategoryLabel(cabinetItem.category) ?? "부분장"}
                      color={formatColor(cabinetItem.color ?? "")}
                      width={formatSize(String(cabinetItem.width ?? ""))}
                      height={formatSize(String(cabinetItem.height ?? ""))}
                      depth={formatSize(String(cabinetItem.depth ?? ""))}
                      bodyMaterial={cabinetItem.bodyMaterial ?? ""}
                      handleType={cabinetItem.handleType ?? ""}
                      finishType={cabinetItem.finishType ?? ""}
                      showBar={cabinetItem.showBar ?? ""}
                      drawerType={cabinetItem.drawerType ?? ""}
                      railType={cabinetItem.railType ?? ""}
                      riceRail={cabinetItem.riceRail ?? ""}
                      lowerDrawer={cabinetItem.lowerDrawer ?? ""}
                      request={cabinetItem.request ?? ""}
                      quantity={cabinetItem.count ?? 0}
                      showQuantitySelector={true}
                      {...commonProps}
                    />
                  );
                }

                if (category === "accessory") {
                  const accessoryItem = item as AccessoryItem;
                  // return (
                  //   <ShoppingCartCard
                  //     type={"accessory"}
                  //     key={key}
                  //     title={accessoryItem.slug ?? "부속품"}
                  //     color={"-"}
                  //     width={"-"}
                  //     height={"-"}
                  //     hingeCount={0}
                  //     hingeDirection={"없음"}
                  //     boring={"-"}
                  //     quantity={accessoryItem.count ?? 0}
                  //     {...commonProps}
                  //   />
                  // );
                  return (
                    <ShoppingCartCard
                      key={key}
                      type="accessory"
                      title="부속"
                      manufacturer={accessoryItem.manufacturer}
                      modelName={accessoryItem.modelName}
                      size={accessoryItem.size}
                      quantity={accessoryItem.count}
                      showQuantitySelector={true}
                      {...commonProps}
                    />
                  );
                }

                if (category === "hardware") {
                  const hardwareItem = item as HardwareItem;
                  return (
                    // <ShoppingCartCard
                    //   type={"hardware"}
                    //   key={key}
                    //   title={hardwareItem.slug ?? "하드웨어"}
                    //   color={"-"}
                    //   width={"-"}
                    //   height={"-"}
                    //   hingeCount={0}
                    //   hingeDirection={"없음"}
                    //   boring={"-"}
                    //   quantity={hardwareItem.count ?? 0}
                    //   {...commonProps}
                    // />
                    <ShoppingCartCard
                      key={key}
                      type="hardware"
                      title="하드웨어"
                      manufacturer={hardwareItem.madeBy}
                      size={hardwareItem.model ? `${hardwareItem.model}mm` : ""}
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
          ))}
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
