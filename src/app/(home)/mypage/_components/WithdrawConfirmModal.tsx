"use client";

import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";

interface WithdrawConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function WithdrawConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false
}: WithdrawConfirmModalProps) {
    const [confirmText, setConfirmText] = useState("");

    const isConfirmEnabled = confirmText === "탈퇴하기";

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-5 p-6">
                <h2 className="text-xl font-600 text-red-600">⚠️ 최종 확인</h2>

                <div className="flex flex-col gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                    <p className="font-600">탈퇴 시 주의사항:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>탈퇴 즉시 모든 데이터가 삭제됩니다</li>
                        <li>삭제된 데이터는 복구할 수 없습니다</li>
                        <li>진행 중인 주문이 있다면 완료 후 탈퇴해주세요</li>
                        <li>동일한 계정으로 즉시 재가입 가능합니다</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">
                        아래 입력란에 <span className="font-600">"탈퇴하기"</span>를 입력해주세요
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="탈퇴하기"
                        className="rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3">
                    <Button
                        text="취소"
                        type="GrayMedium"
                        className="flex-1"
                        onClick={onClose}
                        disabled={isLoading}
                    />
                    <Button
                        text={isLoading ? "처리 중..." : "탈퇴하기"}
                        type="Primary"
                        className="flex-1 !bg-red-500 hover:!bg-red-600"
                        onClick={onConfirm}
                        disabled={!isConfirmEnabled || isLoading}
                    />
                </div>
            </div>
        </Modal>
    );
}

