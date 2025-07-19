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
type AnyCartItem = DoorItem | CabinetItem | AccessoryItem | FinishItem | HardwareItem;

export default function CartClient() {
  const router = useRouter();

  const [cartGroups, setCartGroups] = useState<Record<string, OrderItem[]>>({});
  //   const [hasItems, setHasItems] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setCartItems, setCartId } = useCartStore();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = 1;
        // const { id: userId } = useUserStore.getState();

        // if (!userId) {
        //   console.warn("유저 ID가 없습니다. 장바구니를 불러올 수 없습니다.");
        //   return;
        // }
        const data = await getCartItems(userId);
        console.log("🛒 받아온 장바구니 데이터:", data);
        console.log("✅ 장바구니 ID:", data.cart_id);

        const convertedItems: AnyCartItem[] = [];
        const grouped: Record<string, OrderItem[]> = {};

        data.items.forEach((item: any) => {
          const category = item.product_type.toLowerCase();

          if (category === "door") {
            const convertedItem: DoorItem = {
              slug: item.item_options.door_type?.toLowerCase() ?? "standard",
              color: item.item_options.door_color ?? "",
              width: Number(item.item_options.door_width ?? 0),
              height: Number(item.item_options.door_height ?? 0),
              doorRequest: item.item_options.door_request ?? "",
              hinge: {
                hingeCount: item.item_options.hinge_count ?? 0,
                hingePosition: item.item_options.hinge_direction ?? "left",
                topHinge: item.item_options.first_hinge_size ?? 0,
                middleHinge: item.item_options.second_hinge_size ?? 0,
                bottomHinge: item.item_options.third_hinge_size ?? 0,
                middleTopHinge: null,
                middleBottomHinge: null,
              },
              category,
              price: 10000, // 임시 가격
              count: item.item_count,
              cartItemId: item.cart_item_id,
            };
            convertedItems.push(convertedItem);
            grouped[category] = grouped[category] || [];
            grouped[category].push(convertedItem);
          }

          if (category === "finish") {
            const convertedItem: FinishItem = {
              category,
              color: item.item_options.finish_color ?? "",
              baseDepth: Number(item.item_options.finish_base_depth ?? 0),
              additionalDepth: Number(item.item_options.finish_additional_depth ?? 0),
              baseHeight: Number(item.item_options.finish_base_height ?? 0),
              additionalHeight: Number(item.item_options.finish_additional_height ?? 0),
              finishRequest: item.item_options.finish_request ?? "",
              count: item.item_count ?? 1,
              price: item.unit_price ?? 10000, // 가격 없으면 임시값
              cartItemId: item.cart_item_id,
              height: undefined,
              depth: undefined,
            };

            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(convertedItem);
          }

          if (category === "cabinet") {
            const options = item.item_options;

            const convertedItem: CabinetItem = {
              category: "cabinet",
              slug: options.cabinet_type?.toLowerCase() ?? null,
              color: options.cabinet_color ?? "",
              width: Number(options.cabinet_width ?? 0),
              height: Number(options.cabinet_height ?? 0),
              depth: Number(options.cabinet_depth ?? 0),
              cabinetRequests: options.cabinet_request ?? null,
              handleType: options.handle_type?.toLowerCase() ?? null,

              finishType: options.finish_type?.toLowerCase() ?? null,
              bodyType: options.body_type ?? null,
              bodyTypeDirectInput: options.body_type_direct_input ?? null,

              absorberType: options.absorber_type ?? null,
              absorberTypeDirectInput: options.absorber_type_direct_input ?? null,

              drawerType: options.drawer_type ?? null,
              railType: options.rail_type ?? null,

              addRiceCookerRail: options.add_rice_cooker_rail ?? null,
              addBottomDrawer: options.add_bottom_drawer ?? null,

              count: item.item_count ?? null,
              price: item.unit_price ?? 10000, // 가격 없으면 임시 값
              cartItemId: item.cart_item_id,

              // 직접입력 필드 (백에서 내려줄 수도 있음)
              compartmentCount: options.compartment_count ?? null,
              flapStayType: options.flap_stay_type ?? null,
              material: options.material ?? "",
              thickness: options.thickness ?? "",
              option: options.option ?? [],
            };

            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(convertedItem);
          }

          if (category === "hardware") {
            const convertedItem: HardwareItem = {
              category,
              slug: item.item_options.hardware_type?.toLowerCase() ?? null, // "SINK" → "sink"
              madeBy: item.item_options.hardware_madeby ?? "",
              model: item.item_options.hardware_model ?? "",
              hardwareRequest: item.item_options.hardware_request ?? null,
              price: item.unit_price ?? 10000, // 임시 가격 처리
              count: item.item_count ?? 1,
              cartItemId: item.cart_item_id,
            };

            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(convertedItem);
          }

          if (category === "accessory") {
            const convertedItem: AccessoryItem = {
              category: "accessory",
              slug: item.item_options.accessory_type?.toLowerCase() ?? null, // 예: "sink_bowl"
              madeBy: item.item_options.accessory_madeby ?? "",
              model: item.item_options.accessory_model ?? "",
              accessoryRequest: item.item_options.accessory_request ?? null,
              price: 10000, // 임시 가격 처리
              count: item.item_count ?? 1,
              cartItemId: item.cart_item_id,
            };

            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(convertedItem);
          }
        });

        setCartGroups(grouped);
        // setHasItems(data.items.length > 0);
        setCartItems(convertedItems);
        setCartId(data.cart_id); // ✅ 저장
      } catch (err) {
        console.error("장바구니 불러오기 실패:", err);
      } finally {
        setIsLoading(false); // ✅ 로딩 완료
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const cartItems: OrderItem[] = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const address1 = saved.state?.address1 || "주소 없음";

    const grouped: Record<string, OrderItem[]> = {};
    cartItems.forEach(item => {
      if (!item) return;
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    setCartGroups(grouped);
    // setHasItems(cartItems.length > 0);
  }, []);

  const getTotalPrice = () => {
    return Object.values(cartGroups)
      .flat()
      .reduce((sum, item) => {
        if (!item) return sum;
        console.log("🧾 item.price:", item.price, "item.count:", item.count);
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
          localStorage.setItem("cartItems", JSON.stringify(Object.values(updatedGroups).flat()));
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
        localStorage.setItem("cartItems", JSON.stringify(Object.values(newGroups).flat()));
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

  const getTotalItemCount = () => {
    return Object.values(cartGroups)
      .flat()
      .reduce((sum, item) => sum + (item?.count ?? 0), 0);
  };
  const sanitizedCartGroups = Object.fromEntries(
    Object.entries(cartGroups).map(([key, items]) => [key, items.filter(Boolean)]),
  );

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

                  return (
                    <ShoppingCartCard
                      key={key}
                      title={category === "door" ? "일반문" : (CATEGORY_MAP[category] ?? "")}
                      color={doorItem.color ?? ""}
                      width={String(doorItem.width ?? "")}
                      height={String(doorItem.height ?? "")}
                      hingeCount={doorItem.hinge?.hingeCount ?? 0}
                      hingeDirection={doorItem.hinge?.hingePosition === "left" ? "좌경" : "우경"}
                      boring={`상 ${doorItem.hinge?.topHinge} 중 ${doorItem.hinge?.middleHinge} 하 ${doorItem.hinge?.bottomHinge}`}
                      quantity={doorItem.count ?? 0}
                      trashable={true}
                      onIncrease={() => handleCountChange(category, i, (doorItem.count ?? 0) + 1)}
                      onDecrease={() => handleCountChange(category, i, (doorItem.count ?? 0) - 1)}
                      type={"door"}
                    />
                  );
                }

                if (category === "finish") {
                  const finishItem = item as FinishItem;
                  const totalHeight =
                    (finishItem.baseHeight ?? 0) + (finishItem.additionalHeight ?? 0);
                  return (
                    <ShoppingCartCard
                      type={"finish"}
                      key={key}
                      title={"마감재"}
                      color={finishItem.color ?? ""}
                      width={""}
                      height={String(totalHeight)}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={finishItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                if (category === "cabinet") {
                  const cabinetItem = item as CabinetItem;
                  return (
                    <ShoppingCartCard
                      type={"cabinet"}
                      key={key}
                      title={cabinetItem.slug ?? "부분장"}
                      color={cabinetItem.color ?? ""}
                      width={String(cabinetItem.width ?? "")}
                      height={String(cabinetItem.height ?? "")}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={cabinetItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                if (category === "accessory") {
                  const accessoryItem = item as AccessoryItem;
                  return (
                    <ShoppingCartCard
                      type={"accessory"}
                      key={key}
                      title={accessoryItem.slug ?? "부속품"}
                      color={"-"}
                      width={"-"}
                      height={"-"}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={accessoryItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                if (category === "hardware") {
                  const hardwareItem = item as HardwareItem;
                  return (
                    <ShoppingCartCard
                      type={"hardware"}
                      key={key}
                      title={hardwareItem.slug ?? "하드웨어"}
                      color={"-"}
                      width={"-"}
                      height={"-"}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={hardwareItem.count ?? 0}
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
          <PriceSummaryCard
            cartGroups={sanitizedCartGroups}
            getTotalPrice={getTotalPrice}
            categoryMap={CATEGORY_MAP}
          />
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
