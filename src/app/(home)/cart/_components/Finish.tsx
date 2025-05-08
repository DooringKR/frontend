"use client";

import { useState } from "react";

import { FinishItem } from "@/store/Items/finishStore";

function Finish({ item }: { item: FinishItem }) {
  const [count, setCount] = useState(item?.count ?? 1);
  if (!item) return null;

  const total = (item.price ?? 0) * count;

  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">마감재</h2>
      <div className="flex justify-between">
        <div>
          <p>색상 : {item.color}</p>
          <p>깊이 : {item.depth.baseDepth?.toLocaleString()}mm</p>
          {item.depth.additionalDepth && (
            <p>⤷ 깊이 키움 : {item.depth.additionalDepth?.toLocaleString()}mm</p>
          )}
          <p>높이 : {item.height.baseHeight?.toLocaleString()}mm</p>
          {item.height.additionalHeight && (
            <p>⤷ 높이 키움 : {item.height.additionalHeight?.toLocaleString()}mm</p>
          )}
          {item.finishRequest && <p>요청 사항 : {item.finishRequest}</p>}
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

export default Finish;
