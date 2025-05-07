"use client";

import { CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";

import useAddressStore from "@/store/addressStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAddress } = useAddressStore();

  const categorySlug = searchParams.get("category") || "etc";
  const matchedCategory = CATEGORY_LIST.find(item => item.slug === categorySlug);
  const categoryName = matchedCategory?.name || "기타";
  const englishCategory = matchedCategory?.slug || "etc";

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
    setAddress(address1, address2);
    router.push(`/order/${englishCategory}`);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => router.back()}>
          <Image src="/icons/Arrow_Left.svg" width={24} height={24} alt="뒤로가기" />
        </button>
        <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
      </div>
      <h1 className="text-2xl font-semibold">
        <span className="font-bold">{categoryName}</span>을 배송받을 주소를 <br />
        입력해주세요.
      </h1>
      <div className="flex flex-col gap-[10px]">
        <label>주소</label>
        <div>
          <DaumPostcodePopup address1={address1} onComplete={handleComplete} />

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
        className={`absolute bottom-5 left-5 right-5 rounded-md py-3 text-white ${isButtonDisabled ? "bg-gray-300" : "bg-black"}`}
      >
        다음
      </button>
    </div>
  );
}

export default Page;
