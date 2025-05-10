"use client";

import { useState } from "react";

import { FinishItem } from "@/store/Items/finishStore";

function Finish({ item }: { item: FinishItem }) {

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
      
    </>
  );
}

export default Finish;
