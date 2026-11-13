"use client";

import { CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import AddressField from "@/components/form/AddressField";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import BottomBar from "@/components/overlay/BottomBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useAddressStore from "@/store/addressStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

/** 품목별 주소 입력(옛 흐름 — 앱 안에서 들어오는 길이 없다, 감사 D 표) */
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

  const req = useRequired({ address1: !!address1, address2: !!address2.trim() });

  const handleComplete = async (address: string) => {
    setAddress1(address);
    setDeliveryMessage(null);
    try {
      const { expectedArrivalMinutes } = await DeliverTime(address);
      const cutoff = 18 * 60;
      if (expectedArrivalMinutes <= cutoff) {
        setDeliveryMessage(`지금 주문하면 당일 배송되는 주소예요.`);
        setDeliveryMessageColor("text-[#14ae5c]");
      } else {
        setDeliveryMessage(`지금 주문하면 내일 배송되는 주소예요.`);
        setDeliveryMessageColor("text-[#bf6a02]");
      }
    } catch (error) {
      // 배송 시간을 못 재도 주소 입력은 이어 간다
      console.error("배송 시간 계산 실패:", error);
    }
  };

  const handleAddressComplete = () => {
    if (!req.check()) return;
    setAddress(address1, address2);
    router.push(`/order/${englishCategory}`);
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-[120px] pt-[76px]">
      <TopNavigator />
      <h1 className="text-2xl font-semibold">
        <span className="font-bold">{categoryName}</span>을 배송받을 주소를 <br />
        입력해주세요.
      </h1>
      <Field label="주소" required fieldRef={req.ref("address1")} error={req.error("address1")}>
        <AddressField aria-invalid={!!req.error("address1")} value={address1} onPick={handleComplete} />
        {deliveryMessage && <p className={`text-base ${deliveryMessageColor}`}>{deliveryMessage}</p>}
      </Field>
      <Field label="상세주소" required fieldRef={req.ref("address2")} error={req.error("address2")}>
        <Input
          aria-invalid={!!req.error("address2")}
          value={address2}
          onChange={e => setAddress2(e.target.value)}
          placeholder="상세주소 (예: 101동 501호 / 단독주택)"
        />
      </Field>

      <BottomBar>
        <Button onClick={handleAddressComplete}>다음</Button>
      </BottomBar>
    </div>
  );
}

export default Page;
