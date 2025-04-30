"use client";

import useDoorStore from "@/store/doorStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";

export default function ConfirmPage() {
  const router = useRouter();
  const { doorItem, updatePriceAndCount } = useDoorStore();
  const [count, setCount] = useState(1);

  if (!doorItem.slug || !doorItem.width || !doorItem.height || !doorItem.hinge.hingeCount || doorItem.price === null) {
    return <p className="p-5">잘못된 접근입니다.</p>;
  }

  const total = doorItem.price * count;

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const newItem = {
      ...doorItem,
      count,
    };
    localStorage.setItem("cartItems", JSON.stringify([...existing, newItem]));
    alert("장바구니에 담았습니다.");
    router.push("/cart");
  };

  const handlePurchase = () => {
    alert("구매 기능은 준비 중입니다.");
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <h1 className="text-xl font-bold">문짝 주문 개수를 선택해주세요</h1>

      <div className="flex items-center justify-between">
        <span className="text-base font-medium">주문 개수</span>
        <div className="flex items-center border">
          <button onClick={() => setCount(c => Math.max(1, c - 1))}>－</button>
          <span className="px-4">{count}</span>
          <button onClick={() => setCount(c => c + 1)}>＋</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-base font-medium">가격</span>
        <span className="text-lg font-bold">{total.toLocaleString()}원</span>
      </div>

      <hr />

      <div className="text-sm leading-relaxed">
        <p className="font-semibold">문짝</p>
        <p>색상: {doorItem.color}</p>
        <p>가로 길이: {doorItem.width}mm</p>
        <p>세로 길이: {doorItem.height}mm</p>
        <p>경첩 개수: {doorItem.hinge.hingeCount}</p>
        <p>경첩 방향: {doorItem.hinge.hingePosition === "left" ? "좌경" : "우경"}</p>
        <p>
          보링 치수: 상{doorItem.hinge.topHinge}
          {doorItem.hinge.middleHinge ? `, 중${doorItem.hinge.middleHinge}` : ""}
          {doorItem.hinge.middleTopHinge ? `, 중상${doorItem.hinge.middleTopHinge}` : ""}
          {doorItem.hinge.middleBottomHinge ? `, 중하${doorItem.hinge.middleBottomHinge}` : ""}, 하{doorItem.hinge.bottomHinge}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 flex gap-2 bg-white p-5">
        <Button className="flex-1 bg-gray-200 text-black" onClick={handleAddToCart}>
          장바구니 담기
        </Button>
        <Button className="flex-1 bg-black text-white" onClick={handlePurchase}>
          바로 구매
        </Button>
      </div>
    </div>
  );
}
