"use client";

import { CATEGORY_LIST } from "@/constants/category";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import Input from "@/components/Input/Input";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";

import { DeliverTime } from "@/utils/CheckDeliveryTime";

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
  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);

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

  const isAddressEntered = address1.trim() !== "" && address2.trim() !== "";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white p-6">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 text-gray-500">
          ✕
        </button>

        <div className="flex-grow">
          <h1 className="mb-5 text-[23px] font-700">
            {/* <span className="font-bold">자재</span>를 배송받을 주소를 <br />
          입력해주세요. */}
            <span>배송주소</span>
          </h1>

          <div className="flex flex-col gap-[10px]">
            <label className="text-sm font-400 text-gray-600">주소</label>
            <DaumPostcodePopup address1={address1} onComplete={handleComplete} />

            {deliveryMessage && (
              <p
                className={`mt-[-10px] h-[49px] w-full rounded-[10px] bg-[#f4f4f4] px-4 pt-[18px] text-base ${deliveryMessageColor}`}
              >
                {deliveryMessage}
              </p>
            )}

            <Input
              name="상세주소"
              type="text"
              value={address2}
              onChange={e => setAddress2(e.target.value)}
              placeholder="상세주소 (예: 101동 501호 / 단독주택)"
              className="h-[50px] w-full px-4 py-3 text-base"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAddressComplete}
          disabled={isButtonDisabled}
          selected={!isButtonDisabled}
          className="w-full"
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
