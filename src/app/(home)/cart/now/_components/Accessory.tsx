"use client";

import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import { useEffect, useState } from "react";

import useAccessoryStore from "@/store/Items/accessoryStore";

function Accessory() {
  const { accessoryItem, updatePriceAndCount } = useAccessoryStore();
  const [count, setCount] = useState(accessoryItem.count ?? 1);
  const unitPrice = accessoryItem.price ?? 0;
  const total = unitPrice * count;

  useEffect(() => {
    updatePriceAndCount(unitPrice, count);
  }, [count]);

  const currentCategory = ACCESSORY_CATEGORY_LIST.find(item => item.slug === item.slug);
  const header = currentCategory?.header || "하드웨어";

  return (
    <>
      <div className="mb-4 border border-black bg-gray-200 p-4">
        <h2 className="mb-2 font-bold">{header}</h2>
        <div>
          <p>제조사 : {accessoryItem.madeBy}</p>
          <p>모델명 : {accessoryItem.model}</p>
          {accessoryItem.accessoryRequest && <p>요청 사항 : {accessoryItem.accessoryRequest}</p>}
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
      </div>

      <p className="font-medium">결제금액을 확인해주세요</p>
      <div className="mb-4 mt-1 rounded bg-gray-100 p-4">
        <div className="mt-2 flex justify-between">
          <span>총 금액</span>
          <span>{total.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>{header}</span>
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

export default Accessory;
