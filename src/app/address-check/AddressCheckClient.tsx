"use client";

import { updateUserAddress } from "@/api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import DeliveryStatusChip from "@/components/DeliveryTimeCheck/DeliveryStatusChip";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useAddressStore from "@/store/addressStore";
import useUserStore from "@/store/userStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

function AddressCheckClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);

  // const [showPostcode, setShowPostcode] = useState(false);

  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  const scriptLoadedRef = useRef(false);

  const { address1, address2, setAddress } = useAddressStore();
  const userId = useUserStore.getState().id;

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true;
  };
  // //다음 주소 api 팝업용 함수
  // const handleAddressClick = () => {
  //   if (!scriptLoadedRef.current || !window.daum?.Postcode) {
  //     alert("주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
  //     return;
  //   }

  //   new window.daum.Postcode({
  //     oncomplete: data => {
  //       const selectedAddress = data.roadAddress || data.address;
  //       setAddress(selectedAddress, address2); // 상세주소 유지
  //     },
  //   }).open();
  // };

  useEffect(() => {
    if (typeof window !== "undefined" && window.daum?.Postcode) {
      scriptLoadedRef.current = true;
    }
  }, []);

  // 상태에 따라 주소 입력 완료 여부 판단
  const isAddressEntered = address1.trim() !== "";
  // const isAddressEntered = address1.trim() !== "" && address2.trim() !== "";

  useEffect(() => {
    const checkTodayDelivery = async () => {
      if (isAddressEntered) {
        setIsCheckingDelivery(true);
        try {
          const { isToday } = await calculateDeliveryInfo(address1);
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
  }, [address1]);

  const handleSubmit = async () => {
    if (isCheckingDelivery) return;

    if (!address1 || !address2) {
      alert("주소와 상세주소를 모두 입력해주세요.");
      return;
    }

    if (userId === null) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      await updateUserAddress(userId, address1, address2);
      console.log("📦 주소 업데이트 완료 후 후처리 시작");
      useUserStore.setState({
        user_road_address: address1,
        user_detail_address: address2,
      });
      setAddress(address1, address2);
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
          address1={address1}
          onComplete={selected => {
            setAddress(selected, address2);
          }}
        />

        <BoxedInput
          placeholder="상세주소 (예: 101동 501호 / 단독주택)"
          value={address2}
          onChange={e => setAddress(address1, e.target.value)}
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

      <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 px-5 pb-5">
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
