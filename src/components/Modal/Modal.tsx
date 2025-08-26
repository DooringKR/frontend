"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div
        className="relative z-10 mb-[10px] w-full max-w-md rounded-3xl bg-white px-6 pb-6 pt-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex justify-center">
          <div className="h-[4px] w-[40px] rounded-full bg-gray-200"></div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
