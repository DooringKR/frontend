"use client";

import { CABINET_MATERIAL_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

interface DrawerProps {
  material: string;
  setMaterial: (value: string) => void;
}

function Material({ setMaterial, material }: DrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSelectMaterialType = (material: string) => {
    setMaterial(material);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ModalButton
        label="소재"
        value={material}
        placeholder="소재를 선택해주세요"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="flex items-center">
              <h2 className="text-2xl font-semibold">소재 종류</h2>
            </span>
            <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
              닫기
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {CABINET_MATERIAL_LIST.map((material, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectMaterialType(material)}
                className="text-left text-lg"
              >
                - {material}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Material;
