"useClient";

import { ACCESSORY_MODEL_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

interface ModelProps {
  model: string;
  setModel: (value: string) => void; // 또는
}

function Model({ setModel, model }: ModelProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isExistModel, setIsExistModel] = useState<boolean>(true);

  const handleSelectModel = (model: string) => {
    setModel(model);
    setIsModalOpen(false);
  };

  return (
    <div>
      {isExistModel ? (
        <ModalButton
          label="모델명"
          value={model}
          placeholder="모델명을 선택해주세요"
          onClick={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="flex w-full gap-2">
          <div className="w-full">
            <Input
              label="모델명"
              type="text"
              name="모델명 입력"
              placeholder="모델명을 입력해주세요"
              onChange={e => setModel(e.target.value)}
              value={model}
            />
          </div>
          <Button
            type="button"
            selected={true}
            className="my-2 w-[100px] px-4 text-sm"
            onClick={() => {
              setIsExistModel(true);
              setIsModalOpen(true);
            }}
          >
            목록에서 선택
          </Button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="flex items-center">
              <h2 className="text-2xl font-semibold">모델명 선택</h2>
            </span>
            <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
              닫기
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {ACCESSORY_MODEL_LIST.map((model, idx) => (
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
            selected={true}
            type="button"
            onClick={() => {
              setIsExistModel(false);
              setModel("");
              setIsModalOpen(false);
            }}
            className="mt-2 text-sm"
          >
            찾는 모델명이 없어요
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Model;
