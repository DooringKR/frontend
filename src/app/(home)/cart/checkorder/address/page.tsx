"use client";

import { CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import DeliveryTimeCheck from "@/components/DeliveryTimeCheck/DeliveryStatusChip";
import Input from "@/components/Input/Input";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

import AddressChangeConfirmModal from "./_components/AddressChangeConfirm";

export default function CheckOrderAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlug = searchParams.get("category") || "etc";
  const matchedCategory = CATEGORY_LIST.find(item => item.slug === categorySlug);
  const categoryName = matchedCategory?.name || "기타";

  // 초기값 저장용
  const [initialAddress1, setInitialAddress1] = useState("");
  const [initialAddress2, setInitialAddress2] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedAddressChange, setConfirmedAddressChange] = useState(false);

  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [deliveryMessageColor, setDeliveryMessageColor] = useState<string>("text-[#14ae5c]");
  const [isDeliveryPossible, setIsDeliveryPossible] = useState(false);

  const { setAddress, address } = useOrderStore();

  // 마운트 시 Zustand에서 불러온 주소 저장
  // useEffect(() => {
  //   setAddress1(address.address1 || "");
  //   setAddress2(address.address2 || "");
  //   setInitialAddress1(address.address1 || "");
  //   setInitialAddress2(address.address2 || "");
  // }, [address.address1, address.address2]);

  useEffect(() => {
    setAddress1(address.address1 || "");
    setAddress2(address.address2 || "");
  }, [address.address1, address.address2]);

  useEffect(() => {
    if (!initialAddress1 && address.address1) {
      setInitialAddress1(address.address1);
    }
    if (!initialAddress2 && address.address2) {
      setInitialAddress2(address.address2);
    }
  }, [address.address1, address.address2]);

  // // 버튼 텍스트 조건
  // // const isModified = address1 !== initialAddress1 || address2 !== initialAddress2;
  // const isModified = address1 !== initialAddress1;
  // // const buttonText = isModified ? "변경하기" : "저장하기";
  // const buttonText = isModified && !confirmedAddressChange ? "변경하기" : "저장하기";
  const isAddress1Changed = address1 !== initialAddress1;
  const isAddress2Changed = address2 !== initialAddress2;

  let buttonText = "저장하기";

  if (!isAddress1Changed && !isAddress2Changed) {
    buttonText = "확인";
  } else if (isAddress1Changed && !confirmedAddressChange && !isDeliveryPossible) {
    buttonText = "변경하기";
  }

  const handleComplete = async (address: string) => {
    setAddress1(address);

    const { expectedArrivalMinutes } = await DeliverTime(address);

    const cutoff = 18 * 60;
    if (expectedArrivalMinutes <= cutoff) {
      setDeliveryMessage(`지금 주문하면 당일 배송되는 주소예요.`);
      setDeliveryMessageColor("text-[#14ae5c]");
      setIsDeliveryPossible(true);
    } else {
      setDeliveryMessage(`지금 주문하면 내일 배송되는 주소예요.`);
      setDeliveryMessageColor("text-[#bf6a02]");
      setIsDeliveryPossible(false);
    }
  };

  // const handleSave = () => {
  //   setAddress({ address1, address2 });
  //   //  localStorage.setItem("order-address", JSON.stringify(addressData));
  //   localStorage.setItem("address-storage", JSON.stringify({ state: { address1, address2 } }));
  //   router.back(); // 뒤로가기
  // };

  // const handleSave = () => {
  //   if (isModified && !isDeliveryPossible && !confirmedAddressChange) {
  //     setShowConfirmModal(true);
  //     return;
  //   }

  //   saveAndGoBack();
  // };

  const handleSave = () => {
    // const isDeliveryBlocked = isModified && !isDeliveryPossible;
    const isModified = isAddress1Changed || isAddress2Changed; // ← 이 줄 추가
    const isDeliveryBlocked = isModified && !isDeliveryPossible;

    if (isDeliveryBlocked && !confirmedAddressChange) {
      setShowConfirmModal(true);
      return;
    }

    saveAndGoBack();
  };

  const saveAndGoBack = () => {
    setAddress({ address1, address2 });
    localStorage.setItem("address-storage", JSON.stringify({ state: { address1, address2 } }));
    setConfirmedAddressChange(false); // 저장 후 초기화
    router.back();
  };

  const isButtonDisabled = !address1 || !address2;
  const isAddressEntered = address1.trim() !== "" && address2.trim() !== "";

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator />
      <div className="flex flex-grow flex-col px-5 py-6">
        <h1 className="mb-5 text-[23px] font-700">배송주소</h1>

        <div className="flex flex-grow flex-col gap-[10px]">
          <label className="text-sm font-400 text-gray-600">주소</label>
          <DaumPostcodePopup address1={address1} onComplete={handleComplete} />

          {deliveryMessage && (
            <p
              className={`mt-[-10px] h-[49px] w-full rounded-[10px] bg-[#f4f4f4] px-4 pt-[18px] text-base ${deliveryMessageColor}`}
            >
              {deliveryMessage}
            </p>
          )}

          <Input
            name="상세주소"
            type="text"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
            placeholder="상세주소 (예: 101동 501호 / 단독주택)"
            className="h-[50px] w-full px-4 py-3 text-base"
          />

          <DeliveryTimeCheck
            isDeliveryPossible={isDeliveryPossible}
            isAddressEntered={isAddressEntered}
            onUnavailableClick={() => {
              setAddress({ address1, address2 });
              router.push("/cart/checkorder/address/unavailable");
            }}
          />

          {showConfirmModal && (
            <AddressChangeConfirmModal
              // onCancel={() => setShowConfirmModal(false)}
              // onConfirm={() => {
              //   handleSave();
              //   setShowConfirmModal(false);
              // }}
              onCancel={() => {
                setAddress1(initialAddress1); // 초기값으로 되돌리기
                setAddress2(initialAddress2); // 이건 상세주소까지 되돌리고 싶을 때
                setShowConfirmModal(false); // 모달 닫기
              }}
              onConfirm={() => {
                // saveAndGoBack(); // 바로 저장하고 뒤로가기
                setConfirmedAddressChange(true); // 변경을 승인했음만 표시
                setShowConfirmModal(false);
              }}
            />
          )}
        </div>

        <Button
          type="button"
          // onClick={handleSave}
          // onClick={() => {
          //   if (isModified && !isDeliveryPossible) {
          //     setShowConfirmModal(true);
          //   } else {
          //     handleSave();
          //   }
          // }}
          onClick={() => {
            if (!isAddress1Changed && !isAddress2Changed) {
              router.back(); // 변경사항 없으면 확인 누르면 뒤로가기
              return;
            }

            if (isAddress1Changed && !isDeliveryPossible && !confirmedAddressChange) {
              setShowConfirmModal(true); // 주소 변경, 오늘배송 불가 → 모달 띄움
              return;
            }

            handleSave(); // 나머지는 저장하기 동작
          }}
          disabled={isButtonDisabled}
          selected={!isButtonDisabled}
          className="mt-6 w-full"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
