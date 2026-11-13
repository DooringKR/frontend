"use client";

import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import BottomBar from "@/components/overlay/BottomBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { goAfterSave } from "@/lib/nav/go";
import { useOrderStore } from "@/store/orderStore";

const OPTIONS = [DeliveryMethod.CALL, DeliveryMethod.LEAVE_DOOR, DeliveryMethod.OPEN_GATE, DeliveryMethod.DIRECT_INPUT].map((m) => ({ value: m, label: m }));

/** 배송 시 요청사항 — 고르고 「저장하기」를 눌러야 주문에 들어간다(예전엔 고르는 즉시 들어가 저장 안 하고 뒤로 가도 남았다) */
export default function DeliveryRequestClientPage() {
  const router = useRouter();
  const order = useOrderStore((s) => s.order);

  const [method, setMethod] = useState<DeliveryMethod | null>(null);
  const [password, setPassword] = useState("");
  const [custom, setCustom] = useState("");
  useEffect(() => {
    setMethod(order?.delivery_method ?? null);
    setPassword(order?.gate_password || "");
    setCustom(order?.delivery_method_direct_input || "");
  }, [order?.delivery_method, order?.gate_password, order?.delivery_method_direct_input]);

  const req = useRequired({
    method: !!method,
    text:
      method === DeliveryMethod.OPEN_GATE
        ? !!password.trim() || "공동현관 출입번호를 넣어 주세요"
        : method === DeliveryMethod.DIRECT_INPUT
          ? !!custom.trim() || "요청사항을 넣어 주세요"
          : true,
  });

  const save = () => {
    if (!req.check()) return;
    useOrderStore.getState().updateOrder({
      delivery_method: method,
      gate_password: method === DeliveryMethod.OPEN_GATE ? password : null,
      delivery_method_direct_input: method === DeliveryMethod.DIRECT_INPUT ? custom : null,
    });
    goAfterSave(router, "/order/delivery");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pb-5 pt-[60px]">
      <TopNavigator backTo="/order/delivery" />
      <div className="flex-1 overflow-y-auto bg-white px-5 pb-36">
        <h1 className="mt-5 text-[23px] font-700">배송 시 요청사항</h1>
        <Field className="mt-5" fieldRef={req.ref("method")} error={req.error("method")}>
          <Choose aria-label="배송 시 요청사항" value={method} onChange={setMethod} options={OPTIONS} />
          {method === DeliveryMethod.OPEN_GATE && (
            <Field label="공동현관 출입번호" required fieldRef={req.ref("text")} error={req.error("text")}>
              <Input aria-invalid={!!req.error("text")} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="예: #1234" />
            </Field>
          )}
          {method === DeliveryMethod.DIRECT_INPUT && (
            <Field fieldRef={req.ref("text")} error={req.error("text")}>
              <Input aria-invalid={!!req.error("text")} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="예: 조심히 배송해주세요." />
            </Field>
          )}
        </Field>
      </div>
      <BottomBar>
        <Button onClick={save}>저장하기</Button>
      </BottomBar>
    </div>
  );
}
