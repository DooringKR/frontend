"use client";

import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { CABINET_ITEMS_NAME } from "@/constants/modelList";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";

import useCabinetStore from "@/store/Items/cabinetStore";

function ConfirmPage() {
  const router = useRouter();
  const { cabinetItem, updatePriceAndCount } = useCabinetStore();
  const [count, setCount] = useState(1);

  if (
    !cabinetItem.slug ||
    !cabinetItem.width ||
    !cabinetItem.height ||
    !cabinetItem.depth ||
    !cabinetItem.finishType ||
    !cabinetItem.drawerType ||
    !cabinetItem.railType ||
    cabinetItem.price === null
  ) {
    return <p className="p-5">잘못된 접근입니다.</p>;
  }

  const total = cabinetItem.price * count;

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const newItem = {
      ...cabinetItem,
      count,
      price: total,
    };
    localStorage.setItem("cartItems", JSON.stringify([...existing, newItem]));
    alert("장바구니에 담았습니다.");
    router.push("/cart");
  };

  const handlePurchase = () => {
    updatePriceAndCount(total, count);
    router.push("/cart/now?category=cabinet");
  };

  const currentCategory = CABINET_CATEGORY_LIST.find(item => item.slug === cabinetItem.slug);
  const header = currentCategory?.header || "부분장";

  return (
    <div className="flex flex-col gap-6 p-5 pb-20">
      <h1 className="text-xl font-bold">부분장 주문 개수를 선택해주세요</h1>

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
        <p className="pb-2 font-semibold">{header}</p>
        <p>부분장 종류: {header}</p>
        {cabinetItem.handleType && <p>손잡이 종류: {CABINET_ITEMS_NAME[cabinetItem.handleType]}</p>}
        {cabinetItem.compartmentCount !== 0 && <p>구성 칸 수: {cabinetItem.compartmentCount}</p>}
        {cabinetItem.flapStayType && <p>쇼바 종류: {cabinetItem.flapStayType}</p>}
        <p>색상: {cabinetItem.color}</p>
        <p>두께: {cabinetItem.thickness}</p>
        <p>너비: {cabinetItem.width}mm</p>
        <p>깊이: {cabinetItem.depth}mm</p>
        <p>높이: {cabinetItem.height}mm</p>
        <p>마감 방식: {CABINET_ITEMS_NAME[cabinetItem.finishType]}</p>
        <p>서랍 종류: {cabinetItem.drawerType}</p>
        <p>레일 종류: {cabinetItem.railType}</p>
        {cabinetItem.cabinetRequests && <p>기타 요청 사항: {cabinetItem.cabinetRequests}</p>}
      </div>

      <div className="fixed bottom-[68px] left-0 right-0 z-10 flex gap-2 bg-white p-5">
        {/* <Button className="flex-1" onClick={handleAddToCart}>
          장바구니 담기
        </Button>
        <Button selected={true} className="flex-1" onClick={handlePurchase}>
          바로 구매
        </Button> */}
      </div>
    </div>
  );
}

import html2canvas from "html2canvas";
import { useRef } from "react";

const ref = useRef<HTMLDivElement>(null);
const captureImage = async () => {
  if (!ref.current) return;
  const canvas = await html2canvas(ref.current);
  const dataUrl = canvas.toDataURL("image/png");
  // dataUrl: "data:image/png;base64,..."  
};

export default ConfirmPage;
