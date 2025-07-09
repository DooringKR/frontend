"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import useFinishStore from "@/store/Items/finishStore";

function ConfirmPage() {
  const router = useRouter();
  const { finishItem, updatePriceAndCount } = useFinishStore();
  const [count, setCount] = useState(1);

  if (!finishItem.depth.baseDepth || !finishItem.height.baseHeight || finishItem.price === null) {
    return <p className="p-5">잘못된 접근입니다.</p>;
  }

  const total = finishItem.price * count;

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const newItem = {
      ...finishItem,
      count,
      price: total,
    };
    localStorage.setItem("cartItems", JSON.stringify([...existing, newItem]));
    alert("장바구니에 담았습니다.");
    router.push("/cart");
  };

  const handlePurchase = () => {
    updatePriceAndCount(total, count);
    router.push("/cart/now?category=finish");
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-20">
      <h1 className="text-xl font-bold">마감재 주문 개수를 선택해주세요</h1>
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
        <p>색상 : {finishItem.color}</p>
        <p>깊이 : {finishItem.depth.baseDepth?.toLocaleString()}mm</p>
        {finishItem.depth.additionalDepth && (
          <p>⤷ 깊이 키움 : {finishItem.depth.additionalDepth?.toLocaleString()}mm</p>
        )}
        <p>높이 : {finishItem.height.baseHeight?.toLocaleString()}mm</p>
        {finishItem.height.additionalHeight && (
          <p>⤷ 높이 키움 : {finishItem.height.additionalHeight?.toLocaleString()}mm</p>
        )}
        {finishItem.finishRequest && <p>요청 사항 : {finishItem.finishRequest}</p>}
      </div>
      <div className="fixed bottom-[68px] left-0 right-0 z-10 flex gap-2 bg-white p-5">
        <Button className="flex-1" onClick={handleAddToCart}>
          장바구니 담기
        </Button>
        <Button selected={true} className="flex-1" onClick={handlePurchase}>
          바로 구매
        </Button>
      </div>
    </div>
  );
}

export default ConfirmPage;
