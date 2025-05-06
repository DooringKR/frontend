"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "zod";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

import DeliveryAddressCard from "./_components/DeliveryAddressCard";
import DeliveryScheduleSelector from "./_components/DeliveryScheduleSelector";

function CheckOrder() {
  const { currentItem } = useCurrentOrderStore();
  const router = useRouter();
  const [expectedArrivalMinutes, setExpectedArrivalMinutes] = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [address, setAddress] = useState({ address1: "", address2: "" });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const [requestMessage, setRequestMessage] = useState("");

  const [foyerAccessType, setFoyerAccessType] = useState<{
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  }>({
    type: "call", // 기본값은 "call"
    gatePassword: null, // 기본값 null
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const userRaw = localStorage.getItem("userData");
    const selectedAddress = saved.state?.selectedAddress || "주소 없음";
    if (saved.state) setAddress(saved.state);
    if (userRaw) setPhoneNumber(JSON.parse(userRaw).state?.user_phoneNumber || "");

    const fetchDeliveryTime = async () => {
      if (selectedAddress !== "주소 없음") {
        const { expectedArrivalMinutes } = await DeliverTime(selectedAddress);
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const remainingMinutes = expectedArrivalMinutes - currentMinutes;

        setExpectedArrivalMinutes(remainingMinutes);

        const cutoff = 18 * 60;
        const hours = Math.floor(expectedArrivalMinutes / 60)
          .toString()
          .padStart(2, "0");
        const minutes = (expectedArrivalMinutes % 60).toString().padStart(2, "0");

        if (expectedArrivalMinutes <= cutoff) {
          setDeliveryMessage(`당일배송 가능 ${hours}:${minutes}`);
          setDeliveryMessageColor("bg-[#cbdcfb] text-[#215cff]");
        } else {
          setDeliveryMessage(`내일 배송되는 주소에요`);
          setDeliveryMessageColor("bg-gray-500 text-[#bf6a02]");
        }
      }
    };

    fetchDeliveryTime();
  }, []);

  return (
    <div className="flex flex-col p-5 pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">주문하기</h1>

      <div className={`mb-4 p-2 text-center font-medium ${deliveryMessageColor}`}>
        {deliveryMessage}
      </div>

      <DeliveryScheduleSelector
        expectedArrivalMinutes={expectedArrivalMinutes}
        setDeliveryDate={setDeliveryDate}
      />

      <section className="mb-4">
        <h2 className="mb-2 font-medium">배송 정보를 확인해주세요</h2>
        <DeliveryAddressCard
          foyerAccessType={foyerAccessType}
          setFoyerAccessType={setFoyerAccessType}
          address={address}
          requestMessage={requestMessage}
          setRequestMessage={setRequestMessage}
          setAddress={setAddress}
        />

        <button onClick={() => router.push("/request/delivery")} className="text-blue-500">
          배송기사 요청사항 선택
        </button>
        <button onClick={() => router.push("/request/phone")} className="text-blue-500">
          받는 분 휴대폰 번호 수정
        </button>
        <button onClick={() => router.push("/request/door")} className="text-blue-500">
          도어링 요청사항 입력
        </button>
      </section>

      <button
        className="w-full rounded bg-black py-3 text-white"
        onClick={() => alert("결제 요청 처리")}
      >
        주문하기
      </button>
    </div>
  );
}

export default CheckOrder;
