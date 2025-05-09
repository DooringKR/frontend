"use client";

import { CABINET_ITEMS_NAME } from "@/constants/modelList";
import { useState } from "react";

import { CabinetItem } from "@/store/Items/cabinetStore";

function Cabinet({ item }: { item: CabinetItem }) {
  const [count, setCount] = useState(item?.count ?? 1);
  if (!item) return null;

  const total = (item.price ?? 0) * count;

  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">부분장</h2>
      <div className="flex justify-between">
        <div>
          {item.handleType && <p>손잡이 종류: {CABINET_ITEMS_NAME[item.handleType]}</p>}
          {item.compartmentCount !== 0 && <p>구성 칸 수: {item.compartmentCount}</p>}
          {item.flapStayType && <p>쇼바 종류: {item.flapStayType}</p>}
          <p>색상: {item.color}</p>
          <p>두께: {item.thickness}</p>
          <p>너비: {item.width}mm</p>
          <p>깊이: {item.depth}mm</p>
          <p>높이: {item.height}mm</p>
          <p>마감 방식: {item.finishType ? CABINET_ITEMS_NAME[item.finishType] : "선택 안됨"}</p>
          <p>서랍 종류: {item.drawerType}</p>
          <p>레일 종류: {item.railType}</p>
          {item.cabinetRequests && <p>기타 요청 사항: {item.cabinetRequests}</p>}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="mt-4 text-lg font-bold">{total.toLocaleString()}원</div>
        <div className="mt-4 flex justify-between">
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
    </>
  );
}

export default Cabinet;
