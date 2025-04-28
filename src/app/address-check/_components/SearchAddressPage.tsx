"use client";

import { categoryMap } from "@/constants/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";

import useAddressStore from "@/store/addressStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

function Page() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const router = useRouter();
  const { setAddress } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [deliveryMessageColor, setDeliveryMessageColor] = useState<string>("text-[#14ae5c]");

  const handleComplete = async (address: string) => {
    setSelectedAddress(address);

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

  const isButtonDisabled = !selectedAddress || !detailAddress;

  const handleAddressComplete = () => {
    console.log("선택된 도로명 주소:", selectedAddress);
    console.log("입력된 상세주소:", detailAddress);
    setAddress(selectedAddress, detailAddress);
    const englishCategory = categoryMap[category || ""] || "etc";
    router.push(`/order/${englishCategory}`);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
        >
          {"<"}
        </button>
        <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
      </div>
      <h1 className="text-2xl font-semibold">
        <span className="font-bold">{category}</span>을 배송받을 주소를 <br />
        입력해주세요.
      </h1>
      <div className="flex flex-col gap-[10px]">
        <label>주소</label>
        <div>
          <DaumPostcodePopup selectedAddress={selectedAddress} onComplete={handleComplete} />

          {deliveryMessage && (
            <p
              className={`mt-[-10px] h-[49px] w-full rounded-[10px] bg-[#f4f4f4] px-4 pt-[18px] text-base ${deliveryMessageColor}`}
            >
              {deliveryMessage}
            </p>
          )}
        </div>
        <input
          type="text"
          value={detailAddress}
          onChange={e => setDetailAddress(e.target.value)}
          placeholder="상세주소 (예: 101동 501호 / 단독주택)"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base"
        />
      </div>

      <button
        type="button"
        onClick={handleAddressComplete}
        disabled={isButtonDisabled}
        className={`absolute bottom-5 left-5 right-5 rounded-md py-3 text-white ${isButtonDisabled ? "bg-gray-300" : "bg-black"}`}
      >
        다음
      </button>
    </div>
  );
}

export default Page;
