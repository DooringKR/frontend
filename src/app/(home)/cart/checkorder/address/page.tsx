"use client";

import { CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import DeliveryTimeCheck from "@/components/DeliveryTimeCheck/DeliveryTimeCheck";
import Input from "@/components/Input/Input";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

export default function CheckOrderAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlug = searchParams.get("category") || "etc";
  const matchedCategory = CATEGORY_LIST.find(item => item.slug === categorySlug);
  const categoryName = matchedCategory?.name || "기타";

  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [deliveryMessageColor, setDeliveryMessageColor] = useState<string>("text-[#14ae5c]");
  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);

  const { setAddress } = useOrderStore();

  const handleComplete = async (address: string) => {
    setAddress1(address);

    const { expectedArrivalMinutes } = await DeliverTime(address);

    const cutoff = 18 * 60;
    if (expectedArrivalMinutes <= cutoff) {
      setDeliveryMessage(`지금 주문하면 당일 배송되는 주소예요.`);
      setDeliveryMessageColor("text-[#14ae5c]");
      setIsDeliveryPossible(true);
    } else {
      setDeliveryMessage(`지금 주문하면 내일 배송되는 주소예요.`);
      setDeliveryMessageColor("text-[#bf6a02]");
      setIsDeliveryPossible(false);
    }
  };

  const handleSave = () => {
    setAddress({ address1, address2 });
    //  localStorage.setItem("order-address", JSON.stringify(addressData));
    localStorage.setItem("address-storage", JSON.stringify({ state: { address1, address2 } }));
    router.back(); // ✅ 뒤로가기
  };

  const isButtonDisabled = !address1 || !address2;
  const isAddressEntered = address1.trim() !== "" && address2.trim() !== "";

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator />
      <div className="flex flex-grow flex-col px-5 py-6">
        <h1 className="mb-5 text-[23px] font-700">배송주소</h1>

        <div className="flex flex-grow flex-col gap-[10px]">
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

          <DeliveryTimeCheck
            isDeliveryPossible={isDeliveryPossible}
            isAddressEntered={isAddressEntered}
          />
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isButtonDisabled}
          selected={!isButtonDisabled}
          className="mt-6 w-full"
        >
          저장하기
        </Button>
      </div>
    </div>
  );
}
