"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import type { ProgressValue } from "@/components/Progress/ProgressBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

/** 상황 주문 한 단계 — 구 바로가구 입력 화면과 같은 틀(상단 바·진행 막대·제목·아래 고정 버튼) */
export default function StepShell({
  progress,
  title,
  subtitle,
  children,
  nextText = "다음",
  nextDisabled = false,
  onNext,
}: {
  progress: ProgressValue;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  nextText?: string;
  nextDisabled?: boolean;
  /** 없으면 아래 버튼을 두지 않는다(누르는 즉시 넘어가는 화면) */
  onNext?: () => void;
}) {
  return (
    <div className="flex flex-col pt-[90px]">
      <TopNavigator />
      <ProgressBar progress={progress} />
      <Header title={title} subtitle={subtitle} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">{children}</div>
      <div className="h-[100px]" />
      {onNext && (
        <BottomButton
          type="1button"
          button1Text={nextText}
          className="fixed bottom-0 w-full max-w-[460px]"
          button1Disabled={nextDisabled}
          onButton1Click={onNext}
        />
      )}
    </div>
  );
}
