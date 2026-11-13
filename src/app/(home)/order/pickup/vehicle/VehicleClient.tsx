"use client";

import { VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import BottomBar from "@/components/overlay/BottomBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { goAfterSave } from "@/lib/nav/go";
import { useOrderStore } from "@/store/orderStore";

const OPTIONS = [VehicleType.TRUCK, VehicleType.CAR, VehicleType.DIRECT_INPUT].map((v) => ({ value: v, label: v }));

/** 픽업차량 종류 — 고르고 「저장하기」로 주문에 넣는다 */
export default function VehicleClientPage() {
  const router = useRouter();
  const order = useOrderStore((s) => s.order);
  const updateOrder = useOrderStore((s) => s.updateOrder);

  const [vehicle, setVehicle] = useState<VehicleType | null>(order?.vehicle_type || null);
  const [note, setNote] = useState(order?.vehicle_type_direct_input || "");
  useEffect(() => {
    setVehicle(order?.vehicle_type || null);
    setNote(order?.vehicle_type_direct_input || "");
  }, [order?.vehicle_type, order?.vehicle_type_direct_input]);

  const req = useRequired({
    vehicle: !!vehicle,
    note: vehicle !== VehicleType.DIRECT_INPUT || !!note.trim() || "차량을 넣어 주세요",
  });

  return (
    <div className="flex min-h-screen flex-col bg-white pb-5 pt-[60px]">
      <TopNavigator backTo="/order/pickup" />
      <div className="flex-1 flex-col overflow-y-auto px-5 pb-20">
        <h1 className="mt-5 text-[23px] font-700">픽업차량 종류</h1>
        <Field className="mt-5" fieldRef={req.ref("vehicle")} error={req.error("vehicle")}>
          <Choose aria-label="픽업차량 종류" value={vehicle} onChange={setVehicle} options={OPTIONS} />
          {vehicle === VehicleType.DIRECT_INPUT && (
            <Field fieldRef={req.ref("note")} error={req.error("note")}>
              <Input aria-invalid={!!req.error("note")} value={note} onChange={(e) => setNote(e.target.value)} placeholder="예: 흰색 다마스" />
            </Field>
          )}
        </Field>
      </div>
      <BottomBar>
        <Button
          onClick={() => {
            if (!req.check()) return;
            updateOrder({ vehicle_type: vehicle, vehicle_type_direct_input: vehicle === VehicleType.DIRECT_INPUT ? note : null });
            goAfterSave(router, "/order/pickup");
          }}
        >
          저장하기
        </Button>
      </BottomBar>
    </div>
  );
}
