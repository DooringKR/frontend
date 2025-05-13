"use client";

import { checkAccessoryPrice } from "@/api/checkcash";
import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

import useAccessoryStore from "@/store/Items/accessoryStore";

import MadeBy from "./_components/MadeBy";
import Model from "./_components/Model";

function SelectPage() {
  if (typeof window === "undefined") return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug") as "sinkBowl" | "cooktop" | "hood";

  const currentCategory = ACCESSORY_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "문짝";

  const [madeBy, setMadeBy] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [accessoryRequests, setAccessoryRequests] = useState<string | null>(null);

  const getInputStatusText = () => {
    if (!madeBy) return "제조사를";
    if (!model) return "모델명을";
    if (accessoryRequests === null) return "요청 사항을";
  };

  //   const handleNext = async () => {
  //   if (!slug || !madeBy || !model) return;

  //   const payload = {
  //     category: "accessory",
  //     slug,
  //     madeBy,
  //     model,
  //     accessoryRequests: accessoryRequests ? accessoryRequests: "",
  //   } as const;

  //   console.log("보내는 payload:", payload);

  //   try {
  //     const data = await checkAccessoryPrice(payload);

  //     console.log("응답 data:", data);

  //     useAccessoryStore.getState().updateItem({
  //       category: "accessory",
  //       slug: data.slug,
  //       madeBy: data.madeBy,
  //       model: data.model,
  //       accessoryRequests: data.accessoryRequests,
  //       price: data.price,
  //     });

  //     router.push("/order/accessory/confirm");
  //   } catch (err) {
  //     console.error("에러 발생:", err);
  //     alert("가격 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const handleNext = async () => {
    if (!slug || !madeBy || !model) return;

    try {
      useAccessoryStore.getState().updateItem({
        category: "accessory",
        slug,
        madeBy,
        model,
        accessoryRequests,
        price: 10000,
      });

      router.push("/order/accessory/confirm");
    } catch (err) {
      alert("가격 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSkipRequest = () => {
    setAccessoryRequests("");
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-24">
      <h1 className="text-2xl font-bold leading-snug">
        {accessoryRequests !== null ? (
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
        <Input
          label="요청사항"
          type="text"
          name="accessoryRequests"
          placeholder="요청사항을 입력해주세요"
          onChange={e => setAccessoryRequests(e.target.value)}
          value={accessoryRequests ?? ""}
        />
      )}
      <div className="fixed bottom-0 left-0 right-0 z-10 h-20 w-full bg-white">
        {model &&
          (accessoryRequests === null ? (
            <Button
              selected={true}
              className="fixed bottom-[88px] left-5 right-5 mt-16 rounded-md text-white"
              onClick={handleSkipRequest}
            >
              요청사항 생략하기
            </Button>
          ) : (
            <Button
              selected={true}
              className="fixed bottom-[88px] left-5 right-5 rounded-md text-white"
              onClick={handleNext}
            >
              확인
            </Button>
          ))}
      </div>
    </div>
  );
}

export default SelectPage;
