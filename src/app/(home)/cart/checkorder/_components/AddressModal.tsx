"use client";

import { CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { DeliverTime } from "@/utils/CheckDeliveryTime";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";

interface AddressModalProps {
  onClose: () => void;
  onAddressSelect: (address1: string, address2: string) => void;
}

export default function AddressModal({ onClose, onAddressSelect }: AddressModalProps) {
  const searchParams = useSearchParams();

  const categorySlug = searchParams.get("category") || "etc";
  const matchedCategory = CATEGORY_LIST.find(item => item.slug === categorySlug);
  const categoryName = matchedCategory?.name || "기타";

  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [deliveryMessageColor, setDeliveryMessageColor] = useState<string>("text-[#14ae5c]");

  const handleComplete = async (address: string) => {
    setAddress1(address);

    const { expectedArrivalMinutes } = await DeliverTime(address);

    const cutoff = 18 * 60;
    if (expectedArrivalMinutes <= cutoff) {
      setDeliveryMessage(`지금 주문하면 당일 배송되는 주소예요.`);
      setDeliveryMessageColor("text-[#14ae5c]");
    } else {
      setDeliveryMessage(`지금 주문하면 내일 배송되는 주소예요.`);
      setDeliveryMessageColor("text-[#bf6a02]");
    }
  };

  const isButtonDisabled = !address1 || !address2;

  const handleAddressComplete = () => {
    onAddressSelect(address1, address2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg h-full bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500"
        >
          ✕
        </button>

        <h1 className="text-2xl font-semibold mb-4">
          <span className="font-bold">자재</span>를 배송받을 주소를 <br />
          입력해주세요.
        </h1>

        <div className="flex flex-col gap-[10px] mb-4">
          <label>주소</label>
          <DaumPostcodePopup address1={address1} onComplete={handleComplete} />

          {deliveryMessage && (
            <p
              className={`mt-[-10px] h-[49px] w-full rounded-[10px] bg-[#f4f4f4] px-4 pt-[18px] text-base ${deliveryMessageColor}`}
            >
              {deliveryMessage}
            </p>
          )}

          <input
            type="text"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
            placeholder="상세주소 (예: 101동 501호 / 단독주택)"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
          />
        </div>

        <button
          type="button"
          onClick={handleAddressComplete}
          disabled={isButtonDisabled}
          className={`w-full rounded-md py-3 text-white ${isButtonDisabled ? "bg-gray-300" : "bg-black"}`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
