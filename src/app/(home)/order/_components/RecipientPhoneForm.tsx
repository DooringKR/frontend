"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Field from "@/components/form/Field";
import PhoneInput from "@/components/form/PhoneInput";
import { useRequired } from "@/components/form/useRequired";
import BottomBar from "@/components/overlay/BottomBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { goAfterSave } from "@/lib/nav/go";
import useBizClientStore from "@/store/bizClientStore";
import { useOrderStore } from "@/store/orderStore";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import baseSchema from "@/utils/schema";

/**
 * 받는 분 휴대폰 번호 — 배송·픽업 같은 화면(예전 복사본 둘). 저장하면 주문 화면(backTo)으로.
 * 처음 값은 주문에 넣어 둔 번호, 없으면 회원 번호(주문 화면 카드와 같은 순서).
 */
export default function RecipientPhoneForm({ backTo }: { backTo: string }) {
  const router = useRouter();
  const orderPhone: string | undefined = useOrderStore((s) => s.order?.recipient_phone);
  const myPhone = useBizClientStore((s) => s.bizClient?.phone_number);
  const saved = orderPhone || myPhone || "";
  const [phone, setPhone] = useState("");
  useEffect(() => setPhone(formatPhoneNumber(saved)), [saved]);

  const parsed = baseSchema.safeParse({ user_phoneNumber: phone });
  const req = useRequired({ phone: !phone ? false : parsed.success || parsed.error.errors[0]?.message || "번호를 확인해 주세요" });
  const unchanged = phone === formatPhoneNumber(saved);

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator title="휴대폰 번호" backTo={backTo} />
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-6">
        <h1 className="pb-5 pt-5 text-[23px] font-700 text-gray-900">받는 분 휴대폰 번호</h1>
        <Field fieldRef={req.ref("phone")} error={req.error("phone")}>
          <PhoneInput aria-invalid={!!req.error("phone")} value={phone} onChange={setPhone} placeholder="010-1234-5678" />
        </Field>
      </div>
      <BottomBar>
        <Button
          onClick={() => {
            if (!req.check()) return;
            useOrderStore.getState().updateOrder({ recipient_phone: phone.replace(/-/g, "") });
            goAfterSave(router, backTo);
          }}
        >
          {unchanged ? "확인" : "저장하기"}
        </Button>
      </BottomBar>
    </div>
  );
}
