"useClient";

import { HARDWARE_MADEBY_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Modal from "@/components/Modal/Modal";

interface MadeByProps {
  madeBy: string;
  setMadeBy: (value: string) => void;
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
      <h3 className="mb-2">제조사</h3>
      {isExistMadeBy ? (
        <button
          className={`flex h-10 w-full items-center justify-between rounded-md border px-4 text-start ${madeBy ? "text-black" : "text-gray-400"}`}
          onClick={() => setIsModalOpen(true)}
        >
          <p>{madeBy || "제조사를 선택해주세요"}</p>
          <Image src="/icons/Arrow_Bottom.svg" alt="제조사 선택" width={15} height={7.5} />
        </button>
      ) : (
        <>
          <Input
            type="text"
            name="제조사 입력"
            placeholder="제조사를 입력해주세요"
            onChange={e => setMadeBy(e.target.value)}
            value={madeBy}
          />
          <button className="my-2 rounded-xl border border-black bg-gray-300 py-2 px-3 text-center" onClick={()=> {
            setIsExistMadeBy(true)
            setIsModalOpen(true)
          }
          }>
            {" "}
            목록에서 선택
          </button>
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
            {HARDWARE_MADEBY_LIST.map((model, idx) => (
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
              className="rounded-xl border border-black bg-gray-300 py-2 px-3  text-center"
              onClick={() => {
                setIsExistMadeBy(false);
                setMadeBy("");
                setIsModalOpen(false);
              }}
            >
              찾는 제조사가 없어요
            </button>
        </div>
      </Modal>
    </div>
  );
}

export default MadeBy;
