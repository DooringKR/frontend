"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

import Drawer from "./_components/Drawer";
import Flap from "./_components/Flap";
import Normal from "./_components/Normal";
import type { HingeValues } from "@/types/hinge";

function SelectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug");
  const color = searchParams.get("color");

  const currentCategory = DOOR_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "문짝";

  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [hingeCount, setHingeCount] = useState<number | null >(null);
  const [hingeDirection, setHingeDirection] = useState<"left" | "right">("right");
  const [hingeValues, setHingeValues] = useState<HingeValues>({
    topHinge: undefined,
    bottomHinge: undefined,
    middleHinge: undefined,
    middleTopHinge: undefined,
    middleBottomHinge: undefined,
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
    if (slug === "flap") return <Flap />;
    if (slug === "drawer") return <Drawer />;
    return null;
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
              onChange={e => setWidth(e.target.value)}
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
                onChange={e => setHeight(e.target.value)}
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
      <Button size="large" className="fixed bottom-5 left-5 right-5 rounded-md">
        다음
      </Button>
    </div>
  );
}

export default SelectPage;
