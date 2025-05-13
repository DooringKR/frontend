"use client";

import { CABINET_DRAWER_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

interface DrawerProps {
  drawerType: string;
  setDrawerType: (value: string) => void;
}

function Drawer({ setDrawerType, drawerType }: DrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSelectDrawerType = (drawerType: string) => {
    setDrawerType(drawerType);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ModalButton
        label="서랍 종류"
        value={drawerType}
        placeholder="서랍 종류를 선택해주세요"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="flex items-center">
              <h2 className="text-2xl font-semibold">서랍 종류</h2>
            </span>
            <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
              닫기
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <button
              className="rounded-xl border border-black bg-gray-300 px-3 py-2 text-center"
              onClick={() => {
                setDrawerType("");
                setIsModalOpen(false);
              }}
            >
              서랍 없음
            </button>
            {CABINET_DRAWER_LIST.map((drawer, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDrawerType(drawer)}
                className="text-left text-lg"
              >
                {drawer}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Drawer;
