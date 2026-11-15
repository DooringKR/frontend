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
import { trackRequest } from "../_lib/track";
import StepRow from "./StepRow";

/** 상황 입력 화면의 지금 장 — 이벤트에 붙인다 */
export type SlideInfo = { kind: "pick" | "buttons" | "detail"; situation?: string; index: number; count: number };

/**
 * 상황 주문 한 화면 — 위 바·단계 줄·제목·아래 고정 버튼.
 * 다음 버튼은 늘 눌린다(필수값은 화면이 useRequired 로 확인 — 빈 칸으로 옮겨 가 알린다). 보내는 중에만 막는다(busy).
 * 덜 채웠으면 옅은 색(nextReady=false), 다 채우면 파랑 — 누르기 전에 준비됐는지 보인다(2026-11-15 사용자 「L3」. 첫 장만 막는 안은 근거가 없어 안 씀).
 * 알림 문구는 칸 이름 줄 오른쪽(Field), 이름이 없는 화면은 제목 줄 오른쪽(titleError) — 문구가 생겨도 아래가 밀리지 않는다.
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
  nextReady = true,
  titleError,
  onNext,
  bottomTop,
  highlight = false,
  onPickSituation,
  onBack,
  slide,
}: {
  /** 상황 입력 화면의 지금 장(이벤트용) */
  slide?: SlideInfo;
  /** 다 채웠는지 — false 면 옅은 색(눌리긴 한다) */
  nextReady?: boolean;
  /** 제목 줄 오른쪽 알림(칸 이름이 없는 화면) */
  titleError?: string;
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

  // 이벤트 — 기기 입력값을 읽은 뒤(고른 상황 등 공통 속성이 맞게)
  const where = {
    step: step ?? "confirm",
    slide: slide?.kind ?? null,
    situation: slide?.situation ?? null,
  };
  useEffect(() => {
    if (!hydrated) return;
    trackRequest("Step Viewed", { ...where, slide_index: slide?.index ?? null, slide_count: slide?.count ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, path, slide?.index, slide?.kind, slide?.situation]);
  const next = () => {
    trackRequest("Next Clicked", { ...where, ready: step ? nextReady : !nextLooksDisabled });
    onNext?.();
  };
  const back = onBack ?? (() => router.push(prevPathOf(step)));

  return (
    <div className="flex flex-col pt-[112px]">
      <TopNavigator backLabel="이전" onBack={back} />
      {/* 단계 줄은 기기 입력값을 읽은 뒤에 그린다 */}
      {hydrated && (
        <StepRow
          current={step}
          highlight={highlight || askedOrder}
          onPickSituation={onPickSituation}
        />
      )}
      <Header
        title={title}
        subtitle={subtitle}
        aside={
          titleError && (
            <span role="alert" className="shrink-0 text-[14px] font-600 text-destructive">
              {titleError}
            </span>
          )
        }
      />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">{children}</div>
      {/* 아래 고정 칸만큼 비운다 — 버튼 위 줄(bottomTop)이 있으면 그만큼 더(마지막 칸이 가리지 않게).
          단계 화면은 버튼이 두 줄이라 한 줄(버튼 50 + 줄 사이 12)만큼 더 */}
      <div className={step ? (bottomTop ? "h-[272px]" : "h-[162px]") : bottomTop ? "h-[210px]" : "h-[100px]"} />
      {step ? (
        // 아래 버튼 두 줄(QA 「버튼 배치」 2026-11-15) — 윗줄 [이전][다음], 아랫줄 [주문하기].
        // 이전은 위 4단계 기준 앞 단계로(상황 입력 안에서는 앞 장, 첫 장은 홈) — 왼쪽 위 「이전」과 같은 일. 줄 사이는 버튼 사이와 같은 12
        <BottomBar
          top={
            <>
              {bottomTop}
              <div className="mb-3 flex gap-3 [&>*]:flex-1">
                <Button variant="secondary" onClick={back}>
                  이전
                </Button>
                {onNext && (
                  <Button
                    busy={busy}
                    variant={nextReady ? "default" : "inverse"}
                    aria-disabled={!nextReady || undefined}
                    onClick={next}
                  >
                    {nextText}
                  </Button>
                )}
              </div>
            </>
          }
        >
          <Button
            // 마지막 단계(수령인)에서 다 끝났으면 「다음」과 같은 일(확인 화면)이라 같은 색으로(2026-11-13 사용자)
            variant={allDone && step === STEPS[STEPS.length - 1].key ? "default" : "inverse"}
            aria-disabled={!allDone || undefined}
            onClick={() => {
              trackRequest("Order Clicked", { ...where, all_done: allDone });
              if (allDone) router.push(CONFIRM_PATH);
              else setAskedOrder(true);
            }}
          >
            주문하기
          </Button>
        </BottomBar>
      ) : (
        onNext && (
          <BottomBar top={bottomTop}>
            <Button busy={busy} aria-disabled={nextLooksDisabled || undefined} onClick={next}>
              {nextText}
            </Button>
          </BottomBar>
        )
      )}
    </div>
  );
}
