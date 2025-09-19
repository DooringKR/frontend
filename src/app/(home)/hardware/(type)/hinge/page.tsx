"use client";

import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";

function HingePageContent() {
  const router = useRouter();
  // hinge 입력값: enum 기반 select와 textarea만 사용, zustand cart 사용 안함
  const [madeby, setMadeby] = useState<HardwareMadeBy | "">("");
  const [thickness, setThickness] = useState<HingeThickness | "">("");
  const [angle, setAngle] = useState<HingeAngle | "">("");
  const [request, setRequest] = useState("");
  const headerTitle = "경첩 정보";

  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`${headerTitle}를 입력해주세요`} />
      <div className="h-5"></div>
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="제조사"
          value={madeby}
          options={(Object.values(HardwareMadeBy) as string[]).map(v => ({ label: v, value: v }))}
          onChange={v => setMadeby(v as HardwareMadeBy)}
        />
        <BoxedSelect
          label="합판 두께"
          value={thickness}
          options={(Object.values(HingeThickness) as string[]).map(v => ({ label: v, value: v }))}
          onChange={v => setThickness(v as HingeThickness)}
        />
        <BoxedSelect
          label="각도"
          value={angle}
          options={(Object.values(HingeAngle) as string[]).map(v => ({ label: v, value: v }))}
          onChange={v => setAngle(v as HingeAngle)}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div id="hardware-next-button">
        <BottomButton
          type={"1button"}
          button1Text={"다음"}
          className="fixed bottom-0 w-full max-w-[460px]"
          button1Disabled={madeby === "" || thickness === "" || angle === ""}
          onButton1Click={() => {
            // TODO: 다음 페이지로 정보 전달 (예: router.push에 state/params 전달)
            router.push(`/order/hardware/confirm`);
          }}
        />
      </div>
    </div>
  );
}

function HardwarePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HingePageContent />
    </Suspense>
  );
}

export default HardwarePage;
