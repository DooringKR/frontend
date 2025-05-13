"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";

export default function OrderConfirmPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    const recentOrderRaw = localStorage.getItem("recentOrder");
    if (recentOrderRaw) {
      const orderData = JSON.parse(recentOrderRaw);
      setOrder(orderData);
    }
  }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("토스뱅크 1234-5678-1234");
    alert("계좌번호가 복사되었습니다!");
  };

  const handleGoHome = () => {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("recentOrder");
    useCurrentOrderStore.getState().clearCurrentItem();
    router.push("/");
  };

  if (!order) {
    return <p className="p-5">주문 정보가 없습니다.</p>;
  }

  return (
    <div className="flex flex-col p-5 pb-20">
      <p className="mb-2 font-semibold text-green-600">주문 접수 완료</p>
      <p className="mb-4 text-xl font-bold leading-tight">
        {order.recipientPhoneNumber}로
        <br />
        10분 안에 확인 전화드려요
      </p>
      <div className="relative w-full">
        <Image
          src="/img/Checker.png"
          alt="통화이미지"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full object-contain"
        />
      </div>
      <p className="mb-5 mt-10">
        전화로 주문을 확인하면 <br />
        결제금액을 아래 계좌로 송금해주세요
      </p>
      <div className="mb-4 w-full bg-gray-300 p-4">
        <div className="mb-2 flex justify-between">
          <span>결제금액</span>
          <span>{order.totalPrice.toLocaleString()}원</span>
        </div>
        <hr className="my-2 border-black" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-blue-600">토스뱅크 1234-5678-1234</span>
          <button className="text-sm" onClick={handleCopyAccount}>
            복사
          </button>
        </div>
      </div>

      <div className="mb-4 w-full bg-gray-300">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full justify-between p-3"
        >
          <span className="font-semibold">주문내역 보기</span>
          <Image src="/icons/Arrow_Bottom.svg" width={15} height={7.5} alt="토글버튼" />
        </button>
        {showDetails && (
          <div className="border-black p-3 text-sm">
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">총 결제금액</span>
              <span>{order.totalPrice.toLocaleString()}원</span>
            </div>
            <hr className="my-3 border-black" />
            {order.cartItems.map((item: any, idx: number) => {
              if (!item) return null;

              const commonPrice = (
                <p className="mt-1 font-semibold">
                  {item.price?.toLocaleString()}원 {item.count}개
                </p>
              );

              switch (item.category) {
                case "door":
                  return (
                    <div key={idx} className="mb-3 border-b border-black pb-2">
                      <p className="font-semibold">문짝</p>
                      <p>색상 : {item.color}</p>
                      <p>가로 길이 : {item.width?.toLocaleString()}mm</p>
                      <p>세로 길이 : {item.height?.toLocaleString()}mm</p>
                      <p>경첩 개수 : {item.hinge?.hingeCount ?? "-"}</p>
                      <p>경첩 방향 : {item.hinge?.hingePosition === "left" ? "좌경" : "우경"}</p>
                      <p>
                        보링 치수 : 상{item.hinge?.topHinge ?? "-"}
                        {item.hinge?.middleHinge ? `, 중${item.hinge.middleHinge}` : ""}
                        {item.hinge?.bottomHinge ? `, 하${item.hinge.bottomHinge}` : ""}
                      </p>
                      {item.doorRequest && <p>추가 요청: {item.doorRequest}</p>}
                      {commonPrice}
                    </div>
                  );

                case "finish":
                  return <div key={idx} className="mb-3 border-b border-black pb-2"></div>;

                case "hardware":
                  return <div key={idx} className="mb-3 border-b border-black pb-2"></div>;

                case "cabinet":
                  return <div key={idx} className="mb-3 border-b border-black pb-2"></div>;

                case "accessory":
                  return <div key={idx} className="mb-3 border-b border-black pb-2"></div>;

                default:
                  return null;
              }
            })}
            <div className="mb-2 mt-3 border-b border-black pb-3">
              <p className="font-semibold">배송일정</p>
              <p>당일배송</p>
            </div>
            <div className="mb-2 border-b border-black pb-3">
              <p className="font-semibold">배송주소</p>
              <p>{order.address1}</p>
              <p>{order.address2}</p>
            </div>
            <div className="mb-2 border-b border-black pb-3">
              <p className="font-semibold">배송기사 요청사항</p>
              <p>{order.deliveryRequest}</p>
              {order.foyerAccessType?.gatePassword && (
                <p>공동현관 비밀번호: {order.foyerAccessType.gatePassword}</p>
              )}
            </div>
            <div className="mb-2 border-b border-black pb-3">
              <p className="font-semibold">현장에서 받는 분 연락처</p>
              <p>{order.recipientPhoneNumber}</p>
            </div>

            <div className="mb-2">
              <p className="font-semibold">바로가구 요청사항</p>
              <p>{order.otherRequests || "없음"}</p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleGoHome}>
          홈으로
        </Button>
        <Button selected className="flex-1" onClick={handleCopyAccount}>
          계좌 복사
        </Button>
      </div>
    </div>
  );
}
