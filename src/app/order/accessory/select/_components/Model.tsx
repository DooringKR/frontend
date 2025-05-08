"useClient";

import { ACCESSORY_MODEL_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

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
      <h3 className="mb-2">모델명</h3>
      {isExistModel ? (
        <button
          className={`flex h-10 w-full items-center justify-between rounded-md border px-4 text-start ${model ? "text-black" : "text-gray-400"}`}
          onClick={() => setIsModalOpen(true)}
        >
          <p>{model || "제조사를 선택해주세요"}</p>
          <Image src="/icons/Arrow_Bottom.svg" alt="제조사 선택" width={15} height={7.5} />
        </button>
      ) : (
        <>
          <Input
            type="text"
            name="제조사 입력"
            placeholder="제조사를 입력해주세요"
            onChange={e => setModel(e.target.value)}
            value={model}
          />
          <button
            className="my-2 rounded-xl border border-black bg-gray-300 px-3 py-2 text-center"
            onClick={() => {
              setIsExistModel(true);
              setIsModalOpen(true);
            }}
          >
            {" "}
            목록에서 선택
          </button>
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
          <button
            className="rounded-xl border border-black bg-gray-300 px-3 py-2 text-center"
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
