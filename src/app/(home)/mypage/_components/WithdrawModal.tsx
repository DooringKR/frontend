"use client";

import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function WithdrawModal({
    isOpen,
    onClose,
    onConfirm
}: WithdrawModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-5 p-6">
                <h2 className="text-xl font-600">정말 탈퇴하시겠어요?</h2>

                <div className="flex flex-col gap-3 text-sm text-gray-600">
                    <p>탈퇴하시면 다음 정보가 삭제됩니다:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>계정 정보</li>
                        <li>장바구니 내역</li>
                        <li>저장된 주소</li>
                    </ul>

                    <div className="mt-2 rounded-lg bg-yellow-50 p-3 text-yellow-800">
                        ⚠️ 삭제된 데이터는 복구할 수 없습니다.
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        text="취소"
                        type="GrayMedium"
                        className="flex-1"
                        onClick={onClose}
                    />
                    <Button
                        text="탈퇴하기"
                        type="Primary"
                        className="flex-1 !bg-red-500 hover:!bg-red-600"
                        onClick={onConfirm}
                    />
                </div>
            </div>
        </Modal>
    );
}

