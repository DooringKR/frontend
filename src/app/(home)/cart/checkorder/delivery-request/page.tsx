"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Input from "@/components/Input/Input";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";

export default function DeliveryRequestPage() {
  const router = useRouter();

  const requestMessage = useOrderStore(state => state.requestMessage);
  const setRequestMessage = useOrderStore(state => state.setRequestMessage);
  const foyerAccessType = useOrderStore(state => state.foyerAccessType);
  const setFoyerAccessType = useOrderStore(state => state.setFoyerAccessType);

  const [tempPassword, setTempPassword] = useState(foyerAccessType.gatePassword || "");
  const [tempCustomRequest, setTempCustomRequest] = useState(foyerAccessType.customRequest || "");

  useEffect(() => {
    setTempPassword(foyerAccessType.gatePassword || "");
    setTempCustomRequest(foyerAccessType.customRequest || "");
  }, [foyerAccessType]);

  const handleSelect = (type: "gate" | "call" | "doorfront" | "custom") => {
    setFoyerAccessType({
      type,
      gatePassword: type === "gate" ? tempPassword : null,
      customRequest: type === "custom" ? tempCustomRequest : null,
    });
  };

  const handleSave = () => {
    if (foyerAccessType.type === "gate") {
      setFoyerAccessType({ type: "gate", gatePassword: tempPassword, customRequest: null });
      setRequestMessage("공동현관으로 올라오세요");
    } else if (foyerAccessType.type === "custom") {
      setFoyerAccessType({ type: "custom", gatePassword: null, customRequest: tempCustomRequest });
      setRequestMessage("직접 입력");
    } else if (foyerAccessType.type === "call") {
      setRequestMessage("전화주시면 마중 나갈게요");
    } else {
      setRequestMessage("문 앞에 두면 가져갈게요");
    }
    router.back();
  };

  return (
    <div className="flex h-screen flex-col bg-white pb-5">
      <TopNavigator />

      <div className="flex flex-grow flex-col">
        <h1 className="mx-5 mt-5 text-[23px] font-700">배송 시 요청사항</h1>

        <div className="mt-5 flex flex-col gap-3">
          <SelectToggleButton
            label="전화주시면 마중 나갈게요"
            onClick={() => handleSelect("call")}
            checked={foyerAccessType.type === "call"}
          />
          <SelectToggleButton
            label="문 앞에 두면 가져갈게요"
            onClick={() => handleSelect("doorfront")}
            checked={foyerAccessType.type === "doorfront"}
          />
          <div>
            <SelectToggleButton
              label="공동현관으로 올라오세요"
              onClick={() => handleSelect("gate")}
              checked={foyerAccessType.type === "gate"}
            />
            {foyerAccessType.type === "gate" && (
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
              label="직접 입력"
              onClick={() => handleSelect("custom")}
              checked={foyerAccessType.type === "custom"}
            />
            {foyerAccessType.type === "custom" && (
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
      <div className="px-5">
        <Button selected={true} onClick={handleSave} className="w-full rounded-md">
          저장하기
        </Button>
      </div>
    </div>
  );
}
