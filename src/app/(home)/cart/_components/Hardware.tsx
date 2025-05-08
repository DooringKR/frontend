"use client";

import { useState } from "react";

import { HardwareItem } from "@/store/Items/hardwareStore";
import { HARDWARE_CATEGORY_LIST } from "@/constants/category";

function Hardware({ item }: { item: HardwareItem }) {
  const [count, setCount] = useState(item?.count ?? 1);
  if (!item) return null;

  const total = (item.price ?? 0) * count;

  const currentCategory = HARDWARE_CATEGORY_LIST.find(item => item.slug === item.slug);
  const header = currentCategory?.header || "부속";


  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">{header}</h2>
      <div className="flex justify-between">
        <div>
          <p>제조사 : {item.madeBy}</p>
          <p>모델명 : {item.model}</p>
          {item.hardwareRequests && <p>요청 사항 : {item.hardwareRequests}</p>}
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

export default Hardware;
