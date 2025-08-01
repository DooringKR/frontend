"use client";

import { deleteCartItem } from "@/api/cartApi";
import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
import {
  AccessoryItem,
  CabinetItem,
  DoorItem,
  FinishItem,
  HardwareItem,
} from "@/types/newItemTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { formatBoringDirection } from "@/utils/formatBoring";
import formatColor from "@/utils/formatColor";
import { getCategoryLabel } from "@/utils/getCategoryLabel";

import PickUpAddressCard from "../pickup/_components/PickUpAddressCard";
import OrderConfirmCard from "./_components/OrderConfirmCard";

export default function OrderConfirmPage() {
  const router = useRouter();
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(true);
  const {
    address,
    requestMessage,
    customerRequest,
    foyerAccessType,
    deliveryDate,
    pickupInfo,
    deliveryType,
  } = useOrderStore();
  const cartItems = useCartStore(state => state.cartItems);
  console.log(cartItems);

  useEffect(() => {
    const recentOrderRaw = localStorage.getItem("recentOrder");
    if (recentOrderRaw) {
      const orderData = JSON.parse(recentOrderRaw);
      setRecentOrder(orderData);
    }
  }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("IBK기업은행 52307836904011");
    alert("계좌번호가 복사되었습니다!");
  };

  const handleGoHome = async () => {
    console.log("🧾 cartItems:", cartItems);

    try {
      const results = await Promise.all(
        cartItems.map(item => {
          if (!item.cartItemId) return Promise.resolve(true); // cartItemId 없는 경우는 생략

          return deleteCartItem(item.cartItemId)
            .then(() => true)
            .catch(err => {
              console.error(`❌ 삭제 실패: ${item.cartItemId}`, err);
              return false;
            });
        }),
      );

      const allSucceeded = results.every(result => result === true);

      if (allSucceeded) {
        console.log("✅ 모든 장바구니 항목이 성공적으로 삭제되었습니다.");
      } else {
        console.warn("⚠ 일부 장바구니 항목 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("장바구니 비우기 중 알 수 없는 에러 발생:", err);
    }

    // 클라이언트 상태 초기화
    localStorage.removeItem("recentOrder");
    useCurrentOrderStore.getState().clearCurrentItem();

    useCartStore.getState().clearCartItems();

    useOrderStore.getState().clearOrder();
    useOrderStore.persist?.clearStorage?.();

    router.push("/");
  };

  if (!recentOrder) {
    return <p className="p-5">주문 정보가 없습니다.</p>;
  }

  // console.log("🛒 cartItems 상태:", cartItems);
  // console.log("🔥 recentOrder 상태:", recentOrder);
  const { order_type, recipient_phone, order_price, order_options } = recentOrder;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto pb-[100px]">
        <div className="flex flex-col px-5 pt-[60px]">
          <p className="mb-2 text-[23px] font-700 text-gray-900">주문이 잘 접수되었어요</p>
          <p className="text-[17px] font-400 text-gray-500">남은 단계를 확인해주세요.</p>
          <div className="flex items-center justify-center py-10">
            <img src={"/icons/check-mark-green.svg"} alt="체크 아이콘" className="h-24 w-24" />
          </div>
          <div className="mb-10 mt-5 flex flex-col gap-2">
            <div>
              <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  1
                </div>
                <div>바로가구에서 주문 확인하면</div>
              </div>
              <div className="mt-2 flex">
                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                <p className="pb-7 font-400 text-gray-500">
                  {recipient_phone}로
                  <br />
                  10분 안에 확인 전화드려요
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  2
                </div>
                <div>주문금액을 아래 계좌로 송금하고</div>
              </div>
              <div className="mt-2 flex">
                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                <div className="flex w-[291px] flex-col gap-5 rounded-xl border border-gray-200 p-4 pb-7 font-400 text-gray-400">
                  <div className="flex flex-col">
                    <span className="text-sm font-500">주문금액</span>
                    <span className="text-xl font-600 text-blue-500">
                      {order_price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <img
                      src={"/icons/bank.svg"}
                      alt="IBK기업은행 로고"
                      className="h-7 w-7 justify-start"
                    />

                    <div className="flex flex-col items-start">
                      <span className="text-[17px] font-500 text-gray-600">52307836904011</span>
                      <span className="text-sm font-500">IBK기업은행</span>
                    </div>
                    <div>
                      <button
                        className="cursor-pointer rounded-lg bg-brand-50 px-[10px] py-[5px] text-[15px] font-500 text-brand-500"
                        onClick={handleCopyAccount}
                      >
                        복사
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  3
                </div>
                <div>바로가구에서 입금 확인하면</div>
              </div>
              <div className="mt-2 flex">
                <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                <p className="pb-7 font-400 text-gray-500">
                  알림톡 보내드리고 곧바로 배송 시작해요
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 text-[17px] font-600 text-gray-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  4
                </div>
                <div>
                  {order_type === "PICK_UP"
                    ? "아래 주소에서 픽업할 수 있어요"
                    : "퀵 ∙ 용달로 오늘까지 배송해드려요"}
                </div>
              </div>
              {order_type === "PICK_UP" ? (
                <div className="mt-2 flex">
                  <div className="mx-[14.5px] w-[3px] rounded-full bg-gray-200"></div>
                  <PickUpAddressCard page="pickup" />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-5 py-10">
          <div className="w-full">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full justify-between rounded-xl bg-white p-3"
            >
              <span className="font-semibold">주문내역 확인</span>
              <Image src="/icons/Arrow_Bottom.svg" width={15} height={7.5} alt="토글버튼" />
            </button>
            {showDetails && (
              <div className="mt-2 rounded-xl bg-white p-5 text-sm">
                <div className="mb-5 flex justify-between">
                  <span className="text-[17px] font-600">주문 상품</span>
                </div>

                <div className="flex flex-col gap-5 border-b border-gray-200 pb-3">
                  {cartItems.map((item, i) => {
                    if (!item) return null;
                    const category = item.category;
                    const key = `${category}-${i}`;

                    if (category === "door") {
                      const doorItem = item as DoorItem;

                      return (
                        <OrderConfirmCard
                          key={key}
                          type="door"
                          title={getCategoryLabel(doorItem.doorType, DOOR_CATEGORY_LIST, "문짝")}
                          color={formatColor(doorItem.color)}
                          width={Number(doorItem.width)}
                          height={Number(doorItem.height)}
                          hingeCount={doorItem.hingeCount > 0 ? doorItem.hingeCount : undefined}
                          hingeDirection={formatBoringDirection(doorItem.hingeDirection)}
                          boring={doorItem.boring}
                          quantity={doorItem.count}
                          price={item.price}
                        />
                      );
                    }

                    if (category === "finish") {
                      const finishItem = item as FinishItem;

                      return (
                        <OrderConfirmCard
                          key={key}
                          type="finish"
                          title="마감재"
                          color={formatColor(finishItem.color)}
                          depth={finishItem.baseDepth ?? undefined}
                          depthIncrease={finishItem.additionalDepth ?? undefined}
                          height={finishItem.baseHeight ?? undefined}
                          heightIncrease={finishItem.additionalHeight ?? undefined}
                          request={finishItem.finishRequest ?? undefined}
                          quantity={finishItem.count ?? 0}
                          price={item.price}
                        />
                      );
                    }

                    if (category === "cabinet") {
                      const cabinetItem = item as CabinetItem;

                      return (
                        <OrderConfirmCard
                          key={key}
                          type="cabinet"
                          title={getCategoryLabel(
                            cabinetItem.cabinetType,
                            CABINET_CATEGORY_LIST,
                            "부분장",
                          )}
                          color={formatColor(cabinetItem.color ?? "")}
                          width={Number(cabinetItem.width ?? 0)}
                          height={Number(cabinetItem.height ?? 0)}
                          depth={Number(cabinetItem.depth ?? 0)}
                          bodyMaterial={cabinetItem.bodyMaterial ?? ""}
                          handleType={cabinetItem.handleType ?? ""}
                          finishType={cabinetItem.finishType ?? ""}
                          showBar={cabinetItem.showBar ?? ""}
                          drawerType={cabinetItem.drawerType ?? ""}
                          railType={cabinetItem.railType ?? ""}
                          request={cabinetItem.request ?? ""}
                          quantity={cabinetItem.count ?? 0}
                          price={item.price}
                        />
                      );
                    }

                    if (category === "accessory") {
                      const accessoryItem = item as AccessoryItem;

                      return (
                        <OrderConfirmCard
                          key={key}
                          type="accessory"
                          title={getCategoryLabel(
                            accessoryItem.accessoryType,
                            ACCESSORY_CATEGORY_LIST,
                            "부속",
                          )}
                          manufacturer={accessoryItem.manufacturer}
                          modelName={accessoryItem.modelName}
                          size={accessoryItem.size}
                          quantity={accessoryItem.count}
                          request={accessoryItem.accessoryRequest ?? undefined}
                          // price={item.price}
                          price={"별도 견적"}
                        />
                      );
                    }

                    if (category === "hardware") {
                      const hardwareItem = item as HardwareItem;
                      return (
                        <OrderConfirmCard
                          key={key}
                          type="hardware"
                          title={getCategoryLabel(
                            hardwareItem.hardwareType,
                            HARDWARE_CATEGORY_LIST,
                            "하드웨어",
                          )}
                          manufacturer={hardwareItem.madeBy}
                          size={hardwareItem.size ? `${hardwareItem.size}mm` : ""}
                          request={hardwareItem.hardwareRequest ?? ""}
                          quantity={hardwareItem.count}
                          // price={item.price}
                          price={"별도 견적"}
                        />
                      );
                    }

                    return null;
                  })}
                </div>

                <div className="mb-2 mt-3 border-b border-gray-200 pb-3 text-gray-500">
                  <p className="mb-1 text-[17px] font-600 text-gray-800">배송일정</p>
                  {order_type === "PICK_UP" ? (
                    <p>픽업 예정</p>
                  ) : (
                    <p>
                      {deliveryType === "today"
                        ? "당일배송"
                        : deliveryType === "tomorrow"
                          ? "익일배송"
                          : deliveryDate
                            ? new Date(deliveryDate).toLocaleDateString()
                            : "배송일정 없음"}
                    </p>
                  )}
                </div>
                {order_type !== "PICK_UP" && (
                  <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
                    <p className="mb-1 text-[17px] font-600 text-gray-800">배송주소</p>
                    <p>{address.address1}</p>
                    <p>{address.address2}</p>
                  </div>
                )}

                {order_type === "PICK_UP" ? (
                  <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
                    <p className="mb-1 text-[17px] font-600 text-gray-800">픽업 차량 정보</p>
                    {pickupInfo.vehicleType === "직접 입력" ? (
                      <>
                        <p>직접입력</p>
                        <p>{pickupInfo.customVehicleNote || "내용 없음"}</p>
                      </>
                    ) : (
                      <p>{pickupInfo.vehicleType || "미입력"}</p>
                    )}
                  </div>
                ) : (
                  <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
                    <p className="mb-1 text-[17px] font-600 text-gray-800">배송기사 요청사항</p>
                    {foyerAccessType?.type === "gate" && (
                      <>
                        <p>공동현관으로 올라오세요</p>
                        {foyerAccessType.gatePassword && (
                          <p>공동현관 비밀번호: {foyerAccessType.gatePassword}</p>
                        )}
                      </>
                    )}
                    {foyerAccessType?.type === "call" && <p>전화주시면 마중 나갈게요</p>}
                    {foyerAccessType?.type === "doorfront" && <p>문 앞에 두면 가져갈게요</p>}
                    {foyerAccessType?.type === "custom" && foyerAccessType.customRequest && (
                      <>
                        <p>직접입력</p>
                        <p>{foyerAccessType.customRequest}</p>
                      </>
                    )}
                  </div>
                )}

                <div className="text-gray-500">
                  <p className="mb-1 text-[17px] font-600 text-gray-800">받는 분 휴대폰 번호</p>
                  <p>{recipient_phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 z-50 flex w-full max-w-[500px] gap-3 bg-white p-5">
          <Button className="flex-1" onClick={handleGoHome}>
            홈으로
          </Button>
          <Button selected className="flex-1" onClick={handleCopyAccount}>
            계좌번호 복사
          </Button>
        </div>
      </div>
    </div>
  );
}
