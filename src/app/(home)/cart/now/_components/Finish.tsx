"use client";

import { useEffect, useState } from "react";

import useFinishStore from "@/store/Items/finishStore";

function Finish() {
  const { finishItem, updatePriceAndCount } = useFinishStore();
  const [count, setCount] = useState(finishItem.count ?? 1);
  const unitPrice = finishItem.price ?? 0;
  const total = unitPrice * count;

  useEffect(() => {
    updatePriceAndCount(unitPrice, count);
  }, [count]);

  return (
    <>
      <div className="mb-4 border border-black bg-gray-200 p-4">
        <h2 className="mb-2 font-bold">마감재</h2>
        <div>
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
          <span>마감재</span>
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

export default Finish;
