"use client";

import { CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import DeliveryStatusChip from "@/components/DeliveryTimeCheck/DeliveryStatusChip";
import Input from "@/components/Input/Input";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

import AddressChangeConfirmModal from "./_components/AddressChangeConfirm";
import { track } from "@amplitude/analytics-browser";
import { trackClick } from "@/services/analytics/amplitude";
import { getScreenName } from "@/utils/screenName";

export default function AddressClientPage() {
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
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  const { updateOrder, order } = useOrderStore();

  useEffect(() => {
    setAddress1(order?.road_address || "");
    setAddress2(order?.detail_address || "");
  }, [order?.road_address, order?.detail_address]);

  useEffect(() => {
    if (!initialAddress1 && order?.road_address) {
      setInitialAddress1(order.road_address);
    }
    if (!initialAddress2 && order?.detail_address) {
      setInitialAddress2(order.detail_address);
    }
  }, [order?.road_address, order?.detail_address]);

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

  const handleSave = () => {
    const isModified = isAddress1Changed || isAddress2Changed;
    const isDeliveryBlocked = isModified && !isDeliveryPossible;

    if (isDeliveryBlocked && !confirmedAddressChange) {
      setShowConfirmModal(true);
      return;
    }

    saveAndGoBack();
  };

  const saveAndGoBack = () => {
    updateOrder({ road_address: address1, detail_address: address2 });
    setConfirmedAddressChange(false); // 저장 후 초기화
    router.back();
  };

  const isButtonDisabled = !address1 || !address2;
  const isAddressEntered = address1.trim() !== "";

  useEffect(() => {
    const fetchDeliveryAvailability = async () => {
      if (!address1.trim()) return;

      setIsCheckingDelivery(true);
      try {
        const { isToday } = await calculateDeliveryInfo(address1);
        setIsDeliveryPossible(isToday);
      } catch (error) {
        console.error("배송 가능 여부 계산 중 오류:", error);
        setIsDeliveryPossible(false);
      } finally {
        setIsCheckingDelivery(false);
      }
    };

    fetchDeliveryAvailability();
  }, [address1]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator />
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6 pb-40">
        <h1 className="mb-5 text-[23px] font-700">배송주소</h1>

        <div className="flex flex-col gap-[10px]">
          <label className="text-sm font-400 text-gray-600">주소</label>
          <DaumPostcodePopup address1={address1} onComplete={handleComplete} />

          <Input
            name="상세주소"
            type="text"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
            placeholder="상세주소 (예: 101동 501호 / 단독주택)"
            className="h-[50px] w-full px-4 py-3 text-base"
          />

          <DeliveryStatusChip
            isDeliveryPossible={isDeliveryPossible}
            isAddressEntered={isAddressEntered}
            isChecking={isCheckingDelivery}
            onUnavailableClick={() => {
              if (isCheckingDelivery) return;
              updateOrder({ road_address: address1, detail_address: address2 });
              router.push("/order/delivery/address/unavailable");
            }}
          />

          {showConfirmModal && (
            <AddressChangeConfirmModal
              onCancel={() => {
                setAddress1(initialAddress1); // 초기값으로 되돌리기
                setAddress2(initialAddress2); // 이건 상세주소까지 되돌리고 싶을 때
                setShowConfirmModal(false); // 모달 닫기
              }}
              onConfirm={() => {
                setConfirmedAddressChange(true); // 변경을 승인했음만 표시
                setShowConfirmModal(false);
              }}
            />
          )}
        </div>
      </div>
      <div className="fixed bottom-0 w-full max-w-[460px] px-5 py-5">
        <Button
          type="button"
          disabled={isButtonDisabled || isCheckingDelivery}
          onClick={() => {
            trackClick({
              object_type: "button",
              object_name: "confirm",
              current_page: getScreenName(),
              modal_name: null,
            });
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
          selected={!isButtonDisabled}
          className="w-full"
        >
          {isCheckingDelivery ? "확인 중..." : buttonText}
        </Button>
      </div>
    </div>
  );
}
