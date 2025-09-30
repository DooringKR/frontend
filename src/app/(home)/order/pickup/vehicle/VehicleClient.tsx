"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Input from "@/components/Input/Input";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

export default function VehicleClientPage() {
  const router = useRouter();

  const order = useOrderStore(state => state.order);
  const updateOrder = useOrderStore(state => state.updateOrder);

  const [tempVehicleType, setTempVehicleType] = useState(order?.vehicle_type || "");
  const [tempCustomNote, setTempCustomNote] = useState(order?.vehicle_type_direct_input || "");

  useEffect(() => {
    setTempVehicleType(order?.vehicle_type || "");
    setTempCustomNote(order?.vehicle_type_direct_input || "");
  }, [order]);

  const handleSelect = (type: string) => {
    setTempVehicleType(type);
  };

  const handleSave = () => {
    updateOrder({
      vehicle_type: tempVehicleType,
      vehicle_type_direct_input: tempVehicleType === VehicleType.DIRECT_INPUT ? tempCustomNote : null,
    });
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pb-5">
      <TopNavigator />

      <div className="flex-1 flex-col overflow-y-auto">
        <h1 className="mx-5 mt-5 text-[23px] font-700">픽업차량 종류</h1>

        <div className="mx-1 mt-5 flex flex-col gap-3">
          <SelectToggleButton
            label="트럭"
            onClick={() => handleSelect(VehicleType.TRUCK)}
            checked={tempVehicleType === VehicleType.TRUCK}
          />
          <SelectToggleButton
            label="승용차"
            onClick={() => handleSelect(VehicleType.CAR)}
            checked={tempVehicleType === VehicleType.CAR}
          />

          <div>
            <SelectToggleButton
              label="직접 입력"
              onClick={() => handleSelect(VehicleType.DIRECT_INPUT)}
              checked={tempVehicleType === VehicleType.DIRECT_INPUT}
            />
            {tempVehicleType === VehicleType.DIRECT_INPUT && (
              <div className="flex gap-2 px-4">
                <div className="mx-2 h-12 w-1 rounded-full bg-gray-200"></div>
                <div className="flex flex-1 flex-col">
                  <Input
                    label=""
                    name="customVehicleNote"
                    type="text"
                    value={tempCustomNote}
                    onChange={e => setTempCustomNote(e.target.value)}
                    placeholder="예: 흰색 다마스"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-[460px] bg-white px-5 py-4">
        <Button
          selected={true}
          onClick={handleSave}
          className="w-full rounded-md"
          disabled={
            tempVehicleType === "" ||
            (tempVehicleType === VehicleType.DIRECT_INPUT && tempCustomNote.trim() === "")
          }
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
