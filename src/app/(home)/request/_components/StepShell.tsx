"use client";

import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import type { ProgressValue } from "@/components/Progress/ProgressBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";

/**
 * 상황 주문 한 단계 — 위 바·진행 막대·제목·아래 고정 버튼.
 * 다음 버튼은 늘 눌린다(필수값은 화면이 useRequired 로 확인 — 빈 칸으로 옮겨 가 알린다). 보내는 중에만 막는다(busy).
 */
export default function StepShell({
  progress,
  title,
  subtitle,
  children,
  nextText = "다음",
  busy = false,
  onNext,
  bottomTop,
}: {
  progress: ProgressValue;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  nextText?: string;
  busy?: boolean;
  /** 없으면 아래 버튼을 두지 않는다(누르는 즉시 넘어가는 화면) */
  onNext?: () => void;
  /** 아래 버튼 바로 위 줄(누른 일 실패 알림 등) */
  bottomTop?: React.ReactNode;
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
        <BottomBar top={bottomTop}>
          <Button busy={busy} onClick={onNext}>
            {nextText}
          </Button>
        </BottomBar>
      )}
    </div>
  );
}
