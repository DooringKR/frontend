"useClient";

import { ACCESSORY_MADEBY_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

interface MadeByProps {
  madeBy: string;
  setMadeBy: (value: string) => void; // 또는
}

function MadeBy({ setMadeBy, madeBy }: MadeByProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [isExistMadeBy, setIsExistMadeBy] = useState<boolean>(true);

  const handleSelectModel = (model: string) => {
    setMadeBy(model);
    setIsModalOpen(false);
  };

  return (
    <div>
      {isExistMadeBy ? (
        <ModalButton
          label="제조사"
          value={madeBy}
          placeholder="제조사를 선택해주세요"
          onClick={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          <Input
            label="제조사"
            type="text"
            name="제조사 입력"
            placeholder="제조사를 입력해주세요"
            onChange={e => setMadeBy(e.target.value)}
            value={madeBy}
          />
          <Button
            type="button"
            onClick={() => {
              setIsExistMadeBy(true);
              setIsModalOpen(true);
            }}
            className="my-2 w-full border border-black bg-gray-300 text-center text-sm"
          >
            목록에서 선택
          </Button>
        </>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="flex items-center">
              <h2 className="text-2xl font-semibold">제조사명 선택</h2>
            </span>
            <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
              닫기
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {ACCESSORY_MADEBY_LIST.map((model, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectModel(model)}
                className="text-left text-lg"
              >
                {model}
              </button>
            ))}
          </div>
          <Button
            type="button"
            onClick={() => {
              setIsExistMadeBy(false);
              setMadeBy("");
              setIsModalOpen(false);
            }}
            className="mt-2 border border-black bg-gray-300 text-sm"
          >
            찾는 제조사가 없어요
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default MadeBy;
