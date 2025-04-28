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
      {/* dim (뒤쪽) */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 박스 (앞쪽) */}
      <div
        className="relative w-full max-w-md rounded-t-2xl bg-white p-6 z-10"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭시 닫히지 않게
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;