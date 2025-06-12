"use client";

import { checkFinishPrice } from "@/api/checkcash";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import Input from "@/components/Input/Input";

import useFinishStore from "@/store/Items/finishStore";

import Depth from "./_components/Depth";
import Height from "./_components/Height";

function SelectPage() {
  if (typeof window === "undefined") return null;

  const searchParams = useSearchParams();
  const router = useRouter();
  const color = searchParams.get("color") ?? "";

  const [depth, setDepth] = useState<{
    baseDepth: string | null;
    additionalDepth: string | null;
  }>({
    baseDepth: null,
    additionalDepth: null,
  });

  const [height, setHeight] = useState<{
    baseHeight: string | null;
    additionalHeight: string | null;
  }>({
    baseHeight: null,
    additionalHeight: null,
  });
  const [finishRequest, setFinishRequest] = useState<string | null>(null);

  const getInputStatusText = () => {
    if (!depth.baseDepth) return "깊이를";
    if (!height.baseHeight) return "높이를";
    if (finishRequest === null) return "요청 사항을";
    return "정보를";
  };

  // const handleNext = async () => {
  //   if (!color || depth.baseDepth === null || height.baseHeight === null) return;

  //   const payload = {
  //     category: "finish",
  //     color,
  //     depth: {
  //       baseDepth: depth.baseDepth ? Number(depth.baseDepth) : 0,
  //       additionalDepth: depth.additionalDepth ? Number(depth.additionalDepth) : 0,
  //     },
  //     height: {
  //       baseHeight: height.baseHeight ? Number(height.baseHeight) : 0,
  //       additionalHeight: height.additionalHeight ? Number(height.additionalHeight) : 0,
  //     },
  //     finishRequest: finishRequest ? finishRequest: "",
  //   } as const;

  //   try {
  // const data = await checkFinishPrice(payload);

  // console.log("응답 data:", data);

  // useFinishStore.getState().updateItem({
  //   category: "finish",
  //   color: data.color,
  //   depth: {
  //     baseDepth: data.depth.baseDepth ?? null,
  //     additionalDepth: data.depth.additionalDepth ?? null,
  //   },
  //   height: {
  //     baseHeight: data.height.baseHeight ?? null,
  //     additionalHeight: data.height.additionalHeight ?? null,
  //   },
  //   finishRequest: data.finishRequest,
  //   price: data.price,
  // });

  // router.push("/order/finish/confirm");
  //   } catch (err) {
  //     alert("가격 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const handleNext = async () => {
    if (!color || depth.baseDepth === null || height.baseHeight === null) return;

    const payload = {
      category: "finish",
      color,
      depth: {
        baseDepth: depth.baseDepth ? Number(depth.baseDepth) : 0,
        additionalDepth: depth.additionalDepth ? Number(depth.additionalDepth) : 0,
      },
      height: {
        baseHeight: height.baseHeight ? Number(height.baseHeight) : 0,
        additionalHeight: height.additionalHeight ? Number(height.additionalHeight) : 0,
      },
      finishRequest: finishRequest ? finishRequest : "",
    } as const;

    try {
      useFinishStore.getState().updateItem({
        category: "finish",
        color,
        depth: {
          baseDepth: depth.baseDepth ? Number(depth.baseDepth) : null,
          additionalDepth: depth.additionalDepth ? Number(depth.additionalDepth) : null,
        },
        height: {
          baseHeight: height.baseHeight ? Number(height.baseHeight) : null,
          additionalHeight: height.additionalHeight ? Number(height.additionalHeight) : null,
        },
        finishRequest,
        price: 10000,
      });

      router.push("/order/finish/confirm");
    } catch (err) {
      alert("가격 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSkipRequest = () => {
    setFinishRequest("");
  };

  return (
    <div className="flex flex-col gap-6 pb-24 pt-5">
      <h1 className="px-5 text-2xl font-bold leading-snug">
        {finishRequest !== null ? (
          <>마감재 정보를 확인해주세요</>
        ) : (
          <>마감재 {getInputStatusText()} 입력해주세요</>
        )}
      </h1>

      {color ? (
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Image src="/img/Checker.png" width={35} height={35} alt={color} />
            <p className="text-base font-semibold">{color}</p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-base font-medium text-[#3578ff]"
          >
            변경
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400">색상이 선택되지 않았습니다.</p>
      )}
      <Depth depth={depth} setDepth={setDepth} />
      {depth.baseDepth && <Height height={height} setHeight={setHeight} />}

      {depth.baseDepth && height.baseHeight && (
        <>
          <div className="px-5">
            <Input
              label="요청사항"
              type="text"
              name="finishRequest"
              placeholder="요청사항을 입력해주세요"
              value={finishRequest ?? ""}
              onChange={e => setFinishRequest(e.target.value)}
            />
          </div>
          <div className="fixed bottom-[68px] left-0 right-0 z-10 h-20 w-full bg-white">
            {finishRequest === null ? (
              <Button
                selected
                className="fixed bottom-[88px] left-5 right-5 mt-16 rounded-md text-white"
                onClick={handleSkipRequest}
              >
                요청사항 생략하기
              </Button>
            ) : (
              <Button
                selected
                className="fixed bottom-[88px] left-5 right-5 rounded-md text-white"
                onClick={handleNext}
              >
                확인
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SelectPage;
