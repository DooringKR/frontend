"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-6"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
    </div>
  );
}
