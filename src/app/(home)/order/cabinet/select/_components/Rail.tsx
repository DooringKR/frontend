"use client";

import { CABINET_RAIL_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

interface RailProps {
  railType: string;
  setRailType: (value: string) => void;
}

function Rail({ setRailType, railType }: RailProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSelectRailType = (railType: string) => {
    setRailType(railType);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ModalButton
        label="레일 종류"
        value={railType}
        placeholder="레일 종류를 선택해주세요"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="flex items-center">
              <h2 className="text-2xl font-semibold">레일 종류</h2>
            </span>
            <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
              닫기
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <button
              className="rounded-xl border border-black bg-gray-300 px-3 py-2 text-center"
              onClick={() => {
                setRailType("");
                setIsModalOpen(false);
              }}
            >
              레일 없음
            </button>
            {CABINET_RAIL_LIST.map((rail, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectRailType(rail)}
                className="text-left text-lg"
              >
                {rail}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Rail;
