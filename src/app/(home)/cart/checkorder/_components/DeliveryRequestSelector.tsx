"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

interface Props {
  requestMessage: string;
  setRequestMessage: (message: string) => void;
  foyerAccessType: {
    type: "gate" | "call" | "doorfront" | "custom";
    gatePassword: string | null;
    customRequest: string | null;
  };
  setFoyerAccessType: (data: {
    type: "gate" | "call" | "doorfront" | "custom";
    gatePassword: string | null;
    customRequest: string | null;
  }) => void;
}

export default function DeliveryRequestSelector({
  requestMessage,
  setRequestMessage,
  foyerAccessType,
  setFoyerAccessType,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState(foyerAccessType.gatePassword || "");
  const [tempCustomRequest, setTempCustomRequest] = useState(foyerAccessType.gatePassword || "");

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
    setIsModalOpen(false);
  };

  useEffect(() => {
    setTempPassword(foyerAccessType.gatePassword || "");
    setTempCustomRequest(foyerAccessType.customRequest || "");
  }, [foyerAccessType]);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-2">
          {/* <p className="text-sm font-medium">배송기사 요청사항</p> */}
          <p className="text-[17px] font-600">배송 시 요청사항</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-left text-[15px] font-500 text-gray-800"
            >
              {requestMessage || "선택해주세요"}
            </button>
            {foyerAccessType.type === "gate" && foyerAccessType.gatePassword?.trim() && (
              <span className="text-[15px] text-gray-800">{foyerAccessType.gatePassword}</span>
            )}
            {foyerAccessType.type === "custom" && foyerAccessType.customRequest?.trim() && (
              <span className="text-[15px] text-gray-800">{foyerAccessType.customRequest}</span>
            )}
          </div>
        </div>
        <button className="flex gap-1" onClick={() => setIsModalOpen(true)}>
          <span className="text-[15px] font-500 text-blue-500">요청 선택</span>
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex h-screen w-full max-w-lg flex-col gap-8 bg-white p-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <Image src="/icons/Arrow_Left.svg" width={24} height={24} alt="뒤로가기" />
              </button>
              <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
            </div>
            <h1 className="text-[23px] font-700">배송 시 요청사항</h1>
            <div className="flex flex-col gap-3">
              {/* <Button
                selected={foyerAccessType.type === "call"}
                onClick={() => handleSelect("call")}
              >
                전화주시면 마중 나갈게요
              </Button>
              <Button
                selected={foyerAccessType.type === "doorfront"}
                onClick={() => handleSelect("doorfront")}
              >
                문 앞에 두면 가져갈게요
              </Button>
              <Button
                selected={foyerAccessType.type === "gate"}
                onClick={() => handleSelect("gate")}
              >
                공동현관으로 올라오세요
              </Button> */}
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
                        name="공동현관 출입번호"
                        type="text"
                        value={tempPassword}
                        // onChange={e => setTempPassword(e.target.value)}
                        onChange={e => {
                          setTempPassword(e.target.value);
                        }}
                        placeholder="예: #1234"
                        className="w-full text-[17px] font-400 placeholder-gray-300"
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
                        name="직접 입력"
                        type="text"
                        value={tempCustomRequest}
                        onChange={e => setTempCustomRequest(e.target.value)}
                        placeholder="예: 조심히 배송해주세요."
                        className="w-full text-[17px] font-400 placeholder-gray-300"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="button"
              selected={!!requestMessage}
              onClick={handleSave}
              className="w-full rounded-md bg-black text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
