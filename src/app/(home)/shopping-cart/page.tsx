// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import BottomButton from "@/components/BottomButton/BottomButton";
// import Button2 from "@/components/Button/Button";
// import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
// import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
// import TopNavigator from "@/components/TopNavigator/TopNavigator";

// function ShoppingCartPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       trashable: true,
//       title: "Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 3,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//     {
//       id: 2,
//       trashable: false,
//       title: "Non-Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 4,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//   ]);

//   const handleQuantityChange = (id: number, delta: number) => {
//     setProducts(prev =>
//       prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)),
//     );
//   };

//   const handleNextButtonClick = () => {
//     // 현재 api 오류로 주석처리
//     router.push("/cart/checkorder");
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <TopNavigator title="장바구니" />
//       <div className="flex-1 overflow-y-auto pb-[100px]">
//         <ProductInfo products={products} onQuantityChange={handleQuantityChange} />
//       </div>
//       <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white">
//         <BottomButton
//           type="textcombo+button"
//           textComboText={{ title: "100,000,000원", subtitle: "주문금액" }}
//           button1Text="다음"
//           button1Type="Brand"
//           onButton1Click={handleNextButtonClick}
//         />
//       </div>
//     </div>
//   );
// }

// function ProductInfo({
//   products,
//   onQuantityChange,
// }: {
//   products: any[];
//   onQuantityChange: (id: number, delta: number) => void;
// }) {
//   return (
//     <>
//       <div className="flex flex-col gap-3 p-5">
//         <div>상품 {products.length}개</div>
//         {products.map(product => (
//           <ShoppingCartCard
//             key={product.id}
//             {...product}
//             onIncrease={() => onQuantityChange(product.id, 1)}
//             onDecrease={() => onQuantityChange(product.id, -1)}
//           />
//         ))}
//         <Button2 type={"BrandInverse"} text={"상품 추가"} />
//       </div>
//       <PriceCheckCard />
//     </>
//   );
// }

// export default ShoppingCartPage;
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { AccessoryItem } from "@/store/Items/accessoryStore";
import { CabinetItem } from "@/store/Items/cabinetStore";
import { DoorItem } from "@/store/Items/doorStore";
import { FinishItem } from "@/store/Items/finishStore";
import { HardwareItem } from "@/store/Items/hardwareStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import BottomButton from "@/components/BottomButton/BottomButton";
// import Button2 from "@/components/Button/Button";
// import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
// import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
// import TopNavigator from "@/components/TopNavigator/TopNavigator";

// function ShoppingCartPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       trashable: true,
//       title: "Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 3,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//     {
//       id: 2,
//       trashable: false,
//       title: "Non-Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 4,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//   ]);

//   const handleQuantityChange = (id: number, delta: number) => {
//     setProducts(prev =>
//       prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)),
//     );
//   };

//   const handleNextButtonClick = () => {
//     // 현재 api 오류로 주석처리
//     router.push("/cart/checkorder");
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <TopNavigator title="장바구니" />
//       <div className="flex-1 overflow-y-auto pb-[100px]">
//         <ProductInfo products={products} onQuantityChange={handleQuantityChange} />
//       </div>
//       <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white">
//         <BottomButton
//           type="textcombo+button"
//           textComboText={{ title: "100,000,000원", subtitle: "주문금액" }}
//           button1Text="다음"
//           button1Type="Brand"
//           onButton1Click={handleNextButtonClick}
//         />
//       </div>
//     </div>
//   );
// }

// function ProductInfo({
//   products,
//   onQuantityChange,
// }: {
//   products: any[];
//   onQuantityChange: (id: number, delta: number) => void;
// }) {
//   return (
//     <>
//       <div className="flex flex-col gap-3 p-5">
//         <div>상품 {products.length}개</div>
//         {products.map(product => (
//           <ShoppingCartCard
//             key={product.id}
//             {...product}
//             onIncrease={() => onQuantityChange(product.id, 1)}
//             onDecrease={() => onQuantityChange(product.id, -1)}
//           />
//         ))}
//         <Button2 type={"BrandInverse"} text={"상품 추가"} />
//       </div>
//       <PriceCheckCard />
//     </>
//   );
// }

// export default ShoppingCartPage;

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import BottomButton from "@/components/BottomButton/BottomButton";
// import Button2 from "@/components/Button/Button";
// import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
// import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
// import TopNavigator from "@/components/TopNavigator/TopNavigator";

// function ShoppingCartPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       trashable: true,
//       title: "Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 3,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//     {
//       id: 2,
//       trashable: false,
//       title: "Non-Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 4,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//   ]);

//   const handleQuantityChange = (id: number, delta: number) => {
//     setProducts(prev =>
//       prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)),
//     );
//   };

//   const handleNextButtonClick = () => {
//     // 현재 api 오류로 주석처리
//     router.push("/cart/checkorder");
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <TopNavigator title="장바구니" />
//       <div className="flex-1 overflow-y-auto pb-[100px]">
//         <ProductInfo products={products} onQuantityChange={handleQuantityChange} />
//       </div>
//       <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white">
//         <BottomButton
//           type="textcombo+button"
//           textComboText={{ title: "100,000,000원", subtitle: "주문금액" }}
//           button1Text="다음"
//           button1Type="Brand"
//           onButton1Click={handleNextButtonClick}
//         />
//       </div>
//     </div>
//   );
// }

// function ProductInfo({
//   products,
//   onQuantityChange,
// }: {
//   products: any[];
//   onQuantityChange: (id: number, delta: number) => void;
// }) {
//   return (
//     <>
//       <div className="flex flex-col gap-3 p-5">
//         <div>상품 {products.length}개</div>
//         {products.map(product => (
//           <ShoppingCartCard
//             key={product.id}
//             {...product}
//             onIncrease={() => onQuantityChange(product.id, 1)}
//             onDecrease={() => onQuantityChange(product.id, -1)}
//           />
//         ))}
//         <Button2 type={"BrandInverse"} text={"상품 추가"} />
//       </div>
//       <PriceCheckCard />
//     </>
//   );
// }

// export default ShoppingCartPage;

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import BottomButton from "@/components/BottomButton/BottomButton";
// import Button2 from "@/components/Button/Button";
// import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
// import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
// import TopNavigator from "@/components/TopNavigator/TopNavigator";

// function ShoppingCartPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       trashable: true,
//       title: "Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 3,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//     {
//       id: 2,
//       trashable: false,
//       title: "Non-Trashable Product",
//       color: "한솔크림화이트",
//       width: "1800",
//       height: "1800",
//       hingeCount: 4,
//       hingeDirection: "우경",
//       boring: "상 40 하 100",
//       quantity: 0,
//     },
//   ]);

//   const handleQuantityChange = (id: number, delta: number) => {
//     setProducts(prev =>
//       prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)),
//     );
//   };

//   const handleNextButtonClick = () => {
//     // 현재 api 오류로 주석처리
//     router.push("/cart/checkorder");
//   };

//   return (
//     <div className="flex min-h-screen flex-col">
//       <TopNavigator title="장바구니" />
//       <div className="flex-1 overflow-y-auto pb-[100px]">
//         <ProductInfo products={products} onQuantityChange={handleQuantityChange} />
//       </div>
//       <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white">
//         <BottomButton
//           type="textcombo+button"
//           textComboText={{ title: "100,000,000원", subtitle: "주문금액" }}
//           button1Text="다음"
//           button1Type="Brand"
//           onButton1Click={handleNextButtonClick}
//         />
//       </div>
//     </div>
//   );
// }

// function ProductInfo({
//   products,
//   onQuantityChange,
// }: {
//   products: any[];
//   onQuantityChange: (id: number, delta: number) => void;
// }) {
//   return (
//     <>
//       <div className="flex flex-col gap-3 p-5">
//         <div>상품 {products.length}개</div>
//         {products.map(product => (
//           <ShoppingCartCard
//             key={product.id}
//             {...product}
//             onIncrease={() => onQuantityChange(product.id, 1)}
//             onDecrease={() => onQuantityChange(product.id, -1)}
//           />
//         ))}
//         <Button2 type={"BrandInverse"} text={"상품 추가"} />
//       </div>
//       <PriceCheckCard />
//     </>
//   );
// }

// export default ShoppingCartPage;

const DOOR_TYPE_KR_MAP: Record<string, string> = {
  normal: "일반문",
  flap: "플랩문",
  drawer: "서랍",
};

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

function ShoppingCartPage() {
  const router = useRouter();

  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const [cartGroups, setCartGroups] = useState<Record<string, OrderItem[]>>({});
  const [hasItems, setHasItems] = useState(false);

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
    setHasItems(cartItems.length > 0);

    const fetchDeliveryTime = async () => {
      if (address1 !== "주소 없음") {
        const { expectedArrivalMinutes } = await DeliverTime(address1);
        const cutoff = 18 * 60;
        const hours = String(Math.floor(expectedArrivalMinutes / 60)).padStart(2, "0");
        const minutes = String(expectedArrivalMinutes % 60).padStart(2, "0");

        if (expectedArrivalMinutes <= cutoff) {
          setDeliveryMessage(`당일배송 가능 ${hours}:${minutes}`);
          setDeliveryMessageColor("bg-[#cbdcfb] text-[#215cff]");
        } else {
          setDeliveryMessage("내일 배송되는 주소에요");
          setDeliveryMessageColor("bg-gray-500 text-[#bf6a02]");
        }
      }
    };

    fetchDeliveryTime();
  }, []);

  const getTotalPrice = () => {
    return Object.values(cartGroups)
      .flat()
      .reduce((sum, item) => {
        if (!item) return sum;
        return sum + (item.price ?? 0) * (item.count ?? 1);
      }, 0);
  };

  const handleCountChange = (category: string, index: number, newCount: number) => {
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
      return newGroups;
    });
  };

  const handleOrder = () => {
    router.push("/cart/checkorder");
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  if (!hasItems) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopNavigator title="장바구니" />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <img src="/icons/cart-empty.svg" alt="빈 장바구니" className="mb-6 h-20 w-20" />
          <p className="mb-4 text-center text-[17px] font-500 text-gray-700">
            장바구니에 담긴 상품이 없어요.
            <br />
            상품을 추가해보세요!
          </p>
          <button
            onClick={handleAddProduct}
            className="mt-2 w-full rounded-lg bg-gray-200 py-3 text-[15px] font-semibold text-black"
          >
            상품 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="장바구니" />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="px-5">
          <div className={`my-4 p-2 text-center font-medium ${deliveryMessageColor}`}>
            {deliveryMessage}
          </div>
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
                      title={DOOR_TYPE_KR_MAP[doorItem.slug ?? "normal"]} // 🔄 여기서 slug로 바꿈
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
                    />
                  );
                }

                if (category === "finish") {
                  const finishItem = item as FinishItem;
                  return (
                    <ShoppingCartCard
                      key={key}
                      title={"마감재"}
                      color={finishItem.color ?? ""}
                      width={""}
                      height={String(finishItem.height ?? "")}
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
            className="mt-2 w-full"
            onButton1Click={handleAddProduct}
          />
        </div>
        <PriceCheckCard />
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white">
        <BottomButton
          type="textcombo+button"
          textComboText={{
            title: `${getTotalPrice().toLocaleString()}원`,
            subtitle: "주문금액",
          }}
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={handleOrder}
        />
      </div>
    </div>
  );
}

export default ShoppingCartPage;
