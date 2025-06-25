"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import DeliveryTimeCheck from "@/components/DeliveryTimeCheck/DeliveryTimeCheck";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import DaumPostcodeEmbed from "@/components/SearchAddress/DaumPostcodeEmbed";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function AddressPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");

  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);
  const [isAddressEntered, setisAddressEntered] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const scriptLoadedRef = useRef(false);

  const handleScriptLoad = () => {
    scriptLoadedRef.current = true;
  };

  const handleAddressClick = () => {
    if (!scriptLoadedRef.current || !window.daum?.Postcode) {
      alert("주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: data => {
        const selectedAddress = data.roadAddress || data.address;
        setAddress1(selectedAddress);
      },
    }).open();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.daum?.Postcode) {
      scriptLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const isComplete = address1.trim() !== "" && address2.trim() !== "";
    setisAddressEntered(isComplete);
  }, [address1, address2]);

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
      <div className="gap-2 px-[20px] pt-[20px]">
        <BoxedInput
          label={"주소"}
          placeholder="건물, 지번 또는 도로명 검색"
          value={address1}
          onClick={() => setShowPostcode(true)} // 클릭 시 embed 표시
          onChange={() => {}} // 직접 입력 방지
        />
        <BoxedInput
          placeholder="상세주소 (예: 101동 501호 / 단독주택)"
          value={address2}
          onChange={setAddress2}
        />
        {showPostcode && (
          <DaumPostcodeEmbed
            onComplete={address => {
              setAddress1(address);
              setShowPostcode(false); // 검색 완료되면 닫기
            }}
            onClose={() => setShowPostcode(false)} // 닫기 버튼 만들었으면 닫기 지원
          />
        )}
      </div>
      <div className="mx-5 mt-3">
        <DeliveryTimeCheck
          isDeliveryPossible={isDeliveryPossible}
          isAddressEntered={isAddressEntered}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 px-5 pb-5">
        <BottomButton
          type="1button"
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={() => {
            if (!address1 || !address2) {
              alert("주소와 상세주소를 모두 입력해주세요.");
              return;
            }

            if (!category) {
              alert("카테고리 정보가 없습니다.");
              return;
            }

            router.replace(`/order/${category}`);
          }}
        />
      </div>
    </div>
  );
}

export default AddressPage;
