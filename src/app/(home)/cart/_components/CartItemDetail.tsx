"use client";

import { AccessoryItem, CabinetItem, DoorItem, FinishItem, HardwareItem } from "@/types/itemTypes";

import Accessory from "./Accessory";
import Cabinet from "./Cabinet";
import Door from "./Door";
import Finish from "./Finish";
import Hardware from "./Hardware";

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

interface CartItemDetailProps {
  item: OrderItem;
  onCountChange: (newCount: number) => void;
}

export default function CartItemDetail({ item, onCountChange }: CartItemDetailProps) {
  if (!item) return null;

  const total = (item.price ?? 0) * (item.count ?? 1);

  return (
    <div className="relative rounded border border-gray-300 bg-gray-50 p-4">
      {item.category === "door" && <Door item={item} />}
      {item.category === "finish" && <Finish item={item} />}
      {item.category === "cabinet" && <Cabinet item={item} />}
      {item.category === "accessory" && <Accessory item={item} />}
      {item.category === "hardware" && <Hardware item={item} />}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-bold">{total.toLocaleString()}원</div>
        <div className="flex items-center rounded border border-black bg-white">
          <button
            className="px-3 py-1"
            onClick={() => onCountChange(Math.max(1, (item.count ?? 1) - 1))}
          >
            －
          </button>
          <span className="px-4">{item.count}</span>
          <button className="px-3 py-1" onClick={() => onCountChange((item.count ?? 1) + 1)}>
            ＋
          </button>
        </div>
      </div>
    </div>
  );
}
