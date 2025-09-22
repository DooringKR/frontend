"use client";

import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { Suspense, useState, useRef, useEffect } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Button from "@/components/Button/Button";


function HingePageContent() {
  const router = useRouter();
  // hinge 입력값: enum 기반 select와 textarea만 사용, zustand cart 사용 안함
  const [madeby, setMadeby] = useState<HardwareMadeBy | "">("");
  const [thickness, setThickness] = useState<HingeThickness | "">("");
  const [angle, setAngle] = useState<HingeAngle | "">("");
  const [request, setRequest] = useState("");
  const [isMadebySheetOpen, setIsMadebySheetOpen] = useState(false);
  const [isThicknessSheetOpen, setIsThicknessSheetOpen] = useState(false);
  const [isAngleSheetOpen, setIsAngleSheetOpen] = useState(false);
  // direct input mode states
  const [madebyMode, setMadebyMode] = useState<string>("option");
  const [thicknessMode, setThicknessMode] = useState<string>("option");
  const [angleMode, setAngleMode] = useState<string>("option");
  // direct input values
  const [madebyInput, setMadebyInput] = useState("");
  const [thicknessInput, setThicknessInput] = useState("");
  const [angleInput, setAngleInput] = useState("");
  // refs for focusing
  const madebyInputRef = useRef<HTMLInputElement>(null);
  const thicknessInputRef = useRef<HTMLInputElement>(null);
  const angleInputRef = useRef<HTMLInputElement>(null);
  const headerTitle = "경첩";

  const isAnySheetOpen = isMadebySheetOpen || isThicknessSheetOpen || isAngleSheetOpen;
  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header title={`${headerTitle} 정보를 입력해주세요`} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="제조사"
          value={isMadebySheetOpen && madebyMode === "input" ? madebyInput : madeby}
          options={(Object.values(HardwareMadeBy) as string[]).map(v => ({ label: v, value: v }))}
          onClick={() => setIsMadebySheetOpen(true)}
          onChange={() => {}}
        />
        <BoxedSelect
          label="합판 두께"
          value={isThicknessSheetOpen && thicknessMode === "input" ? thicknessInput : thickness}
          options={(Object.values(HingeThickness) as string[]).map(v => ({ label: v, value: v }))}
          onClick={() => setIsThicknessSheetOpen(true)}
          onChange={() => {}}
        />
        <BoxedSelect
          label="각도"
          value={isAngleSheetOpen && angleMode === "input" ? angleInput : angle}
          options={(Object.values(HingeAngle) as string[]).map(v => ({ label: v, value: v }))}
          onClick={() => setIsAngleSheetOpen(true)}
          onChange={() => {}}
        />
        <BoxedInput
          label="제작 시 요청사항"
          placeholder="제작 시 요청사항을 입력해주세요"
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <div className="h-5" />
      <BottomSheet
        isOpen={isMadebySheetOpen}
        title="제조사를 선택해주세요"
        contentPadding="px-1"
        onClose={() => {
          setIsMadebySheetOpen(false);
          setMadebyMode("option");
        }}
        children={
          <div>
            <div>
              {(Object.values(HardwareMadeBy) as string[])
                .filter(option => option !== "직접 입력")
                .map(option => (
                  <SelectToggleButton
                    key={option}
                    label={option}
                    checked={madeby === option && madebyMode !== "input"}
                    onClick={() => {
                      setMadeby(option as HardwareMadeBy);
                      setMadebyMode("option");
                      setMadebyInput("");
                    }}
                  />
                ))}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={madebyMode === "input"}
                  onClick={() => {
                    setMadebyMode("input");
                    setMadeby("");
                    setTimeout(() => madebyInputRef.current?.focus(), 0);
                  }}
                />
                {madebyMode === "input" && (
                  <div className="flex items-center gap-2 px-4 pb-3">
                    <BoxedInput
                      ref={madebyInputRef}
                      type="text"
                      placeholder="제조사 직접 입력"
                      className="w-full"
                      value={madebyInput}
                      onChange={e => setMadebyInput(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="py-5 px-5">
              <Button
                type="Brand"
                text="다음"
                onClick={() => {
                  if (madebyMode === "input" && madebyInput) {
                    setMadeby(madebyInput as HardwareMadeBy);
                  }
                  setIsMadebySheetOpen(false);
                  setMadebyMode("option");
                }}
              />
            </div>
          </div>
        }
      />
      <BottomSheet
        isOpen={isThicknessSheetOpen}
        title="합판 두께를 선택해주세요"
        contentPadding="px-1"
        onClose={() => {
          setIsThicknessSheetOpen(false);
          setThicknessMode("option");
        }}
        children={
          <div>
            <div>
              {(Object.values(HingeThickness) as string[])
                .filter(option => option !== "직접 입력")
                .map(option => (
                  <SelectToggleButton
                    key={option}
                    label={option}
                    checked={thickness === option && thicknessMode !== "input"}
                    onClick={() => {
                      setThickness(option as HingeThickness);
                      setThicknessMode("option");
                      setThicknessInput("");
                    }}
                  />
                ))}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={thicknessMode === "input"}
                  onClick={() => {
                    setThicknessMode("input");
                    setThickness("");
                    setTimeout(() => thicknessInputRef.current?.focus(), 0);
                  }}
                />
                {thicknessMode === "input" && (
                  <div className="flex items-center gap-2 px-4 pb-3">
                    <BoxedInput
                      ref={thicknessInputRef}
                      type="text"
                      placeholder="합판 두께 직접 입력"
                      className="w-full"
                      value={thicknessInput}
                      onChange={e => setThicknessInput(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="py-5 px-5">
              <Button
                type="Brand"
                text="다음"
                onClick={() => {
                  if (thicknessMode === "input" && thicknessInput) {
                    setThickness(thicknessInput as HingeThickness);
                  }
                  setIsThicknessSheetOpen(false);
                  setThicknessMode("option");
                }}
              />
            </div>
          </div>
        }
      />
      <BottomSheet
        isOpen={isAngleSheetOpen}
        title="각도를 선택해주세요"
        contentPadding="px-1"
        onClose={() => {
          setIsAngleSheetOpen(false);
          setAngleMode("option");
        }}
        children={
          <div>
            <div>
              {(Object.values(HingeAngle) as string[])
                .filter(option => option !== "직접 입력")
                .map(option => (
                  <SelectToggleButton
                    key={option}
                    label={option}
                    checked={angle === option && angleMode !== "input"}
                    onClick={() => {
                      setAngle(option as HingeAngle);
                      setAngleMode("option");
                      setAngleInput("");
                    }}
                  />
                ))}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={angleMode === "input"}
                  onClick={() => {
                    setAngleMode("input");
                    setAngle("");
                    setTimeout(() => angleInputRef.current?.focus(), 0);
                  }}
                />
                {angleMode === "input" && (
                  <div className="flex items-center gap-2 px-4 pb-3">
                    <BoxedInput
                      ref={angleInputRef}
                      type="text"
                      placeholder="각도 직접 입력"
                      className="w-full"
                      value={angleInput}
                      onChange={e => setAngleInput(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="py-5 px-5">
              <Button
                type="Brand"
                text="다음"
                onClick={() => {
                  if (angleMode === "input" && angleInput) {
                    setAngle(angleInput as HingeAngle);
                  }
                  setIsAngleSheetOpen(false);
                  setAngleMode("option");
                }}
              />
            </div>
          </div>
        }
      />
      <div className="h-[100px]" />
      {!isAnySheetOpen && (
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
      )}
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
