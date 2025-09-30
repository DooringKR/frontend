"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Input from "@/components/Input/Input";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

export default function DeliveryRequestClientPage() {
  const router = useRouter();

  const delivery_method = useOrderStore(state => state.order?.delivery_method);
  const delivery_method_direct_input = useOrderStore(state => state.order?.delivery_method_direct_input);
  const gate_password = useOrderStore(state => state.order?.gate_password);

  const [tempPassword, setTempPassword] = useState(gate_password || "");
  const [tempCustomRequest, setTempCustomRequest] = useState(delivery_method_direct_input || "");

  useEffect(() => {
    setTempPassword(gate_password || "");
    setTempCustomRequest(delivery_method_direct_input || "");
  }, [gate_password, delivery_method_direct_input]);

  const handleSelect = (type: DeliveryMethod.OPEN_GATE | DeliveryMethod.CALL | DeliveryMethod.LEAVE_DOOR | DeliveryMethod.DIRECT_INPUT) => {
    useOrderStore.getState().updateOrder({
      delivery_method: type,
      gate_password: type === DeliveryMethod.OPEN_GATE ? tempPassword : null,
      delivery_method_direct_input: type === DeliveryMethod.DIRECT_INPUT ? tempCustomRequest : null,
    });
  };

  const handleSave = () => {
    if (delivery_method === DeliveryMethod.OPEN_GATE) {
      useOrderStore.getState().updateOrder({ delivery_method: DeliveryMethod.OPEN_GATE, gate_password: tempPassword, delivery_method_direct_input: null });
    } else if (delivery_method === DeliveryMethod.DIRECT_INPUT) {
      useOrderStore.getState().updateOrder({ delivery_method: DeliveryMethod.DIRECT_INPUT, gate_password: null, delivery_method_direct_input: tempCustomRequest });
    } else if (delivery_method === DeliveryMethod.CALL) {
      useOrderStore.getState().updateOrder({ delivery_method: DeliveryMethod.CALL, gate_password: null, delivery_method_direct_input: null });
    } else if (delivery_method === DeliveryMethod.LEAVE_DOOR) {
      useOrderStore.getState().updateOrder({ delivery_method: DeliveryMethod.LEAVE_DOOR, gate_password: null, delivery_method_direct_input: null });
    } else {
      useOrderStore.getState().updateOrder({ delivery_method: null, gate_password: null, delivery_method_direct_input: null });
    }
    router.back();
  };
  const isSaveDisabled =
    !delivery_method ||
    (delivery_method === DeliveryMethod.DIRECT_INPUT && tempCustomRequest.trim() === "") ||
    (delivery_method === DeliveryMethod.OPEN_GATE && tempPassword.trim() === "");
  return (
    <div className="flex h-screen flex-col bg-white pb-5">
      <TopNavigator />

      <div className="flex-1 overflow-y-auto bg-white px-5 pb-36">
        <h1 className="mx-5 mt-5 text-[23px] font-700">배송 시 요청사항</h1>

        <div className="mt-5 flex flex-col gap-3">
          <SelectToggleButton
            label={DeliveryMethod.CALL.toString()}
            onClick={() => handleSelect(DeliveryMethod.CALL)}
            checked={delivery_method === DeliveryMethod.CALL}
          />
          <SelectToggleButton
            label={DeliveryMethod.LEAVE_DOOR.toString()}
            onClick={() => handleSelect(DeliveryMethod.LEAVE_DOOR)}
            checked={delivery_method === DeliveryMethod.LEAVE_DOOR}
          />
          <div>
            <SelectToggleButton
              label={DeliveryMethod.OPEN_GATE.toString()}
              onClick={() => handleSelect(DeliveryMethod.OPEN_GATE)}
              checked={delivery_method === DeliveryMethod.OPEN_GATE}
            />
            {delivery_method === DeliveryMethod.OPEN_GATE && (
              <div className="flex gap-2 px-4">
                <div className="mx-2 h-[76px] w-1 rounded-full bg-gray-200"></div>
                <div className="flex flex-1 flex-col">
                  <Input
                    label="공동현관 출입번호"
                    name="gatePassword"
                    type="text"
                    value={tempPassword}
                    onChange={e => setTempPassword(e.target.value)}
                    placeholder="예: #1234"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <SelectToggleButton
              label={DeliveryMethod.DIRECT_INPUT.toString()}
              onClick={() => handleSelect(DeliveryMethod.DIRECT_INPUT)}
              checked={delivery_method === DeliveryMethod.DIRECT_INPUT}
            />
            {delivery_method === DeliveryMethod.DIRECT_INPUT && (
              <div className="flex gap-2 px-4">
                <div className="mx-2 h-12 w-1 rounded-full bg-gray-200"></div>
                <div className="flex flex-1 flex-col">
                  <Input
                    label=""
                    name="customRequest"
                    type="text"
                    value={tempCustomRequest}
                    onChange={e => setTempCustomRequest(e.target.value)}
                    placeholder="예: 조심히 배송해주세요."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-[460px] p-5">
        <Button
          selected={true}
          onClick={handleSave}
          className="w-full rounded-md"
          disabled={isSaveDisabled}
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
