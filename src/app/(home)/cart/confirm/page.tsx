"use client";

import { deleteCartItem } from "@/api/cartApi";
import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import formatColor from "@/utils/formatColor";

import PickUpAddressCard from "../pickup/_components/PickUpAddressCard";

export default function OrderConfirmPage() {
  const router = useRouter();
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(true);
  const { address, requestMessage, customerRequest, foyerAccessType, deliveryDate, pickupInfo } =
    useOrderStore();
  const cartItems = useCartStore(state => state.cartItems);
  console.log(cartItems);

  const ALL_CATEGORIES = [
    ...DOOR_CATEGORY_LIST,
    ...ACCESSORY_CATEGORY_LIST,
    ...HARDWARE_CATEGORY_LIST,
    ...CABINET_CATEGORY_LIST,
  ];

  useEffect(() => {
    const recentOrderRaw = localStorage.getItem("recentOrder");
    if (recentOrderRaw) {
      const orderData = JSON.parse(recentOrderRaw);
      setRecentOrder(orderData);
    }
  }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("IBK 기업은행 1234-5678-1234");
    alert("계좌번호가 복사되었습니다!");
  };

  // const handleGoHome = async () => {
  //   console.log("🧾 cartItems:", cartItems);
  //   try {
  //     // 서버에서 장바구니 항목들 병렬 삭제
  //     await Promise.all(
  //       cartItems.map(
  //         item => (item.cartItemId ? deleteCartItem(item.cartItemId) : Promise.resolve()), // cartItemId 없으면 생략
  //       ),
  //     );
  //   } catch (err) {
  //     console.error("장바구니 비우기 실패:", err);
  //   }

  //   // 클라이언트 상태 초기화
  //   localStorage.removeItem("cartItems");
  //   localStorage.removeItem("recentOrder");
  //   useCurrentOrderStore.getState().clearCurrentItem();

  //   useCartStore.getState().clearCartItems();

  //   useOrderStore.getState().clearOrder();
  //   useOrderStore.persist?.clearStorage?.();

  //   router.push("/");
  // };

  // const handleGoHome = async () => {
  //   console.log("🧾 cartItems:", cartItems);

  //   try {
  //     // 서버에서 장바구니 항목들 병렬 삭제 (개별 실패 로그 추가)
  //     await Promise.all(
  //       cartItems.map(item => {
  //         if (!item.cartItemId) return Promise.resolve();

  //         return deleteCartItem(item.cartItemId).catch(err => {
  //           console.error(`❌ 삭제 실패: ${item.cartItemId}`, err);
  //         });
  //       }),
  //     );
  //   } catch (err) {
  //     console.error("장바구니 비우기 중 알 수 없는 에러 발생:", err);
  //   }

  //   // 클라이언트 상태 초기화
  //   localStorage.removeItem("cartItems");
  //   localStorage.removeItem("recentOrder");
  //   useCurrentOrderStore.getState().clearCurrentItem();

  //   useCartStore.getState().clearCartItems();

  //   useOrderStore.getState().clearOrder();
  //   useOrderStore.persist?.clearStorage?.();

  //   router.push("/");
  // };

  const handleGoHome = async () => {
    console.log("🧾 cartItems:", cartItems);

    try {
      const results = await Promise.all(
        cartItems.map(item => {
          if (!item.cartItemId) return Promise.resolve(true); // cartItemId 없는 경우는 성공으로 간주

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
    localStorage.removeItem("cartItems");
    localStorage.removeItem("recentOrder");
    useCurrentOrderStore.getState().clearCurrentItem();

    useCartStore.getState().clearCartItems();

    useOrderStore.getState().clearOrder();
    useOrderStore.persist?.clearStorage?.();

    router.push("/");
  };

  // const getHeaderFromSlug = (slug: string): string => {
  //   const found = ALL_CATEGORIES.find(item => item.slug === slug);
  //   return found?.header ?? slug;
  // };

  const getDeliveryLabel = (deliveryDate: string) => {
    const date = new Date(deliveryDate);
    const now = new Date();

    const isSameDay = date.toDateString() === now.toDateString();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isSameDay) return "당일배송";
    if (isTomorrow) return "익일배송";
    return date.toLocaleDateString();
  };

  if (!recentOrder) {
    return <p className="p-5">주문 정보가 없습니다.</p>;
  }

  console.log("🛒 cartItems 상태:", cartItems);
  console.log("🔥 recentOrder 상태:", recentOrder);
  const { order_type, recipient_phone, order_price, order_options } = recentOrder;

  return (
    <>
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
                <div className="flex justify-between gap-3">
                  <img
                    src={"/icons/bank.svg"}
                    alt="IBK기업은행 로고"
                    className="h-7 w-7 justify-start"
                  />

                  <div className="flex flex-col items-start">
                    <span className="text-[17px] font-500 text-gray-600">12345678911111</span>
                    <span className="text-sm font-500">IBK기업은행</span>
                  </div>
                  <button
                    className="rounded-lg bg-brand-50 px-[10px] py-2 text-[15px] font-500 text-brand-500"
                    onClick={handleCopyAccount}
                  >
                    복사
                  </button>
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
              <p className="pb-7 font-400 text-gray-500">알림톡 보내드리고 곧바로 배송 시작해요</p>
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

              {cartItems.map((item: any, idx: number) => {
                if (!item) return null;

                const commonPrice = (
                  <p className="mt-1 text-[15px] font-500 text-gray-800">
                    {/* {item.price?.toLocaleString()}원 {item.count}개 */}
                    {Number((item.price ?? 0) * (item.count ?? 1)).toLocaleString()}원 ∙{" "}
                    {item.count}개
                  </p>
                );

                switch (item.category) {
                  case "door":
                    // return (
                    //   <div
                    //     key={idx}
                    //     className="mb-3 border-b border-gray-200 pb-2 text-[15px] font-400 text-gray-500"
                    //   >
                    //     <p className="mb-1 text-[17px] font-600 text-gray-800">문짝</p>

                    //     <p>색상 : {item.color}</p>
                    //     <p>가로 길이 : {item.width?.toLocaleString()}mm</p>
                    //     <p>세로 길이 : {item.height?.toLocaleString()}mm</p>
                    //     <p>경첩 개수 : {item.hingeCount ?? "-"}</p>
                    //     <p>경첩 방향 : {item.hingeDirection === "left" ? "좌경" : "우경"}</p>
                    //     <p>보링 치수 : {item.boring}</p>
                    //     {item.doorRequest && <p>추가 요청: {item.doorRequest}</p>}
                    //     {commonPrice}
                    //   </div>
                    // );
                    return (
                      <div
                        key={idx}
                        className="mb-3 border-b border-gray-200 pb-2 text-[15px] font-400 text-gray-500"
                      >
                        <p className="mb-1 text-[17px] font-600 text-gray-800">문짝</p>
                        <p>색상 : {formatColor(item.color)}</p>
                        <p>가로 길이 : {Number(item.width).toLocaleString()}mm</p>
                        <p>세로 길이 : {Number(item.height).toLocaleString()}mm</p>
                        <p>경첩 개수 : {item.hingeCount ?? "-"}</p>
                        <p>경첩 방향 : {item.hingeDirection === "left" ? "좌경" : "우경"}</p>
                        <p>보링 치수 : {item.boring || "-"}</p>
                        {item.doorRequest && <p>제작 시 요청사항 : {item.doorRequest}</p>}
                        {commonPrice}
                      </div>
                    );
                  case "finish":
                    // return (
                    //   <div key={idx} className="mb-3 border-b border-gray-200 pb-2">
                    //     <p className="font-semibold">마감재</p>
                    //     <p>색상 : {item.color}</p>
                    //     <p>깊이 : {item.depth.baseDepth?.toLocaleString()}mm</p>
                    //     {item.depth.additionalDepth && (
                    //       <p>
                    //         ⤷ 깊이 키움 : {item.depth.additionalDepth?.toLocaleString() ?? ""}mm
                    //       </p>
                    //     )}
                    //     <p>높이 : {item.height.baseHeight?.toLocaleString() ?? ""}mm</p>
                    //     {item.height.additionalHeight && (
                    //       <p>
                    //         ⤷ 높이 키움 : {item.height.additionalHeight?.toLocaleString() ?? ""}mm
                    //       </p>
                    //     )}
                    //     {item.finishRequest && <p>요청 사항 : {item.finishRequest}</p>}
                    //     {commonPrice}
                    //   </div>
                    // );
                    const baseDepth = Number(item.baseDepth ?? 0);
                    const additionalDepth = Number(item.additionalDepth ?? 0);
                    const totalDepth = baseDepth + additionalDepth;

                    const baseHeight = Number(item.baseHeight ?? 0);
                    const additionalHeight = Number(item.additionalHeight ?? 0);
                    const totalHeight = baseHeight + additionalHeight;

                    return (
                      <div
                        key={idx}
                        className="mb-3 border-b border-gray-200 pb-2 text-[15px] font-400 text-gray-500"
                      >
                        <p className="mb-1 text-[17px] font-600 text-gray-800">마감재</p>
                        <p>색상 : {formatColor(item.color)}</p>
                        <p>깊이 : {baseDepth.toLocaleString()}mm</p>
                        {additionalDepth > 0 && (
                          <p>⤷ 깊이 키우기 : {additionalDepth.toLocaleString()}mm</p>
                        )}
                        <p>⤷ 합산 깊이 : {totalDepth.toLocaleString()}mm</p>
                        <p>높이 : {baseHeight.toLocaleString()}mm</p>
                        {additionalHeight > 0 && (
                          <p>⤷ 높이 키우기 : {additionalHeight.toLocaleString()}mm</p>
                        )}
                        <p>⤷ 합산 높이 : {totalHeight.toLocaleString()}mm</p>
                        {item.finishRequest && <p>제작 시 요청사항 : {item.finishRequest}</p>}
                        {commonPrice}
                      </div>
                    );
                  case "hardware":
                    // return (
                    //   <div key={idx} className="mb-3 border-b border-gray-200 pb-2">
                    //     <p className="font-semibold">하드웨어</p>
                    //     <p>제조사 : {item.madeBy}</p>
                    //     <p>모델명 : {item.model}</p>
                    //     {item.hardwareRequests && <p>요청 사항 : {item.hardwareRequests}</p>}
                    //     {commonPrice}
                    //   </div>
                    // );
                    return (
                      <div key={idx} className="mb-3 border-b border-gray-200 pb-2">
                        <p className="font-semibold">하드웨어</p>
                        <p>제조사 : {item.madeBy}</p>
                        <p>사이즈 : {item.size?.toLocaleString()}mm</p>
                        {item.hardwareRequests && <p>제작 시 요청사항 : {item.hardwareRequests}</p>}
                        {commonPrice}
                      </div>
                    );

                  case "cabinet":
                    return (
                      <div key={idx} className="mb-3 border-b border-gray-200 pb-2">
                        <p className="font-semibold">수납장</p>
                        {item.handleType && <p>손잡이 종류: {item.handleType}</p>}
                        {item.compartmentCount !== 0 && <p>구성 칸 수: {item.compartmentCount}</p>}
                        {item.flapStayType && <p>쇼바 종류: {item.flapStayType}</p>}
                        <p>색상 : {formatColor(item.color)}</p>
                        <p>두께: {item.thickness}</p>
                        <p>너비: {item.width}mm</p>
                        <p>깊이: {item.depth}mm</p>
                        <p>높이: {item.height}mm</p>
                        <p>마감 방식: {item.finishType ? item.finishType : "선택 안됨"}</p>
                        <p>서랍 종류: {item.drawerType}</p>
                        <p>레일 종류: {item.railType}</p>
                        {item.cabinetRequests && <p>제작 시 요청사항 : {item.cabinetRequests}</p>}
                        {commonPrice}
                      </div>
                    );

                  case "accessory":
                    return (
                      <div key={idx} className="mb-3 border-b border-gray-200 pb-2">
                        <p className="font-semibold">액세서리</p>
                        <p>제조사 : {item.madeBy}</p>
                        <p>모델명 : {item.model}</p>
                        {item.accessoryRequests && (
                          <p>제작 시 요청사항 : {item.accessoryRequests}</p>
                        )}
                        {commonPrice}
                      </div>
                    );

                  default:
                    return null;
                }
              })}
              <div className="mb-2 mt-3 border-b border-gray-200 pb-3 text-gray-500">
                <p className="mb-1 text-[17px] font-600 text-gray-800">배송일정</p>
                {order_type === "PICK_UP" ? (
                  <p>당일배송</p>
                ) : (
                  <p>{getDeliveryLabel(deliveryDate ?? "")}</p>
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

              {/* <div className="my-4 border-b border-gray-200 pb-3 text-gray-500">
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
              </div> */}
              <div className="text-gray-500">
                <p className="mb-1 text-[17px] font-600 text-gray-800">받는 분 휴대폰 번호</p>
                <p>{recipient_phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 p-5">
        <Button className="flex-1" onClick={handleGoHome}>
          홈으로
        </Button>
        <Button selected className="flex-1" onClick={handleCopyAccount}>
          계좌번호 복사
        </Button>
      </div>
    </>
  );
}
