"useClient";

import { HARDWARE_MODEL_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";
import ModalButton from "@/components/ModalButton/ModalButton";

interface ModelProps {
  model: string;
  setModel: (value: string) => void;
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
          label="제조사"
          value={model}
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
            onChange={e => setModel(e.target.value)}
            value={model}
          />
          <Button
            type="button"
            className="my-2 w-full border border-black bg-gray-300 text-center text-sm"
            onClick={() => {
              setIsExistModel(true);
              setIsModalOpen(true);
            }}
          >
            {" "}
            목록에서 선택
          </Button>
        </>
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
            {HARDWARE_MODEL_LIST.map((model, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectModel(model)}
                className="text-left text-lg"
              >
                {model}
              </button>
            ))}
          </div>
          <button
            className="rounded-xl border border-black bg-gray-300 text-sm"
            onClick={() => {
              setIsExistModel(false);
              setModel("");
              setIsModalOpen(false);
            }}
          >
            찾는 모델명이 없어요
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Model;
