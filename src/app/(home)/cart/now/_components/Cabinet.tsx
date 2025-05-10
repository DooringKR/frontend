"use client";

import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { CABINET_ITEMS_NAME } from "@/constants/modelList";
import { useEffect, useState } from "react";

import useCabinetStore from "@/store/Items/cabinetStore";

function Cabinet() {
  const { cabinetItem, updatePriceAndCount } = useCabinetStore();
  const [count, setCount] = useState(cabinetItem.count ?? 1);
  const unitPrice = cabinetItem.price ?? 0;
  const total = unitPrice * count;

  useEffect(() => {
    updatePriceAndCount(unitPrice, count);
  }, [count]);

  const currentCategory = CABINET_CATEGORY_LIST.find(e => e.slug === cabinetItem.slug);
  const header = currentCategory?.header || "부분장";

  return (
    <>
      <div className="mb-4 border border-black bg-gray-200 p-4">
        <h2 className="mb-2 font-bold">{header}</h2>
        {cabinetItem.handleType && <p>손잡이 종류: {CABINET_ITEMS_NAME[cabinetItem.handleType]}</p>}
        {cabinetItem.compartmentCount !== 0 && <p>구성 칸 수: {cabinetItem.compartmentCount}</p>}
        {cabinetItem.flapStayType && <p>쇼바 종류: {cabinetItem.flapStayType}</p>}
        <p>색상: {cabinetItem.color}</p>
        <p>두께: {cabinetItem.thickness}</p>
        <p>너비: {cabinetItem.width}mm</p>
        <p>깊이: {cabinetItem.depth}mm</p>
        <p>높이: {cabinetItem.height}mm</p>
        <p>
          마감 방식:{" "}
          {cabinetItem.finishType ? CABINET_ITEMS_NAME[cabinetItem.finishType] : "선택 안됨"}
        </p>
        <p>서랍 종류: {cabinetItem.drawerType}</p>
        <p>레일 종류: {cabinetItem.railType}</p>
        {cabinetItem.cabinetRequests && <p>기타 요청 사항: {cabinetItem.cabinetRequests}</p>}
        <p className="pt-6 text-xl font-semibold">{cabinetItem.price?.toLocaleString()}원</p>

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
          <span>부분장</span>
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

export default Cabinet;
