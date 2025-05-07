"use";

import { useState } from "react";

import { AccessoryItem } from "@/store/Items/accessoryStore";
import { CabinetItem } from "@/store/Items/cabinetStore";
import { DoorItem } from "@/store/Items/doorStore";
import { FinishItem } from "@/store/Items/finishStore";
import { HardwareItem } from "@/store/Items/hardwareStore";

import Door from "./Door";
import Finish from "./Finish";
import Cabinet from "./Cabinet";
import Accessory from "./Accessory";
import Hardware from "./Hardware";

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

export default function CartItemDetail({ item }: { item: OrderItem }) {
  const [count, setCount] = useState(item?.count ?? 1);
  if (!item) return null;

  const total = (item.price ?? 0) * count;

  return (
    <div className="relative rounded border border-gray-300 bg-gray-50 p-4">
      {item.category === "door" && <Door item={item} />}
      {item.category === "finish" && <Finish item={item} />}
      {item.category === "cabinet" && <Cabinet item={item} />}
      {item.category === "accessory" && <Accessory item={item} />}
      {item.category === "hardware" && <Hardware item={item} />}
    </div>
  );
}
