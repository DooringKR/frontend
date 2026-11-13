"use client";

import { VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";

import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import NavRow from "@/components/nav/NavRow";
import BottomBar from "@/components/overlay/BottomBar";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { ActionError } from "@/components/ui/use-action";
import { trackClick } from "@/services/analytics/amplitude";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { getScreenName } from "@/utils/screenName";

import DateTimeRow from "../_components/DateTimeRow";
import PickUpAddressCard from "../_components/PickUpAddressCard";
import { changeReceiveOption, toDate, ymdOf } from "../_lib/order";
import { useOrderCheckout } from "../_lib/useOrderCheckout";

/** 픽업 주문 — 받는 분 번호 · 차량 · 픽업일정(화면 순서 그대로 검사) → 주문 접수 */
export default function PickUpClientPage() {
  const router = useRouter();
  const { order, updateOrder, hasSetProducts, setProducts, expectedPrice, act, submit } = useOrderCheckout("pickup", (current) => {
    // 픽업 시각 기본값은 지금. 지난 날짜가 남아 있으면(넣다 만 주문) 지금으로
    const stored = toDate(current?.pickup_time);
    return stored && ymdOf(stored) >= ymdOf(new Date()) ? {} : { pickup_time: new Date() };
  });

  const vehicle: string | undefined = order?.vehicle_type;
  const pickupTime = toDate(order?.pickup_time);
  const req = useRequired({
    phone: !!order?.recipient_phone?.trim() || "받는 분 휴대폰 번호를 입력해 주세요",
    vehicle: (!!vehicle && !(vehicle === VehicleType.DIRECT_INPUT && !order?.vehicle_type_direct_input?.trim())) || "픽업차량 종류를 골라 주세요",
    schedule: !!pickupTime || "픽업 날짜를 골라 주세요",
  });

  return (
    <div className="pt-[60px]">
      <TopNavigator title="주문하기" backTo="/order" />
      <ReceiveOptionBar
        icon="/icons/parcel.svg"
        alt="소포 아이콘"
        title="직접 픽업"
        onChange={() => changeReceiveOption(router)}
        bottomBarClassName="my-8"
      >
        <PickUpAddressCard />
      </ReceiveOptionBar>
      <div className="flex flex-col gap-3 p-5">
        <h1 className="text-xl font-600">픽업정보 확인</h1>
        <Field fieldRef={req.ref("phone")} error={req.error("phone")}>
          <NavRow
            card
            label="받는 분 휴대폰 번호"
            description={formatPhoneNumber(order?.recipient_phone ?? "") || "휴대폰 번호를 입력해주세요"}
            href="/order/pickup/phone"
            disabled={act.busy}
          />
        </Field>
        <Field fieldRef={req.ref("vehicle")} error={req.error("vehicle")}>
          <NavRow
            card
            label="픽업차량 종류"
            description={
              <>
                {vehicle || "선택해주세요"}
                {order?.vehicle_type_direct_input && (
                  <>
                    <br />
                    {order.vehicle_type_direct_input}
                  </>
                )}
              </>
            }
            href="/order/pickup/vehicle"
            disabled={act.busy}
          />
        </Field>
      </div>
      <section className="flex flex-col gap-3 px-5">
        <h2 className="text-xl font-600">픽업일정 선택</h2>
        <Field label="원하는 날짜 픽업" fieldRef={req.ref("schedule")} error={req.error("schedule")}>
          <DateTimeRow
            label="희망 픽업"
            min={ymdOf(new Date())}
            invalid={!!req.error("schedule")}
            value={pickupTime}
            onChange={(d) => updateOrder({ pickup_time: d })}
          />
        </Field>
      </section>
      <div className="flex flex-col gap-1 px-5 pt-5">
        <PriceSummaryCard getTotalPrice={expectedPrice} filteredCartItems={hasSetProducts ? setProducts : undefined} />
        {!hasSetProducts && <PaymentNoticeCard />}
      </div>
      <div className="h-[150px]"></div>
      <BottomBar top={<ActionError error={act.error} className="mb-2" />}>
        <Button
          id="pickup-order-button"
          busy={act.busy}
          onClick={() => {
            trackClick({ object_type: "button", object_name: "submit", current_page: getScreenName(), modal_name: null });
            if (req.check()) submit();
          }}
        >
          주문 접수하기
        </Button>
      </BottomBar>
    </div>
  );
}
