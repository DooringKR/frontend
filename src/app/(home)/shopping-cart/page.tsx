"use client";

import React, { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button2 from "@/components/Button/Button2";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function ShoppingCartPage() {
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

  return (
    <div>
      <TopNavigator title="장바구니" />
      <ProductInfo products={products} onQuantityChange={handleQuantityChange} />
      <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2">
        <BottomButton type="1button" button1Text="다음" button1Type="Brand" />
      </div>
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
  );
}

export default ShoppingCartPage;
