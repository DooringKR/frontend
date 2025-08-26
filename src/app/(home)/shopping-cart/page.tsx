"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button2 from "@/components/Button/Button";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceCheckCard from "@/components/PriceCheckCard/PriceCheckCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function ShoppingCartPage() {
  const router = useRouter();
  const [products, setProducts] = useState([
    {
      id: 1,
      trashable: true,
      title: "Trashable Product",
      color: "한솔크림화이트",
      width: "1800",
      height: "1800",
      hingeCount: 3,
      hingeDirection: "우경",
      boring: "상 40 하 100",
      quantity: 0,
    },
    {
      id: 2,
      trashable: false,
      title: "Non-Trashable Product",
      color: "한솔크림화이트",
      width: "1800",
      height: "1800",
      hingeCount: 4,
      hingeDirection: "우경",
      boring: "상 40 하 100",
      quantity: 0,
    },
  ]);

  const handleQuantityChange = (id: number, delta: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p)),
    );
  };

  const handleNextButtonClick = () => {
    // 현재 api 오류로 주석처리
    router.push("/cart/checkorder");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div>잘못된 접근입니다.</div>
      {/* <TopNavigator title="장바구니" />
      <div className="flex-1 overflow-y-auto pb-[100px]">
        <ProductInfo products={products} onQuantityChange={handleQuantityChange} />
      </div>
      <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 bg-white">
        <BottomButton
          type="textcombo+button"
          textComboText={{ title: "100,000,000원", subtitle: "주문금액" }}
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={handleNextButtonClick}
        />
      </div> */}
    </div>
  );
}

function ProductInfo({
  products,
  onQuantityChange,
}: {
  products: any[];
  onQuantityChange: (id: number, delta: number) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 p-5">
        <div>상품 {products.length}개</div>
        {products.map(product => (
          <ShoppingCartCard
            key={product.id}
            {...product}
            onIncrease={() => onQuantityChange(product.id, 1)}
            onDecrease={() => onQuantityChange(product.id, -1)}
          />
        ))}
        <Button2 type={"BrandInverse"} text={"상품 추가"} />
      </div>
      <PriceCheckCard />
    </>
  );
}

export default ShoppingCartPage;
