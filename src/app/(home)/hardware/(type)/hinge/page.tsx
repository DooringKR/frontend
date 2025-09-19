"use client";

import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Button from "@/components/Button/Button";

  const router = useRouter();
  // hinge 입력값: enum 기반 select와 textarea만 사용, zustand cart 사용 안함
  const [madeby, setMadeby] = useState<HardwareMadeBy | "">("");
  const [thickness, setThickness] = useState<HingeThickness | "">("");
  const [angle, setAngle] = useState<HingeAngle | "">("");
  const [request, setRequest] = useState("");
  const [isMadebySheetOpen, setIsMadebySheetOpen] = useState(false);
  const [isThicknessSheetOpen, setIsThicknessSheetOpen] = useState(false);
  const [isAngleSheetOpen, setIsAngleSheetOpen] = useState(false);
  const [madebyInput, setMadebyInput] = useState("");
  const [thicknessInput, setThicknessInput] = useState("");
  const [angleInput, setAngleInput] = useState("");
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
          onClick={() => setIsMadebySheetOpen(true)}
          onChange={v => setMadeby(v as HardwareMadeBy)}
        />
        <BoxedSelect
          label="합판 두께"
          value={thickness}
          options={(Object.values(HingeThickness) as string[]).map(v => ({ label: v, value: v }))}
          onClick={() => setIsThicknessSheetOpen(true)}
          onChange={v => setThickness(v as HingeThickness)}
        />
        <BoxedSelect
          label="각도"
          value={angle}
          options={(Object.values(HingeAngle) as string[]).map(v => ({ label: v, value: v }))}
          onClick={() => setIsAngleSheetOpen(true)}
          onChange={v => setAngle(v as HingeAngle)}
        />
        <BottomSheet
          isOpen={isMadebySheetOpen}
          title="제조사를 선택해주세요"
          onClose={() => setIsMadebySheetOpen(false)}
          children={
            <div>
              {(Object.values(HardwareMadeBy) as string[]).map(option => (
                <SelectToggleButton
                  key={option}
                  label={option}
                  checked={madeby === option}
                  onClick={() => {
                    setMadeby(option as HardwareMadeBy);
                    setIsMadebySheetOpen(false);
                  }}
                />
              ))}
              <SelectToggleButton
                label="직접 입력"
                checked={!!madebyInput && !(Object.values(HardwareMadeBy) as string[]).includes(madebyInput)}
                onClick={() => {
                  setMadebyInput("");
                  setTimeout(() => {
                    const el = document.getElementById("madeby-input");
                    if (el) (el as HTMLInputElement).focus();
                  }, 0);
                }}
              />
              {!(Object.values(HardwareMadeBy) as string[]).includes(madebyInput) && (
                <div className="flex items-center gap-2 px-4 pb-3">
                  <BoxedInput
                    id="madeby-input"
                    type="text"
                    placeholder="제조사 직접 입력"
                    className="w-full"
                    value={madebyInput}
                    onChange={e => setMadebyInput(e.target.value)}
                  />
                  <Button type="Brand" text="확인" onClick={() => {
                    setMadeby(madebyInput as HardwareMadeBy);
                    setIsMadebySheetOpen(false);
                  }} />
                </div>
              )}
            </div>
          }
        />
        <BottomSheet
          isOpen={isThicknessSheetOpen}
          title="합판 두께를 선택해주세요"
          onClose={() => setIsThicknessSheetOpen(false)}
          children={
            <div>
              {(Object.values(HingeThickness) as string[]).map(option => (
                <SelectToggleButton
                  key={option}
                  label={option}
                  checked={thickness === option}
                  onClick={() => {
                    setThickness(option as HingeThickness);
                    setIsThicknessSheetOpen(false);
                  }}
                />
              ))}
              <SelectToggleButton
                label="직접 입력"
                checked={!!thicknessInput && !(Object.values(HingeThickness) as string[]).includes(thicknessInput)}
                onClick={() => {
                  setThicknessInput("");
                  setTimeout(() => {
                    const el = document.getElementById("thickness-input");
                    if (el) (el as HTMLInputElement).focus();
                  }, 0);
                }}
              />
              {!(Object.values(HingeThickness) as string[]).includes(thicknessInput) && (
                <div className="flex items-center gap-2 px-4 pb-3">
                  <BoxedInput
                    id="thickness-input"
                    type="text"
                    placeholder="합판 두께 직접 입력"
                    className="w-full"
                    value={thicknessInput}
                    onChange={e => setThicknessInput(e.target.value)}
                  />
                  <Button type="Brand" text="확인" onClick={() => {
                    setThickness(thicknessInput as HingeThickness);
                    setIsThicknessSheetOpen(false);
                  }} />
                </div>
              )}
            </div>
          }
        />
        <BottomSheet
          isOpen={isAngleSheetOpen}
          title="각도를 선택해주세요"
          onClose={() => setIsAngleSheetOpen(false)}
          children={
            <div>
              {(Object.values(HingeAngle) as string[]).map(option => (
                <SelectToggleButton
                  key={option}
                  label={option}
                  checked={angle === option}
                  onClick={() => {
                    setAngle(option as HingeAngle);
                    setIsAngleSheetOpen(false);
                  }}
                />
              ))}
              <SelectToggleButton
                label="직접 입력"
                checked={!!angleInput && !(Object.values(HingeAngle) as string[]).includes(angleInput)}
                onClick={() => {
                  setAngleInput("");
                  setTimeout(() => {
                    const el = document.getElementById("angle-input");
                    if (el) (el as HTMLInputElement).focus();
                  }, 0);
                }}
              />
              {!(Object.values(HingeAngle) as string[]).includes(angleInput) && (
                <div className="flex items-center gap-2 px-4 pb-3">
                  <BoxedInput
                    id="angle-input"
                    type="text"
                    placeholder="각도 직접 입력"
                    className="w-full"
                    value={angleInput}
                    onChange={e => setAngleInput(e.target.value)}
                  />
                  <Button type="Brand" text="확인" onClick={() => {
                    setAngle(angleInput as HingeAngle);
                    setIsAngleSheetOpen(false);
                  }} />
                </div>
              )}
            </div>
          }
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
