"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DeliveryStatusChip from "@/components/DeliveryTimeCheck/DeliveryStatusChip";
import AddressField from "@/components/form/AddressField";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionError, useAction } from "@/components/ui/use-action";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";
import useBizClientStore from "@/store/bizClientStore";
import { UpdateBizClientUsecase } from "@/DDD/usecase/user/update_BizClient_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { trackClick } from "@/services/analytics/amplitude";
import { getScreenName } from "@/utils/screenName";

/** 배송 주소 — 저장된 주소를 채워 두고, 고쳐서 저장하면 홈으로. 오늘배송 칩은 저장된 주소 기준. */
function AddressCheckClientPage() {
  const router = useRouter();
  const { bizClient } = useBizClientStore();
  const road_address = bizClient?.road_address || "";
  const detail_address = bizClient?.detail_address || "";

  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  const [temp_road_address, setTempRoadAddress] = useState(road_address);
  const [temp_detail_address, setTempDetailAddress] = useState(detail_address);

  const req = useRequired({ road: !!temp_road_address, detail: !!temp_detail_address.trim() });
  const save = useAction({ holdOnSuccess: true });

  // 상태에 따라 주소 입력 완료 여부 판단
  const isAddressEntered = road_address.trim() !== "";

  useEffect(() => {
    const checkTodayDelivery = async () => {
      if (isAddressEntered) {
        setIsCheckingDelivery(true);
        try {
          const { isToday } = await calculateDeliveryInfo(road_address);
          setIsDeliveryPossible(isToday);
        } catch (error) {
          console.error("배송 가능 여부 확인 실패:", error);
          setIsDeliveryPossible(false);
        } finally {
          setIsCheckingDelivery(false);
        }
      }
    };

    checkTodayDelivery();
  }, [road_address]);

  const handleSubmit = () => {
    trackClick({
      object_type: "button",
      object_name: "confirm",
      current_page: getScreenName(),
      modal_name: null,
    });

    if (!req.check()) return;

    save.run(async () => {
      if (!bizClient?.id) throw new Error("로그인 후 주소를 저장할 수 있어요.");
      // 저장 실패는 예외가 아니라 success:false 로 온다(예전엔 이것을 안 보고 저장된 줄 알았다)
      const result = await new UpdateBizClientUsecase(new BizClientSupabaseRepository())
        .execute({ id: bizClient.id, road_address: temp_road_address, detail_address: temp_detail_address })
        .catch((error) => {
          console.error("주소 저장 실패:", error);
          return { success: false };
        });
      if (!result.success) throw new Error("주소 저장 중 오류가 발생했습니다.");

      useBizClientStore.getState().updateBizClient({
        road_address: temp_road_address,
        detail_address: temp_detail_address,
      });
      router.replace("/");
    });
  };

  return (
    <div className="pt-[60px]">
      <TopNavigator title="주소 입력" />
      <Header
        title={
          <>
            배송받을 주소를 <br />
            입력해주세요
          </>
        }
        size="Large"
      />
      <div className="flex flex-col gap-2 px-[20px] pt-[20px]">
        <Field label="주소" required fieldRef={req.ref("road")} error={req.error("road")}>
          <AddressField aria-invalid={!!req.error("road")} value={temp_road_address} onPick={setTempRoadAddress} />
        </Field>
        <Field required fieldRef={req.ref("detail")} error={req.error("detail")}>
          <Input
            aria-label="상세주소"
            aria-invalid={!!req.error("detail")}
            placeholder="상세주소 (예: 101동 501호 / 단독주택)"
            value={temp_detail_address}
            onChange={e => setTempDetailAddress(e.target.value)}
          />
        </Field>
      </div>
      <div className="mx-5 mt-3">
        <DeliveryStatusChip
          isDeliveryPossible={isDeliveryPossible}
          isAddressEntered={isAddressEntered}
          isChecking={isCheckingDelivery}
          onUnavailableClick={() => {
            if (isCheckingDelivery) return;
            router.push("/address-check/unavailable");
          }}
        />
      </div>

      <BottomBar top={<ActionError error={save.error} className="mb-3" />}>
        <Button busy={save.busy} onClick={handleSubmit}>
          다음
        </Button>
      </BottomBar>
    </div>
  );
}

export default AddressCheckClientPage;
