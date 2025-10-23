"use client";

import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Button from "@/components/Button/Button";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";


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

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName('hardware_hinge');
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  // itemStore에 직접입력값 동기화 (항상 동기화)
  React.useEffect(() => {
    updateItem({ madebyInput });
  }, [madebyInput]);
  React.useEffect(() => {
    updateItem({ thicknessInput });
  }, [thicknessInput]);
  React.useEffect(() => {
    updateItem({ angleInput });
  }, [angleInput]);
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
  // 직접입력값도 item에서 추출
  const madebyInputVal = item?.madebyInput ?? "";
  const thicknessInputVal = item?.thicknessInput ?? "";
  const angleInputVal = item?.angleInput ?? "";

  const isAnySheetOpen = isMadebySheetOpen || isThicknessSheetOpen || isAngleSheetOpen;
  return (
    <div className="flex flex-col">
      <InitAmplitude />
      <TopNavigator />
      <Header title={`${headerTitle} 정보를 입력해주세요`} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">
        <BoxedSelect
          default_label="제조사"
          label={<><span>제조사</span><span className="text-orange-500 ml-1">*</span></>}
          value={(() => {
            if (madeby === HardwareMadeBy.DIRECT_INPUT) {
              return madebyInput || "직접 입력";
            }
            if (madeby === HardwareMadeBy.MOONJOO) return "국산 (문주) + 1,500원";
            if (madeby === HardwareMadeBy.HAFFLE) return "헤펠레 (Haffle) + 2,500원";
            if (madeby === HardwareMadeBy.BLUM) return "블룸 (Blum) + 10,500원";
            return madeby;
          })()}
          options={Object.values(HardwareMadeBy).map(v => ({ label: v, value: v }))}
          onClick={() => setIsMadebySheetOpen(true)}
          onChange={() => { }}
        />
        <BoxedSelect
          default_label="합판 두께"
          label={<><span>합판 두께</span><span className="text-orange-500 ml-1">*</span></>}
          value={(() => {
            if (thickness === HingeThickness.DIRECT_INPUT) {
              return thicknessInput || "직접 입력";
            }
            return thickness;
          })()}
          options={Object.values(HingeThickness).map(v => ({ label: v, value: v }))}
          onClick={() => setIsThicknessSheetOpen(true)}
          onChange={() => { }}
        />
        <BoxedSelect
          default_label="각도"
          label={<><span>각도</span><span className="text-orange-500 ml-1">*</span></>}
          value={(() => {
            if (angle === HingeAngle.DIRECT_INPUT) {
              return angleInput || "직접 입력";
            }
            return angle;
          })()}
          options={Object.values(HingeAngle).map(v => ({ label: v, value: v }))}
          onClick={() => setIsAngleSheetOpen(true)}
          onChange={() => { }}
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
              {Object.values(HardwareMadeBy)
                .filter(option => option !== HardwareMadeBy.DIRECT_INPUT)
                .map(option => {
                  let label = "";
                  if (option === HardwareMadeBy.MOONJOO) label = "국산 (문주) + 1,500원";
                  if (option === HardwareMadeBy.HAFFLE) label = "헤펠레 (Haffle) + 2,500원";
                  if (option === HardwareMadeBy.BLUM) label = "블룸 (Blum) + 10,500원";
                  return (
                    <SelectToggleButton
                      key={option}
                      label={label}
                      checked={madeby === option}
                      onClick={() => {
                        updateItem({ madeby: option, madebyInput: "" });
                        setMadebyMode("option");
                        setMadebyInput("");
                      }}
                    />
                  );
                })}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={madebyMode === "input" || madeby === HardwareMadeBy.DIRECT_INPUT}
                  onClick={() => {
                    setMadebyMode("input");
                    updateItem({ madeby: HardwareMadeBy.DIRECT_INPUT, madebyInput });
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
                      onChange={e => {
                        setMadebyInput(e.target.value);
                        updateItem({ madebyInput: e.target.value });
                      }}
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
                  if (madebyMode === "input") {
                    updateItem({ madeby: HardwareMadeBy.DIRECT_INPUT, madebyInput });
                  }
                  setIsMadebySheetOpen(false);
                  // setMadebyMode("option"); // 유지: 직접입력 모드 유지
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
              {Object.values(HingeThickness)
                .filter(option => option !== HingeThickness.DIRECT_INPUT)
                .map(option => (
                  <SelectToggleButton
                    key={option}
                    label={option}
                    checked={thickness === option}
                    onClick={() => {
                      updateItem({ thickness: option, thicknessInput: "" });
                      setThicknessMode("option");
                      setThicknessInput("");
                    }}
                  />
                ))}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={thicknessMode === "input" || thickness === HingeThickness.DIRECT_INPUT}
                  onClick={() => {
                    setThicknessMode("input");
                    updateItem({ thickness: HingeThickness.DIRECT_INPUT, thicknessInput });
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
                      onChange={e => {
                        setThicknessInput(e.target.value);
                        updateItem({ thicknessInput: e.target.value });
                      }}
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
                  if (thicknessMode === "input") {
                    updateItem({ thickness: HingeThickness.DIRECT_INPUT, thicknessInput });
                  }
                  setIsThicknessSheetOpen(false);
                  // setThicknessMode("option");
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
              {Object.values(HingeAngle)
                .filter(option => option !== HingeAngle.DIRECT_INPUT)
                .map(option => (
                  <SelectToggleButton
                    key={option}
                    label={option}
                    checked={angle === option}
                    onClick={() => {
                      updateItem({ angle: option, angleInput: "" });
                      setAngleMode("option");
                      setAngleInput("");
                    }}
                  />
                ))}
              <div className="flex flex-col">
                <SelectToggleButton
                  label="직접 입력"
                  checked={angleMode === "input" || angle === HingeAngle.DIRECT_INPUT}
                  onClick={() => {
                    setAngleMode("input");
                    updateItem({ angle: HingeAngle.DIRECT_INPUT, angleInput });
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
                      onChange={e => {
                        setAngleInput(e.target.value);
                        updateItem({ angleInput: e.target.value });
                      }}
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
                  if (angleMode === "input") {
                    updateItem({ angle: HingeAngle.DIRECT_INPUT, angleInput });
                  }
                  setIsAngleSheetOpen(false);
                  // setAngleMode("option");
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
              trackClick({
                  object_type: "button",
                  object_name: "confirm",
                  current_page: getScreenName(),
                  modal_name: null,
              });
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
