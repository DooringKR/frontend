"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import NavRow from "@/components/nav/NavRow";
import Sheet from "@/components/overlay/Sheet";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/use-copy";
import { trackClick } from "@/services/analytics/amplitude";
import { useOrderStore } from "@/store/orderStore";
import { getScreenName } from "@/utils/screenName";

import { FACTORY_ADDRESS, takeKeepOrder } from "./_lib/order";

const OPTIONS = [
  { method: "delivery", icon: "/icons/truck.svg", title: "배송", description: "입력한 주소로 배송해드려요." },
  { method: "pickup", icon: "/icons/box.svg", title: "직접 픽업", description: "공장에서 포장한 상품을 직접 픽업하세요." },
] as const;

export default function ReceiveOptionClientPage() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const copy = useCopy();

  // 장바구니에서 들어오면 새 주문으로. 주문 화면 「변경」으로 돌아온 것이면 넣어 둔 값을 지킨다.
  // (개발 모드에서 effect 가 두 번 돌아도 한 번만 — 두 번째에 지우지 않게)
  const entered = useRef(false);
  useEffect(() => {
    if (entered.current) return;
    entered.current = true;
    if (!takeKeepOrder()) useOrderStore.getState().clearOrder();
  }, []);

  const select = (o: (typeof OPTIONS)[number]) => {
    trackClick({ object_type: "button", object_name: o.method, current_page: getScreenName(), modal_name: null });
    router.push(`/order/${o.method}`);
  };

  return (
    <div className="pt-[60px]">
      <TopNavigator />
      <div className="p-5">
        <h1 className="text-[23px] font-700">
          상품 받는 방법을
          <br />
          선택해주세요
        </h1>
        <div className="flex w-full flex-col gap-3 py-5">
          {OPTIONS.map((o) => (
            <NavRow
              key={o.method}
              card
              label={
                <span className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.icon} alt="" className="size-8" />
                  {o.title}
                </span>
              }
              description={o.description}
              onClick={() => select(o)}
            />
          ))}
        </div>
        <Button variant="secondary" size="md" onClick={() => setSheetOpen(true)}>
          픽업주소 (도어링 공장)
        </Button>
        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="픽업주소 (도어링 공장)"
          description={FACTORY_ADDRESS}
          footer={
            <div className="flex w-full flex-col gap-2">
              {copy.failed && <p className="select-all text-[14px] text-gray-600">{copy.failed}</p>}
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setSheetOpen(false)}>
                  닫기
                </Button>
                <Button className="flex-1" onClick={() => copy.run("factory", FACTORY_ADDRESS)}>
                  {copy.copied === "factory" ? "복사됨" : "주소 복사"}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
