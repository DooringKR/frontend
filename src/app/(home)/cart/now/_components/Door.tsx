"use client";

import { useEffect, useState } from "react";

import useDoorStore from "@/store/Items/doorStore";

function Door() {
  const { doorItem, updatePriceAndCount } = useDoorStore();
  const [count, setCount] = useState(doorItem.count ?? 1);
  const unitPrice = doorItem.price ?? 0;
  const total = unitPrice * count;

  useEffect(() => {
    updatePriceAndCount(unitPrice, count);
  }, [count]);

  return (
    <>
      <div className="mb-4 border border-black bg-gray-200 p-4">
        <h2 className="mb-2 font-bold">문짝</h2>
        <p>색상: {doorItem.color}</p>
        <p>가로 길이: {doorItem.width}mm</p>
        <p>세로 길이: {doorItem.height}mm</p>
        <p>경첩 개수: {doorItem.hinge.hingeCount}개</p>
        <p>경첩 방향: {doorItem.hinge.hingePosition === "left" ? "좌경첩" : "우경첩"}</p>
        <p>
          보링 치수: 상{doorItem.hinge.topHinge}
          {doorItem.hinge.middleHinge ? `, 중${doorItem.hinge.middleHinge}` : ""}
          {doorItem.hinge.middleTopHinge ? `, 중상${doorItem.hinge.middleTopHinge}` : ""}
          {doorItem.hinge.middleBottomHinge ? `, 중하${doorItem.hinge.middleBottomHinge}` : ""}, 하
          {doorItem.hinge.bottomHinge}
        </p>
        <p className="pt-6 text-xl font-semibold">{doorItem.price?.toLocaleString()}원</p>

        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center rounded border border-black bg-white">
            <button className="px-3 py-1" onClick={() => setCount(prev => Math.max(1, prev - 1))}>
              －
            </button>
            <span className="px-4">{count}</span>
            <button className="px-3 py-1" onClick={() => setCount(prev => prev + 1)}>
              ＋
            </button>
          </div>
        </div>
      </div>
      <p className="font-medium">결제금액을 확인해주세요</p>
      <div className="mb-4 mt-1 rounded bg-gray-100 p-4">
        <div className="mt-2 flex justify-between">
          <span>총 금액</span>
          <span>{total.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>문짝</span>
          <span>{total.toLocaleString()}원</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold">
          <span>결제예정금액</span>
          <span>{total.toLocaleString()}원</span>
        </div>
      </div>
    </>
  );
}

export default Door;
