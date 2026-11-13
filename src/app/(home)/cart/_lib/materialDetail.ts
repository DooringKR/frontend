import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { LongDoor } from "dooring-core-domain/dist/models/CompositeProducts/LongDoor";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";

import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { supabase } from "@/lib/supabase";

/** 품목 종류 → 자재 표 이름 */
const TABLE: Partial<Record<DetailProductType, string>> = {
  [DetailProductType.DOOR]: "Door",
  [DetailProductType.FINISH]: "Finish",
  [DetailProductType.UPPERCABINET]: "UpperCabinet",
  [DetailProductType.LOWERCABINET]: "LowerCabinet",
  [DetailProductType.TALLCABINET]: "TallCabinet",
  [DetailProductType.FLAPCABINET]: "FlapCabinet",
  [DetailProductType.DRAWERCABINET]: "DrawerCabinet",
  [DetailProductType.OPENCABINET]: "OpenCabinet",
  [DetailProductType.ACCESSORY]: "Accessory",
  [DetailProductType.HINGE]: "Hinge",
  [DetailProductType.RAIL]: "Rail",
  [DetailProductType.PIECE]: "Piece",
  [DetailProductType.LONGDOOR]: "LongDoor",
};

/**
 * 장바구니·주문 항목 하나의 자재 상세(롱문이면 딸린 문들까지) — 장바구니·주문 상세가 같은 switch 를 복사해 쓰던 것을 하나로.
 * 못 읽으면 detail null(장바구니 카드는 그 항목을 그리지 않고, 주문 상세는 빈 값으로 그린다 — 예전과 같음).
 */
// ponytail: 항목마다 따로 읽음(N+1). 항목이 많아지면 표별로 묶어 in() 한 번씩
export async function fetchMaterialDetail(
  type: DetailProductType,
  id: string | null | undefined,
): Promise<{ detail: any | null; relatedDoors?: Door[] }> {
  const table = TABLE[type];
  if (!table || !id) return { detail: null };
  try {
    const raw = await new CrudInteriorMaterialsUsecase(new InteriorMaterialsSupabaseRepository<any>(table)).findById(id);
    if (type !== DetailProductType.LONGDOOR) return { detail: raw };
    const longDoor = raw ? LongDoor.fromDB(raw) : null;
    if (!longDoor?.id) return { detail: longDoor };
    const { data, error } = await supabase
      .from("Door")
      .select("*")
      .eq("long_door_id", longDoor.id)
      .order("long_door_order", { ascending: true });
    return { detail: longDoor, relatedDoors: !error && data ? data.map((d: any) => Door.fromDB(d)) : [] };
  } catch (e) {
    console.error("자재 상세 읽기 실패", e);
    return { detail: null };
  }
}
