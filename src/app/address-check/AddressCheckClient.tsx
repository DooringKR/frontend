"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import DeliveryStatusChip from "@/components/DeliveryTimeCheck/DeliveryStatusChip";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";
import useBizClientStore from "@/store/bizClientStore";
import { UpdateBizClientUsecase } from "@/DDD/usecase/user/update_BizClient_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";

function AddressCheckClientPage() {
  const router = useRouter();
  const { bizClient } = useBizClientStore();
  const road_address = bizClient?.road_address || "";
  const detail_address = bizClient?.detail_address || "";
  const updateBizClientUsecase = new UpdateBizClientUsecase(new BizClientSupabaseRepository());


  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);

  // const [showPostcode, setShowPostcode] = useState(false);

  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  const scriptLoadedRef = useRef(false);

  // const { address1, address2, setAddress } = useAddressStore();
  // const userId = useUserStore.getState().id;



  const [temp_road_address, setTempRoadAddress] = useState(road_address);
  const [temp_detail_address, setTempDetailAddress] = useState(detail_address);

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.daum?.Postcode) {
      scriptLoadedRef.current = true;
    }
  }, []);

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

  const handleSubmit = async () => {
    if (isCheckingDelivery) return;

    if (!temp_road_address || !temp_detail_address) {
      alert("주소와 상세주소를 모두 입력해주세요.");
      return;
    }

    try {
      await updateBizClientUsecase.execute({
        id: bizClient?.id,
        road_address: temp_road_address,
        detail_address: temp_detail_address,
      });

      // await updateUserAddress(userId, address1, address2);
      console.log("📦 주소 업데이트 완료 후 후처리 시작");

      useBizClientStore.getState().updateBizClient({
        road_address: temp_road_address,
        detail_address: temp_detail_address,
      });

      // setAddress(address1, address2);
      router.replace("/");
    } catch (error) {
      alert("주소 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
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
        <h1 className="text-sm font-400 text-gray-600">주소</h1>

        <DaumPostcodePopup
          address1={temp_road_address || ""}
          onComplete={selected => {
            setTempRoadAddress(selected);
          }}
        />

        <BoxedInput
          placeholder="상세주소 (예: 101동 501호 / 단독주택)"
          value={temp_detail_address}
          onChange={e => {
            setTempDetailAddress(e.target.value);
          }}
        />
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

      <div id="address-check-next-button" className="fixed bottom-0 left-1/2 w-full max-w-[460px] -translate-x-1/2">
        <BottomButton
          type="1button"
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={handleSubmit}
        />
      </div>
    </div>
  );
}

export default AddressCheckClientPage;
