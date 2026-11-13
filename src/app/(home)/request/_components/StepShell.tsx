"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BottomBar from "@/components/overlay/BottomBar";
import { Button } from "@/components/ui/button";

import {
  CONFIRM_PATH,
  STEPS,
  type StepKey,
  askedDraft,
  firstIncompleteIndex,
  markAskedDraft,
  prevPathOf,
  useHydrated,
} from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";
import StepRow from "./StepRow";

/**
 * 상황 주문 한 화면 — 위 바·단계 줄·제목·아래 고정 버튼.
 * 다음 버튼은 늘 눌린다(필수값은 화면이 useRequired 로 확인 — 빈 칸으로 옮겨 가 알린다). 보내는 중에만 막는다(busy).
 * 앞 단계가 안 끝났는데 주소로 바로 들어오면 첫 미완료 단계로 돌려보낸다. 연 화면은 「이어서 하기」를 위해 남긴다.
 * 단계 화면에는 늘 「주문하기」가 있다(2026-11-13 사용자 — 확인 화면을 단계 줄에 넣는 대신):
 * 덜 끝났으면 막힌 모양이고 누르면 단계 줄의 덜 끝난 단계를 강조, 다 끝났으면 확인 화면으로.
 * 왼쪽 위 버튼은 「이전」 — 페이지 뒤로가 아니라 앞 단계로(상황 입력은 화면이 앞 장으로 넘김). 브라우저 뒤로는 그대로 페이지 기록.
 */
export default function StepShell({
  step,
  title,
  subtitle,
  children,
  nextText = "다음",
  busy = false,
  nextLooksDisabled = false,
  onNext,
  bottomTop,
  highlight = false,
  onPickSituation,
  onBack,
}: {
  /** 단계 줄에서 지금 단계(확인 화면은 null) */
  step: StepKey | null;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  nextText?: string;
  busy?: boolean;
  /** 막힌 모양이지만 눌린다(확인 화면 — 누르면 덜 끝난 단계를 강조) */
  nextLooksDisabled?: boolean;
  onNext?: () => void;
  /** 아래 버튼 바로 위 줄(누른 일 실패 알림 등) */
  bottomTop?: React.ReactNode;
  highlight?: boolean;
  onPickSituation?: () => void;
  /** 「이전」을 화면이 직접(상황 입력 — 앞 장) */
  onBack?: () => void;
}) {
  const router = useRouter();
  const path = usePathname();
  const hydrated = useHydrated();
  const allDone = useRequestStore(s => firstIncompleteIndex(s) >= STEPS.length) && hydrated;
  const [askedOrder, setAskedOrder] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const first = firstIncompleteIndex(useRequestStore.getState());
    const at = step ? STEPS.findIndex(x => x.key === step) : -1;
    if (at > first) return router.replace(STEPS[first].path);
    // 화면 1은 「이어서 하기」를 묻기 전이면 남기지 않는다(물음이 옛 화면으로 보내야 하니까)
    if (path !== "/request") markAskedDraft();
    if (askedDraft()) useRequestStore.setState({ lastPath: path });
    // 들어올 때 한 번만 본다(이 화면에서 고치는 동안 돌려보내지 않게)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, path]);

  return (
    <div className="flex flex-col pt-[112px]">
      <TopNavigator backLabel="이전" onBack={onBack ?? (() => router.push(prevPathOf(step)))} />
      {/* 단계 줄은 기기 입력값을 읽은 뒤에 그린다 */}
      {hydrated && (
        <StepRow
          current={step}
          highlight={highlight || askedOrder}
          onPickSituation={onPickSituation}
        />
      )}
      <Header title={title} subtitle={subtitle} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">{children}</div>
      <div className="h-[100px]" />
      {step ? (
        <BottomBar top={bottomTop}>
          <Button
            variant="inverse"
            aria-disabled={!allDone || undefined}
            onClick={() => (allDone ? router.push(CONFIRM_PATH) : setAskedOrder(true))}
          >
            주문하기
          </Button>
          {onNext && (
            <Button busy={busy} onClick={onNext}>
              {nextText}
            </Button>
          )}
        </BottomBar>
      ) : (
        onNext && (
          <BottomBar top={bottomTop}>
            <Button busy={busy} aria-disabled={nextLooksDisabled || undefined} onClick={onNext}>
              {nextText}
            </Button>
          </BottomBar>
        )
      )}
    </div>
  );
}
