"use client";

import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
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
import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import { trackClick } from "@/services/analytics/amplitude";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { getScreenName } from "@/utils/screenName";

import { changeReceiveOption, defaultArrival, toDate } from "../_lib/order";
import { useOrderCheckout } from "../_lib/useOrderCheckout";
import DeliveryScheduleSelector from "./_components/DeliveryScheduleSelector/DeliveryScheduleSelector";

/** 배송 주문 — 주소 · 배송일정 · 받는 분 번호 · 요청사항(화면 순서 그대로 검사) → 주문 접수 */
export default function CheckOrderClientPage() {
  const router = useRouter();
  const { order, hasSetProducts, setProducts, expectedPrice, act, submit } = useOrderCheckout("delivery", (current, user) => {
    // 지난 시각이 남아 있으면(오래전에 넣다 만 주문) 기본값으로 — 원하는 날짜 배송·내일 0시
    const stored = toDate(current?.delivery_arrival_time);
    const fresh = !!stored && stored.getTime() > Date.now();
    return {
      road_address: current?.road_address || user.road_address || "",
      detail_address: current?.detail_address || user.detail_address,
      is_today_delivery: fresh ? current?.is_today_delivery === true : false,
      delivery_arrival_time: fresh ? stored : defaultArrival(),
    };
  });

  const road = order?.road_address?.trim();
  const detail = order?.detail_address?.trim();
  const method: string | undefined = order?.delivery_method;
  const req = useRequired({
    address: (!!road && !!detail) || "배송 주소를 입력해 주세요",
    schedule:
      order?.is_today_delivery === true ||
      (order?.is_today_delivery === false && !!order?.delivery_arrival_time) ||
      "배송 날짜를 골라 주세요",
    phone: !!order?.recipient_phone?.trim() || "받는 분 휴대폰 번호를 입력해 주세요",
    request:
      (!!method &&
        !(method === DeliveryMethod.OPEN_GATE && !order?.gate_password?.trim()) &&
        !(method === DeliveryMethod.DIRECT_INPUT && !order?.delivery_method_direct_input?.trim())) ||
      "배송 시 요청사항을 골라 주세요",
  });

  const requestDetail =
    method === DeliveryMethod.OPEN_GATE ? order?.gate_password : method === DeliveryMethod.DIRECT_INPUT ? order?.delivery_method_direct_input : null;

  return (
    <div className="flex min-h-screen flex-col justify-between pt-[60px]">
      <TopNavigator title="주문하기" backTo="/order" />
      <ReceiveOptionBar icon="/icons/truck.svg" alt="트럭 아이콘" title="배송" onChange={() => changeReceiveOption(router)} bottomBarClassName="mt-4 mb-8" />
      <div className="flex-grow px-5">
        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">주소 확인</h2>
          <Field fieldRef={req.ref("address")} error={req.error("address")}>
            <NavRow
              card
              label="배송 주소"
              description={
                <>
                  {road || "도로명 주소를 입력해주세요"}
                  <br />
                  {detail || "상세 주소를 입력해주세요"}
                </>
              }
              href="/order/delivery/address"
              disabled={act.busy}
            />
          </Field>
        </section>

        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600">배송일정 선택</h2>
          <Field fieldRef={req.ref("schedule")} error={req.error("schedule")}>
            <DeliveryScheduleSelector invalid={!!req.error("schedule")} />
          </Field>
        </section>

        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">배송정보 확인</h2>
          <Field fieldRef={req.ref("phone")} error={req.error("phone")}>
            <NavRow
              card
              label="받는 분 휴대폰 번호"
              description={formatPhoneNumber(order?.recipient_phone ?? "") || "휴대폰 번호를 입력해주세요"}
              href="/order/delivery/phone"
              disabled={act.busy}
            />
          </Field>
          <Field fieldRef={req.ref("request")} error={req.error("request")}>
            <NavRow
              card
              label="배송 시 요청사항"
              description={
                <>
                  {method || "선택해주세요"}
                  {requestDetail?.trim() && (
                    <>
                      <br />
                      {requestDetail}
                    </>
                  )}
                </>
              }
              href="/order/delivery/receive-request"
              disabled={act.busy}
            />
          </Field>
        </section>

        <div className="flex flex-col gap-1">
          <PriceSummaryCard getTotalPrice={expectedPrice} page={CHECK_ORDER_PAGE} filteredCartItems={hasSetProducts ? setProducts : undefined} />
          {!hasSetProducts && <PaymentNoticeCard />}
        </div>
      </div>

      <div className="h-[150px]"></div>
      <BottomBar top={<ActionError error={act.error} className="mb-2" />}>
        <Button
          id="delivery-order-button"
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
