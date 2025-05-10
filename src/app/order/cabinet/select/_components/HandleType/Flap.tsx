"use client";

import Button from "@/components/Button/Button";
import { CABINET_FLAPSTAY_LIST } from "@/constants/modelList";
import Image from "next/image";
import { useState } from "react";

import Modal from "@/components/Modal/Modal";

interface FlapProps {
  handleType: "channel" | "outer" | "pull-down"| null;
  flapStayType: string;
  setHandleType: (value: "channel" | "outer" | "pull-down"| null) => void;
  setFlapStayType: (value: string) => void;
}

function Flap({ setHandleType, handleType, flapStayType, setFlapStayType }: FlapProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSelectDrawerType = (flapStayType: string) => {
    setFlapStayType(flapStayType);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="mb-2">손잡이 종류</h3>
        <div className="flex w-full flex-grow gap-4">
          <Button
            onClick={() => setHandleType("channel")}
            className={`w-full border border-black ${
              handleType === "channel" ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            찬넬
          </Button>
          <Button
            onClick={() => setHandleType("outer")}
            className={`w-full border border-black ${
              handleType === "outer" ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            겉손잡이
          </Button>
        </div>
      </div>
      <div>
        <h3 className="mb-2">쇼바 종류</h3>
        <button
          className={`flex h-10 w-full items-center justify-between rounded-md border px-4 text-start ${flapStayType ? "text-black" : "text-gray-400"}`}
          onClick={() => setIsModalOpen(true)}
        >
          <p>{flapStayType || "쇼바 종류를 선택해주세요"}</p>
          <Image src="/icons/Arrow_Bottom.svg" alt="쇼바 종류 선택" width={15} height={7.5} />
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="flex items-center">
                <h2 className="text-2xl font-semibold">쇼바 종류</h2>
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">
                닫기
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <button
                className="rounded-xl border border-black bg-gray-300 px-3 py-2 text-center"
                onClick={() => {
                  setFlapStayType("");
                  setIsModalOpen(false);
                }}
              >
                쇼바 없음
              </button>
              {CABINET_FLAPSTAY_LIST.map((drawer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDrawerType(drawer)}
                  className="rounded-xl border border-black bg-gray-300 px-3 py-2 text-center"
                >
                  {drawer}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Flap;
