"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import type { HingeValues } from "@/types/hinge";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

import useDoorStore from "@/store/doorStore";

import Drawer from "./_components/Drawer";
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

  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [hingeCount, setHingeCount] = useState<number | null>(null);
  const [hingeDirection, setHingeDirection] = useState<"left" | "right" | null>(null);
  const [hingeValues, setHingeValues] = useState<HingeValues>({
    topHinge: "",
    bottomHinge: "",
    middleHinge: "",
    middleTopHinge: "",
    middleBottomHinge: "",
  });

  const renderHingeComponent = () => {
    if (!hingeCount) return null;
    if (slug === "normal") {
      return (
        <Normal
          hingeCount={hingeCount}
          hingeDirection={hingeDirection}
          setHingeDirection={setHingeDirection}
          hingeValues={hingeValues}
          setHingeValues={setHingeValues}
          width={width}
          height={height}
        />
      );
    }
    if (slug === "flap") return <Flap 
    hingeCount={hingeCount}
    hingeValues={hingeValues}
    setHingeValues={setHingeValues}
    width={width}
    height={height}/>;
    if (slug === "drawer") return <Drawer />;
    return null;
  };

  const handleNext = async () => {
    if (!slug || !color || !width || !height || !hingeCount) return;
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
        topHinge: Number(hingeValues.topHinge),
        bottomHinge: Number(hingeValues.bottomHinge),
        middleHinge: hingeCount >= 3 ? Number(hingeValues.middleHinge) : null,
        middleTopHinge: hingeCount === 4 ? Number(hingeValues.middleTopHinge) : null,
        middleBottomHinge: hingeCount === 4 ? Number(hingeValues.middleBottomHinge) : null,
      },
    };
    console.log(payload);


    try {
      // const res = await fetch("/api/checkcash/door", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (!res.ok) throw new Error("가격 확인 실패");

      // const data = await res.json();

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
        price: 10000,
      });

      router.push("/order/door/confirm");
    } catch (err) {
      alert("가격 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-24">
      <h1 className="text-2xl font-bold leading-snug">
        <span className="text-[#AD46FF]">{header}</span> 경첩 정보를
        <br />
        입력해주세요
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
              onChange={e => setWidth(e.target.value.replace(/\D/g, ""))}
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
                value={height}
                onChange={e => setHeight(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <span className="mr-20">mm</span>
          </div>
        </div>
      )}
      {height && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">경첩 개수</label>
          <div className="flex gap-2">
            {[2, 3, 4].map(num => (
              <Button
                key={num}
                type="button"
                size="large"
                onClick={() => setHingeCount(num)}
                className={`flex-grow border border-[#767676] ${
                  hingeCount === num ? "bg-[#E8b931]" : "bg-[#d9d9d9]"
                } text-black`}
              >
                {num}개
              </Button>
            ))}
          </div>
        </div>
      )}
      {renderHingeComponent()}
      <div className="fixed bottom-0 left-0 right-0 z-10 h-20 w-full bg-white">
        <Button
          size="large"
          className="fixed bottom-5 left-5 right-5 rounded-md text-white"
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default SelectPage;
