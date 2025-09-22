"use client";

import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import React, { Suspense, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Button from "@/components/Button/Button";
import useItemStore from "@/store/Items/itemStore";


function HingePageContent() {
  const router = useRouter();
  const item = useItemStore(state => state.item);
  const setItem = useItemStore(state => state.setItem);
  const updateItem = useItemStore(state => state.updateItem);
  // Modal open states
  const [isMadebySheetOpen, setIsMadebySheetOpen] = React.useState(false);
  const [isThicknessSheetOpen, setIsThicknessSheetOpen] = React.useState(false);
  const [isAngleSheetOpen, setIsAngleSheetOpen] = React.useState(false);
  // Direct input mode states
  const [madebyMode, setMadebyMode] = React.useState<string>("option");
  const [thicknessMode, setThicknessMode] = React.useState<string>("option");
  const [angleMode, setAngleMode] = React.useState<string>("option");
  // Direct input values (local, only for input field)
  const [madebyInput, setMadebyInput] = React.useState("");
  const [thicknessInput, setThicknessInput] = React.useState("");
  const [angleInput, setAngleInput] = React.useState("");
  // refs for focusing
  const madebyInputRef = useRef<HTMLInputElement>(null);
  const thicknessInputRef = useRef<HTMLInputElement>(null);
  const angleInputRef = useRef<HTMLInputElement>(null);
  const headerTitle = "경첩";

  // Extract hinge fields from itemStore
  const madeby = item?.madeby ?? "";
  const thickness = item?.thickness ?? "";
  const angle = item?.angle ?? "";
  const request = item?.request ?? "";

  const isAnySheetOpen = isMadebySheetOpen || isThicknessSheetOpen || isAngleSheetOpen;
  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header title={`${headerTitle} 정보를 입력해주세요`} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          label="제조사"
          value={(() => {
            const v = isMadebySheetOpen && madebyMode === "input" ? madebyInput : madeby;
            if (v === "문주") return "국산 (문주) + 1,500원";
            if (v === "헤펠레") return "헤펠레 (Haffle) + 2,500원";
            if (v === "블룸") return "블룸 (Blum) + 10,500원";
            return v;
          })()}
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
          onChange={e => updateItem({ request: e.target.value })}
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
                .map(option => {
                  let label = option;
                  if (option === "문주") label = "국산 (문주) + 1,500원";
                  if (option === "헤펠레") label = "헤펠레 (Haffle) + 2,500원";
                  if (option === "블룸") label = "블룸 (Blum) + 10,500원";
                  return (
                    <SelectToggleButton
                      key={option}
                      label={label}
                      checked={madeby === option && madebyMode !== "input"}
                      onClick={() => {
                        updateItem({ madeby: option });
                        setMadebyMode("option");
                        setMadebyInput("");
                      }}
                    />
                  );
                })}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={madebyMode === "input"}
                  onClick={() => {
                    setMadebyMode("input");
                    updateItem({ madeby: "" });
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
                    updateItem({ madeby: madebyInput });
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
                      updateItem({ thickness: option });
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
                    updateItem({ thickness: "" });
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
                    updateItem({ thickness: thicknessInput });
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
                      updateItem({ angle: option });
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
                    updateItem({ angle: "" });
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
                    updateItem({ angle: angleInput });
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
              router.push(`/hardware/report`);
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
