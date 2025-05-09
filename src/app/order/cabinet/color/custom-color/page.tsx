"use client";

import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";

function ManualColorInputPage() {
  if (typeof window === "undefined") return null;
  const [color, setColor] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = searchParams.get("slug");

  const headerTitle = CABINET_CATEGORY_LIST.find(item => item.slug === slug)?.header || "";

  const handleNext = () => {
    if (color.trim()) {
      const encodedColor = encodeURIComponent(color.trim());
      router.push(`/order/cabinet/select?slug=${slug}&color=${encodedColor}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <h1 className="text-2xl font-bold">
        <span className="text-[#AD46FF]">{headerTitle}</span> 색상을
        <br /> 직접 입력해주세요
      </h1>

      <div className="flex items-center justify-between text-sm text-black">
        <label className="text-sm font-medium">색상</label>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-[#3578ff]"
        >
          목록에서 선택
        </button>
      </div>

      <Input
        type="text"
        name="color"
        placeholder="색상을 입력해주세요"
        value={color}
        onChange={e => setColor(e.target.value)}
      />

      <Button
        size="large"
        disabled={!color.trim()}
        onClick={handleNext}
        className="absolute bottom-5 left-5 right-5 rounded-md text-white"
      >
        다음
      </Button>
    </div>
  );
}
export default ManualColorInputPage;
