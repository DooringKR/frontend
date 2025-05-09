"use client";

import { checkDoorPrice } from "@/api/checkcash";
import { DOOR_CATEGORY_LIST } from "@/constants/category";
import type { HingeValues } from "@/types/hinge";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

import useDoorStore from "@/store/Items/doorStore";

import Flap from "./_components/Flap";
import Normal from "./_components/Normal";

function SelectPage() {
  if (typeof window === "undefined") return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug") as "normal" | "flap" | "drawer";
  const color = searchParams.get("color") ?? "";

  const currentCategory = DOOR_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "문짝";

  const [width, setWidth] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [height, setHeight] = useState("");
  const [hingeCount, setHingeCount] = useState<number | null>(null);
  const [hingeDirection, setHingeDirection] = useState<"left" | "right" | null>(null);
  const [hingeValues, setHingeValues] = useState<HingeValues>({
    topHinge: "",
    bottomHinge: "",
    middleHinge: "",
    middleTopHinge: "",
    middleBottomHinge: "",
  });
  const [doorRequest, setDoorRequest] = useState<string | null>(null);

  const renderHingeComponent = () => {
    if (!height) return null;
    if (slug === "normal") {
      return (
        <Normal
          hingeCount={hingeCount}
          hingeDirection={hingeDirection}
          setHingeDirection={setHingeDirection}
          hingeValues={hingeValues}
          setHingeCount={setHingeCount}
          setHingeValues={setHingeValues}
          width={width}
          height={height}
        />
      );
    }
    if (slug === "flap") {
      return (
        <Flap
          hingeCount={hingeCount}
          hingeValues={hingeValues}
          setHingeValues={setHingeValues}
          setHingeCount={setHingeCount}
          width={width}
          height={height}
        />
      );
    }
    return null;
  };

  const getInputStatusText = () => {
    if (!width) return "가로 길이를";
    if (!height) return "세로 길이를";
    if (slug !== "drawer" && (!hingeCount || !hingeValues.topHinge || !hingeValues.bottomHinge))
      return "경첩 정보를";
    if (doorRequest === null) return "요청 사항을";
    return "정보를";
  };

  // const handleNext = async () => {
  //   if (!slug || !color || !width || !height) return;

  //   const topHinge = Number(hingeValues.topHinge);
  //   const bottomHinge = Number(hingeValues.bottomHinge);
  //   const middleHinge = hingeValues.middleHinge ? Number(hingeValues.middleHinge) : null;
  //   const middleTopHinge = hingeValues.middleTopHinge ? Number(hingeValues.middleTopHinge) : null;
  //   const middleBottomHinge = hingeValues.middleBottomHinge
  //     ? Number(hingeValues.middleBottomHinge)
  //     : null;

  //   const payload = {
  //     category: "door",
  //     slug,
  //     color,
  //     width: Number(width),
  //     height: Number(height),
  //     hinge: {
  //       hingeCount: hingeCount ? hingeCount : 0,
  //       hingePosition: hingeDirection ?? "left",
  //       topHinge,
  //       bottomHinge,
  //       middleHinge: hingeCount !== null && hingeCount >= 3 ? middleHinge : null,
  //       middleTopHinge: hingeCount === 4 ? middleTopHinge : null,
  //       middleBottomHinge: hingeCount === 4 ? middleBottomHinge : null,
  //     },
  //     doorRequest: doorRequest ? doorRequest : "",
  //   } as const ;

  //   console.log("보내는 payload:", payload);

  //   try {
  //     const data = await checkDoorPrice(payload);

  //     console.log("응답 data:", data);

  //     useDoorStore.getState().updateItem({
  //       slug: data.slug,
  //       color: data.color,
  //       width: data.width,
  //       height: data.height,
  //       hinge: {
  //         hingeCount: data.hinge.hingeCount,
  //         hingePosition: data.hinge.hingePosition,
  //         topHinge: data.hinge.topHinge,
  //         bottomHinge: data.hinge.bottomHinge,
  //         middleHinge: data.hinge.middleHinge ?? null,
  //         middleTopHinge: data.hinge.middleTopHinge ?? null,
  //         middleBottomHinge: data.hinge.middleBottomHinge ?? null,
  //       },
  //       doorRequest: data.doorRequest,
  //       price: data.price,
  //     });

  //     router.push("/order/door/confirm");
  //   } catch (err) {
  //     console.error("에러 발생:", err);
  //     alert("가격 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const handleNext = async () => {
    if (!slug || !color || !width || !height) return;

    const topHinge = Number(hingeValues.topHinge);
    const bottomHinge = Number(hingeValues.bottomHinge);
    const middleHinge = hingeValues.middleHinge ? Number(hingeValues.middleHinge) : null;
    const middleTopHinge = hingeValues.middleTopHinge ? Number(hingeValues.middleTopHinge) : null;
    const middleBottomHinge = hingeValues.middleBottomHinge
      ? Number(hingeValues.middleBottomHinge)
      : null;

    const payload = {
      category: "door",
      slug: header,
      color,
      width: Number(width),
      height: Number(height),
      hinge: {
        hingeCount,
        hingePosition: hingeDirection,
        topHinge,
        bottomHinge,
        middleHinge: hingeCount !== null && hingeCount >= 3 ? middleHinge : null,
        middleTopHinge: hingeCount === 4 ? middleTopHinge : null,
        middleBottomHinge: hingeCount === 4 ? middleBottomHinge : null,
      },
      doorRequest: doorRequest ? doorRequest : 0,
    };
    console.log(payload);

    try {
      useDoorStore.getState().updateItem({
        slug,
        color,
        width: Number(width),
        height: Number(height),
        hinge: {
          hingeCount,
          hingePosition: hingeDirection,
          topHinge,
          bottomHinge,
          middleHinge,
          middleTopHinge,
          middleBottomHinge,
        },
        doorRequest,
        price: 10000,
      });

      router.push("/order/door/confirm");
    } catch (err) {
      alert("가격 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSkipRequest = () => {
    setDoorRequest("");
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-24">
      <h1 className="text-2xl font-bold leading-snug">
        {doorRequest !== null ? (
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

      {color ? (
        <div className="flex items-center justify-between">
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">가로 길이</label>
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <Input
              type="number"
              name="width"
              placeholder="가로 길이 입력"
              value={width}
              onChange={e => setWidth(e.target.value)}
              onBlur={e => setWidth(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <span className="mr-20">mm</span>
        </div>
      </div>

      {width && (
        <div className="flex w-full flex-col gap-2">
          <label className="text-sm font-medium">세로 길이</label>
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <Input
                type="number"
                name="height"
                placeholder="세로 길이 입력"
                value={heightInput}
                onChange={e => setHeightInput(e.target.value)}
                onBlur={e => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setHeight(cleaned);
                }}
              />
            </div>
            <span className="mr-20">mm</span>
          </div>
        </div>
      )}
      {renderHingeComponent()}
      {(hingeValues.topHinge && hingeValues.bottomHinge) ||
        (slug === "drawer" && height && (
          <>
            <div>
              <p>요청사항</p>
              <Input
                type="text"
                name="doorRequest"
                placeholder="요청사항을 입력해주세요"
                value={doorRequest ?? ""}
                onChange={e => setDoorRequest(e.target.value)}
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-10 h-20 w-full bg-white">
              {doorRequest === null ? (
                <Button
                  size="large"
                  className="fixed bottom-5 left-5 right-5 mt-16 rounded-md text-white"
                  onClick={handleSkipRequest}
                >
                  요청사항 생략하기
                </Button>
              ) : (
                <Button
                  size="large"
                  className="fixed bottom-5 left-5 right-5 rounded-md text-white"
                  onClick={handleNext}
                >
                  다음
                </Button>
              )}
            </div>
          </>
        ))}
    </div>
  );
}

export default SelectPage;
