"use client";

import { DoorItem } from "@/store/Items/doorStore";
import { useState } from "react";

function Door({ item }: { item: DoorItem }) {
  const [count, setCount] = useState(item?.count ?? 1);
  if (!item) return null;

  const total = (item.price ?? 0) * count;

  return (
    <>
          <h2 className="mb-3 text-lg font-semibold">문짝</h2>
          <div className="flex justify-between">
            <div>
              <p>색상 : {item.color}</p>
              <p>가로 길이 : {item.width?.toLocaleString()}mm</p>
              <p>세로 길이 : {item.height?.toLocaleString()}mm</p>
              <p>경첩 개수 : {item.hinge?.hingeCount ?? "-"}</p>
              <p>경첩 방향 : {item.hinge?.hingePosition === "left" ? "좌경" : "우경"}</p>
              <p>
                보링 치수 : 상{item.hinge?.topHinge ?? "-"}
                {item.hinge?.middleHinge ? `, 중${item.hinge.middleHinge}` : ""}
                {item.hinge?.bottomHinge ? `, 하${item.hinge.bottomHinge}` : ""}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mt-4 text-lg font-bold">{total.toLocaleString()}원</div>
            <div className="mt-4 flex justify-between">
              <div className="flex items-center rounded border border-black bg-white">
                <button
                  className="px-3 py-1"
                  onClick={() => setCount(prev => Math.max(1, prev - 1))}
                >
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

export default Door;
