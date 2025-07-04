"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import useDoorStore from "@/store/Items/doorStore";

function ConfirmPage() {
  const router = useRouter();
  const { doorItem, updatePriceAndCount } = useDoorStore();
  const [count, setCount] = useState(1);

  if (!doorItem.slug || !doorItem.width || !doorItem.height || doorItem.price === null) {
    return <p className="p-5">잘못된 접근입니다.</p>;
  }

  const total = doorItem.price * count;

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const newItem = {
      ...doorItem,
      count,
      price: total,
    };
    localStorage.setItem("cartItems", JSON.stringify([...existing, newItem]));
    alert("장바구니에 담았습니다.");
    router.push("/cart");
  };

  const handlePurchase = () => {
    updatePriceAndCount(total, count);
    router.push("/cart/now?category=door");
  };

  const currentCategory = DOOR_CATEGORY_LIST.find(item => item.slug === doorItem.slug);
  const header = currentCategory?.header || "문짝";

  return (
    <div className="flex flex-col gap-6 p-5 pb-[100px]">
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
        <p className="font-semibold">{header}</p>
        <p>색상: {doorItem.color}</p>
        <p>가로 길이: {doorItem.width}mm</p>
        <p>세로 길이: {doorItem.height}mm</p>
        {doorItem.hinge.hingeCount && <p>경첩 개수: {doorItem.hinge.hingeCount}</p>}
        {doorItem.hinge.hingePosition && (
          <p>경첩 방향: {doorItem.hinge.hingePosition === "left" ? "좌경" : "우경"}</p>
        )}
        {doorItem.slug !== "drawer" && (
          <p>
            보링 치수: 상{doorItem.hinge.topHinge}
            {doorItem.hinge.middleHinge ? `, 중${doorItem.hinge.middleHinge}` : ""}
            {doorItem.hinge.middleTopHinge ? `, 중상${doorItem.hinge.middleTopHinge}` : ""}
            {doorItem.hinge.middleBottomHinge ? `, 중하${doorItem.hinge.middleBottomHinge}` : ""},
            하{doorItem.hinge.bottomHinge}
          </p>
        )}
        {doorItem.doorRequest && <p>요청사항: {doorItem.doorRequest}</p>}
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
