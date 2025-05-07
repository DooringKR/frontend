// utils/getCurrentItemByCategory.ts
import useDoorStore from "@/store/Items/doorStore";
import useFinishStore from "@/store/Items/finishStore";
import useCabinetStore from "@/store/Items/cabinetStore";
import useAccessoryStore from "@/store/Items/accessoryStore";
import useHardwareStore from "@/store/Items/hardwareStore";

export function getCurrentItemByCategory(category: string) {
  switch (category) {
    case "door":
      return useDoorStore.getState().doorItem;
    case "finish":
      return useFinishStore.getState().finishItem;
    case "cabinet":
      return useCabinetStore.getState().cabinetItem;
    case "accessory":
      return useAccessoryStore.getState().accessoryItem;
    case "hardware":
      return useHardwareStore.getState().hardwareItem;
    default:
      return null;
  }
}
