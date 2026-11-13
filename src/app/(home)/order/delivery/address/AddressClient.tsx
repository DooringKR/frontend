"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DeliveryStatusChip from "@/components/DeliveryTimeCheck/DeliveryStatusChip";
import AddressField from "@/components/form/AddressField";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import BottomBar from "@/components/overlay/BottomBar";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { goAfterSave } from "@/lib/nav/go";
import { trackClick } from "@/services/analytics/amplitude";
import { useOrderStore } from "@/store/orderStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";
import { getScreenName } from "@/utils/screenName";

import { CS_TEL } from "../../_lib/order";

/**
 * 배송 주소 — 주소 검색 + 상세 주소. 주소를 바꾸면 오늘배송 가능 여부를 다시 잰다.
 * 바꾼 주소가 오늘배송 불가면 「주소를 정말 바꿀까요?」를 한 번 묻고 저장한다.
 */
export default function AddressClientPage() {
  const router = useRouter();
  const { updateOrder, order } = useOrderStore();

  // 처음 값(바뀌었는지 보려고)
  const [initial, setInitial] = useState({ road: "", detail: "" });
  const [road, setRoad] = useState("");
  const [detail, setDetail] = useState("");
  useEffect(() => {
    setRoad(order?.road_address || "");
    setDetail(order?.detail_address || "");
    setInitial((p) => ({ road: p.road || order?.road_address || "", detail: p.detail || order?.detail_address || "" }));
  }, [order?.road_address, order?.detail_address]);

  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 오늘배송 가능 여부 — 주소가 바뀔 때마다(늦게 온 옛 결과는 버린다)
  useEffect(() => {
    if (!road.trim()) return;
    let cancelled = false;
    setIsChecking(true);
    calculateDeliveryInfo(road)
      .then(({ isToday }) => !cancelled && setIsDeliveryPossible(isToday))
      .catch((error) => {
        console.error("배송 가능 여부 계산 중 오류:", error);
        if (!cancelled) setIsDeliveryPossible(false);
      })
      .finally(() => !cancelled && setIsChecking(false));
    return () => {
      cancelled = true;
    };
  }, [road]);

  const roadChanged = road !== initial.road;
  const changed = roadChanged || detail !== initial.detail;
  const req = useRequired({ road: !!road.trim(), detail: !!detail.trim() });

  const save = () => {
    updateOrder({ road_address: road, detail_address: detail });
    goAfterSave(router, "/order/delivery");
  };

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator backTo="/order/delivery" />
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6 pb-40">
        <h1 className="mb-5 text-[23px] font-700">배송주소</h1>
        <div className="flex flex-col gap-[10px]">
          <Field label="주소" required fieldRef={req.ref("road")} error={req.error("road")}>
            <AddressField aria-invalid={!!req.error("road")} value={road} onPick={setRoad} />
          </Field>
          <Field fieldRef={req.ref("detail")} error={req.error("detail")}>
            <Input
              aria-invalid={!!req.error("detail")}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="상세주소 (예: 101동 501호 / 단독주택)"
            />
          </Field>
          <DeliveryStatusChip
            isDeliveryPossible={isDeliveryPossible}
            isAddressEntered={!!road.trim()}
            isChecking={isChecking}
            onUnavailableClick={() => {
              updateOrder({ road_address: road, detail_address: detail });
              router.push("/order/delivery/address/unavailable");
            }}
          />
        </div>
      </div>
      <BottomBar>
        <Button
          busy={isChecking}
          onClick={() => {
            trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
            if (!req.check()) return;
            if (!changed) return goAfterSave(router, "/order/delivery"); // 바꾼 게 없으면 「확인」은 돌아가기
            if (roadChanged && !isDeliveryPossible) return setConfirmOpen(true);
            save();
          }}
        >
          {!changed ? "확인" : roadChanged && !isDeliveryPossible ? "변경하기" : "저장하기"}
        </Button>
      </BottomBar>
      <ConfirmSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="주소를 정말 바꿀까요?"
        description={
          <>
            바뀐 주소는 오늘배송이 불가해요. 20시 31분 이후 도착해도 괜찮다면{" "}
            <a href={CS_TEL} className="font-500 text-primary underline">
              고객센터에 직접 전화
            </a>
            해주세요.
          </>
        }
        cancelLabel="닫기"
        confirmLabel="네, 바꿀게요"
        onConfirm={save}
      />
    </div>
  );
}
