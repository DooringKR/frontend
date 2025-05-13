"use client";

import { checkHardWarePrice } from "@/api/checkcash";
import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

import useHardwareStore from "@/store/Items/hardwareStore";

import MadeBy from "./_components/MadeBy";
import Model from "./_components/Model";

function SelectPage() {
  if (typeof window === "undefined") return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug") as "hinge" | "rail" | "bolt";

  const currentCategory = ACCESSORY_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "하드웨어";

  const [madeBy, setMadeBy] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [hardwareRequests, setHardwareRequests] = useState<string | null>(null);

  const getInputStatusText = () => {
    if (!madeBy) return "제조사를";
    if (!model) return "모델명을";
    if (hardwareRequests === null) return "요청 사항을";
  };

  // const handleNext = async () => {
  //   if (!slug || !madeBy || !model) return;

  //   const payload = {
  //     category: "hardware",
  //     slug,
  //     madeBy,
  //     model,
  //     hardwareRequests: hardwareRequests ? hardwareRequests: "",
  //   } as const;

  //   console.log("보내는 payload:", payload);

  //   try {
  //     const data = await checkHardWarePrice(payload);

  //     console.log("응답 data:", data);

  //     useHardwareStore.getState().updateItem({
  //       category: "hardware",
  //       slug: data.slug,
  //       madeBy: data.madeBy,
  //       model: data.model,
  //       hardwareRequests: data.hardwareRequests,
  //       price: data.price,
  //     });

  //     router.push("/order/hardware/confirm");
  //   } catch (err) {
  //     console.error("에러 발생:", err);
  //     alert("가격 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const handleNext = async () => {
    if (!slug || !madeBy || !model) return;

    try {
      useHardwareStore.getState().updateItem({
        category: "hardware",
        slug,
        madeBy,
        model,
        hardwareRequests,
        price: 10000,
      });

      router.push("/order/hardware/confirm");
    } catch (err) {
      alert("가격 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSkipRequest = () => {
    setHardwareRequests("");
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-24">
      <h1 className="text-2xl font-bold leading-snug">
        {hardwareRequests !== null ? (
          <>
            입력한 <span className="text-[#AD46FF]">{header}</span> 정보를
            <br />
            확인해주세요
          </>
        ) : (
          <>
            <span className="text-[#AD46FF]">{header}</span> {getInputStatusText()}
            <br />
            입력해주세요
          </>
        )}
      </h1>
      <MadeBy setMadeBy={setMadeBy} madeBy={madeBy} />
      {madeBy && <Model setModel={setModel} model={model} />}
      {model && (
        <div className="flex flex-col gap-2">
          <label>요청사항</label>
          <Input
            type="text"
            name="요청사항"
            placeholder="요청사항을 입력해주세요"
            onChange={e => setHardwareRequests(e.target.value)}
            value={hardwareRequests ?? ""}
          />
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-10 h-20 w-full bg-white">
        {hardwareRequests === null ? (
          <Button
            className="fixed bottom-5 left-5 right-5 mt-16 rounded-md text-white"
            onClick={handleSkipRequest}
          >
            요청사항 생략하기
          </Button>
        ) : (
          <Button
            className="fixed bottom-5 left-5 right-5 rounded-md text-white"
            onClick={handleNext}
          >
            확인
          </Button>
        )}
      </div>
    </div>
  );
}

export default SelectPage;
