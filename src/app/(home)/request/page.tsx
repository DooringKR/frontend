"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import { PICK_MESSAGE } from "@/components/form/useRequired";
import Pictogram from "@/components/pictogram/Pictogram";
import Notice from "@/components/state/Notice";
import Sheet from "@/components/overlay/Sheet";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";

import SituationPicker from "./_components/SituationPicker";
import StepShell from "./_components/StepShell";
import { askedDraft, markAskedDraft, nextPathOf, useHydrated } from "./_lib/flow";
import { emptyPart, hasDraft, useRequestStore } from "./_lib/requestStore";
import { BUTTON_DETAIL, BUTTON_PICTOGRAM, SITUATIONS, type Situation, type SituationSlug, URGENT_NAME, URGENT_WHEN } from "./_lib/situations";
import { photoUrlOf, uploadPhotos } from "./_lib/submit";

type Slide =
  | { kind: "pick" }
  | { kind: "buttons"; s: Situation }
  | { kind: "detail"; s: Situation };

/**
 * 상황 입력 — 슬라이드(2026-11-13 QA): 상황 고르기 1장 + 고른 상황마다 「버튼」 1장·「자세히」 1장.
 * 한 장에 상황을 쌓지 않는다(정보가 많아져 길어진다 — 사용자 지적). 위에 몇 장 중 몇째를 점 줄로 보인다(CarouselDots).
 * DIY·자재 필요없는 수리는 슬라이드 없이 바로 다음 화면.
 * 화면 1 묶음(2026-11-12 사용자):
 *  - 바로배송(옛 현장 급한 수습): 강조. 고르면 15만 원만 더하고 다음 페이지는 없다. 어느 묶음과도 같이 고른다.
 *  - 문짝 교체 · 설치 · 가구 추가 · 가구 교체: 서로 같이 고른다.
 *  - DIY · 자재 필요없는 수리: 다른 묶음과도, 서로도 같이 못 고른다(바로배송만 같이).
 * 다음을 눌렀는데 안 고른 곳은 글 없이 선택지 테두리로 표시한다. 사진은 고르는 즉시 올린다(기기에는 경로만).
 */
export default function RequestStartPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const picked = SITUATIONS.filter(x => s.situations.includes(x.slug));
  const slides: Slide[] = [
    { kind: "pick" },
    ...picked.flatMap(x => [{ kind: "buttons", s: x } as Slide, { kind: "detail", s: x } as Slide]),
  ];
  const [api, setApi] = useState<CarouselApi>();
  const [at, setAt] = useState(0);
  const [askOpen, setAskOpen] = useState(false);
  const [uploading, setUploading] = useState<SituationSlug | null>(null);
  const [photoError, setPhotoError] = useState<Partial<Record<SituationSlug, string>>>({});
  /** 다음을 눌러 봤는데 안 고른 곳 — 「situations」 또는 상황 slug */
  const [missed, setMissed] = useState<Set<string>>(new Set());
  /** 들어오자마자 갈 장 — 다음 단계의 「이전」(?at=last)은 마지막 장, 홈에서 상황을 고르고 왔으면(?from=home) 둘째 장 */
  const startAt = useRef<"last" | 1 | null>(null);
  /** 슬라이드 묶음 높이 맞추기 — 장이 바뀌어 제목 줄 높이가 달라진 뒤(그린 뒤)에도 다시 부른다 */
  const fitRef = useRef<() => void>(() => {});

  const buttonsOf = (slug: SituationSlug) => s.parts[slug]?.buttons ?? [];
  const invalid = (key: string) =>
    missed.has(key) &&
    (key === "situations" ? picked.length === 0 : buttonsOf(key as SituationSlug).length === 0);
  const mark = (key: string) => setMissed(m => new Set(m).add(key));
  // 장마다 다음으로 갈 준비가 됐는지 — 첫 장은 상황 하나 이상, 버튼 장은 버튼 하나 이상, 자세히 장은 늘
  const readyAt = (i: number) => {
    const sl = slides[i];
    return !sl || sl.kind === "detail" || (sl.kind === "pick" ? picked.length > 0 : buttonsOf(sl.s.slug).length > 0);
  };
  const keyAt = (i: number) => {
    const sl = slides[i];
    return sl.kind === "pick" ? "situations" : sl.s.slug;
  };
  // 앞 장으로는 준비된 장을 지나야만 간다(2026-11-15 사용자 「다음이 옅으면 밀기도 시도하다 막혀야」) —
  // 첫 덜 된 장(open)까지만 그린다 — 거기서 앞으로 끌면 끝 장처럼 조금 밀리다 튕겨 돌아온다(넘어갔다 되돌아오지 않게).
  // embla 장 수가 바뀌어도 점 줄은 전체 장 수(count)를 보인다.
  const firstNotReady = slides.findIndex((_, i) => !readyAt(i));
  const open = firstNotReady < 0 ? slides.length - 1 : firstNotReady;
  /** 막힌 쪽으로 가려 함 — 그 장을 빨갛게(다음 버튼과 같은 표시) */
  const blocked = useRef(() => {});
  blocked.current = () => {
    if (open < slides.length - 1) mark(keyAt(open));
  };
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setAt(api.selectedScrollSnap());
      window.scrollTo({ top: 0 });
    };
    // 막힌 장에서 왼쪽으로 30px 넘게 끌었으면 「앞으로 가려 했다」
    let x0: number | null = null;
    const root = api.rootNode();
    const down = (e: PointerEvent) => {
      x0 = e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (x0 !== null && x0 - e.clientX > 30 && !api.canScrollNext()) blocked.current();
      x0 = null;
    };
    root.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    // 슬라이드 묶음 높이 = max(지금 장 높이, 아래 버튼까지 남은 화면).
    //  - 가장 긴 장을 따르면 짧은 장에서도 페이지가 길어져 스크롤바가 생기고 틀이 움직였다.
    //  - 지금 장 높이만 쓰면 짧은 장(칸 4개 = 88px) 아래 빈 곳을 밀어도 안 넘어갔다(2026-11-13 사용자).
    // 장 안 내용이 바뀌거나(사진·고를 곳 표시) 창 크기가 바뀌어도 다시 맞춘다.
    const fit = () => {
      const h = api.slideNodes()[api.selectedScrollSnap()]?.offsetHeight ?? 0;
      const top = api.rootNode().getBoundingClientRect().top + window.scrollY;
      const room = window.innerHeight - top - 110; // 아래 고정 버튼 칸
      api.containerNode().style.height = `${Math.max(h, room)}px`;
    };
    fitRef.current = fit;
    let ro = new ResizeObserver(fit);
    const watch = () => {
      ro.disconnect();
      ro = new ResizeObserver(fit);
      api.slideNodes().forEach(n => ro.observe(n));
      fit();
    };
    watch();
    window.addEventListener("resize", fit);
    api.on("select", onSelect).on("select", fit).on("reInit", watch);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      root.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      api.off("select", onSelect).off("select", fit).off("reInit", watch);
    };
  }, [api]);

  // 단계 줄에서 왔으면(/request?from=steps) 안내만, 다음 단계의 「이전」으로 왔으면(?at=last) 마지막 장,
  // 홈에서 고르고 주문하기로 왔으면(?from=home) 묻지 않고 이어서 — 상황을 골랐으면 첫 장은 홈에서 한 셈이라 둘째 장부터,
  // 처음 들어왔으면 작성하던 주문을 이어서 할지 묻는다
  useEffect(() => {
    if (!hydrated) return;
    const q = window.location.search;
    if (q.includes("at=last") || q.includes("from=steps") || q.includes("from=home")) {
      if (q.includes("at=last")) startAt.current = "last";
      if (q.includes("from=home") && useRequestStore.getState().situations.length > 0) startAt.current = 1;
      router.replace("/request");
      markAskedDraft();
    } else if (!askedDraft() && hasDraft(useRequestStore.getState())) setAskOpen(true);
    else markAskedDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // 들어오자마자 갈 장으로 — 기기 입력값을 읽어 장이 다 생기고 embla 가 다시 잰 뒤(위에서 정한 뒤라 이 차례)
  useEffect(() => {
    const to = startAt.current;
    if (!api || !hydrated || to === null) return;
    const id = requestAnimationFrame(() => {
      api.scrollTo(to === "last" ? api.scrollSnapList().length - 1 : to, true);
      startAt.current = null;
    });
    return () => cancelAnimationFrame(id);
  }, [api, hydrated, slides.length]);

  const toFirstSlide = () => api?.scrollTo(0);

  const next = () => {
    const slide = slides[at];
    if (slide.kind === "pick") {
      if (picked.length === 0) return mark("situations");
      return api?.scrollNext();
    }
    if (slide.kind === "buttons" && buttonsOf(slide.s.slug).length === 0) return mark(slide.s.slug);
    if (at < slides.length - 1) return api?.scrollNext();
    // 마지막 장 — 버튼을 안 고른 상황이 있으면 그 장으로
    const miss = slides.findIndex(x => x.kind === "buttons" && buttonsOf(x.s.slug).length === 0);
    if (miss >= 0) {
      const sl = slides[miss] as { s: Situation };
      mark(sl.s.slug);
      return api?.scrollTo(miss);
    }
    router.push(nextPathOf("situation"));
  };

  const addPhotos = async (slug: SituationSlug, files: File[]) => {
    setUploading(slug);
    setPhotoError(e => ({ ...e, [slug]: undefined }));
    try {
      const paths = await uploadPhotos(files);
      const cur = useRequestStore.getState().photoPaths;
      s.set({ photoPaths: { ...cur, [slug]: [...(cur[slug] ?? []), ...paths] } });
    } catch (e) {
      console.error("[request] 사진 올리기 실패", e);
      setPhotoError(x => ({ ...x, [slug]: "사진을 올리지 못했어요. 다시 골라 주세요" }));
    } finally {
      setUploading(null);
    }
  };

  const cur = slides[Math.min(at, slides.length - 1)];
  // 다음 버튼 색(L3) — 첫 장은 상황 하나 이상, 버튼 장은 버튼 하나 이상, 자세히 장은 늘(마지막 장이면 모든 상황에 버튼이 있어야)
  const nextReady =
    cur.kind === "pick"
      ? picked.length > 0
      : cur.kind === "buttons"
        ? buttonsOf(cur.s.slug).length > 0
        : at < slides.length - 1 || picked.every(x => buttonsOf(x.slug).length > 0);
  // 칸 이름이 없는 장이라 알림은 제목 줄 오른쪽
  const titleError =
    (cur.kind === "pick" && invalid("situations")) || (cur.kind === "buttons" && invalid(cur.s.slug)) ? PICK_MESSAGE : undefined;
  const title = cur.kind === "pick" ? "어떤 상황인가요?" : cur.s.name;
  const subtitle = cur.kind === "detail" ? buttonsOf(cur.s.slug).join(", ") : undefined;
  // 자세히 장은 제목 밑에 고른 버튼 줄이 붙어 슬라이드가 내려간다 — 그린 뒤 다시 맞춘다(안 그러면 16px 넘쳐 스크롤바)
  useLayoutEffect(() => fitRef.current(), [at, subtitle]);

  const savedAt = s.savedAt
    ? new Date(s.savedAt).toLocaleString("ko-KR", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <StepShell
      step="situation"
      title={title}
      subtitle={subtitle}
      nextReady={nextReady}
      // 바로배송 없이 상황만 골랐으면 바로배송을 한 번 더 권한다(QA 「바로배송 강조」 2026-11-15, 문구는 사용자).
      // 상황 묶음 밑에 두면 첫 장이 길어 아래 버튼에 가려 안 보였다 — 아래 버튼 바로 위에 붙여 늘 보이고 카드도 안 밀린다
      bottomTop={
        cur.kind === "pick" && picked.length > 0 && !s.urgent ? (
          <Notice title="혹시 오늘 안에 급하게 필요하세요?" className="mb-3">
            {URGENT_WHEN} 배송이 필요하다면 {URGENT_NAME}을 선택해주세요
          </Notice>
        ) : undefined
      }
      titleError={titleError}
      onNext={next}
      onPickSituation={toFirstSlide}
      onBack={() => (at > 0 ? api?.scrollPrev() : router.push("/"))} // 첫 장의 「이전」은 흐름 밖(홈) — 기록상 뒤로면 다음 단계로 갈 수 있다
    >
      {/* 상황을 안 골라도 끌 수는 있다 — 앞 장이 없으니 끝에서 튕겨 돌아와 「막혔다」가 손에 느껴진다 */}
      <Carousel setApi={setApi} className="-mx-5">
        {/* 몇 장 중 몇째 — 점 줄(「1 / 7」 글 대신) */}
        <CarouselDots className="mb-5" count={slides.length} onBeyond={() => blocked.current()} />
        <CarouselContent className="ml-0 items-start">
          {slides.map((sl, i) =>
            i > open ? null : sl.kind === "pick" ? (
              <CarouselItem key="pick" className="flex flex-col gap-5 px-5">
                <SituationPicker invalid={invalid("situations")} />
              </CarouselItem>
            ) : sl.kind === "buttons" ? (
              <CarouselItem key={`${sl.s.slug}-buttons`} className="flex flex-col gap-5 px-5">
                <Choose
                  multiple
                  aria-label={sl.s.name}
                  aria-invalid={invalid(sl.s.slug)}
                  value={buttonsOf(sl.s.slug)}
                  onChange={v => s.setPart(sl.s.slug, { buttons: v })}
                  options={sl.s.buttons.map(b => ({
                    value: b,
                    label: b,
                    image: <Pictogram name={BUTTON_PICTOGRAM[b]} />,
                    // 카드는 고르기만, 설명·실제 사진은 「자세히 ›」 팝업으로(창고문 시범)
                    detail: BUTTON_DETAIL[b] && { text: BUTTON_DETAIL[b].text, images: BUTTON_DETAIL[b].photos },
                  }))}
                />
              </CarouselItem>
            ) : (
              <CarouselItem key={`${sl.s.slug}-detail`} className="flex flex-col gap-5 px-5">
                <DetailFields
                  s={sl.s}
                  uploading={uploading === sl.s.slug}
                  photoError={photoError[sl.s.slug]}
                  onPhotos={files => files.length > 0 && void addPhotos(sl.s.slug, files)}
                />
              </CarouselItem>
            ),
          )}
        </CarouselContent>
      </Carousel>

      <Sheet
        open={askOpen}
        onOpenChange={setAskOpen}
        dismissible={false}
        title="작성하던 주문이 있어요"
        description={savedAt}
        footer={
          <>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                s.reset();
                markAskedDraft();
                setAskOpen(false);
              }}
            >
              새로 시작
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                markAskedDraft();
                setAskOpen(false);
                if (s.lastPath !== "/request") router.push(s.lastPath);
              }}
            >
              이어서 하기
            </Button>
          </>
        }
      />
    </StepShell>
  );
}

/** 상황 하나의 자세히 — 사진(선택)·대략적인 양·메모. 치수는 받지 않는다(실무자가 실측하거나 전화로 받는다) */
function DetailFields({
  s: x,
  uploading,
  photoError,
  onPhotos,
}: {
  s: Situation;
  uploading: boolean;
  photoError?: string;
  onPhotos: (files: File[]) => void;
}) {
  const s = useRequestStore();
  const part = s.parts[x.slug] ?? emptyPart();
  const paths = s.photoPaths[x.slug] ?? [];
  return (
    <>
      <Field label="현장 사진 (선택)" error={photoError}>
        <PhotoPick
          value={[]}
          maxFiles={5}
          busy={uploading}
          uploaded={paths.map((p, n) => ({ src: photoUrlOf(p), name: `${x.name} 사진 ${n + 1}` }))}
          onRemoveUploaded={n =>
            s.set({ photoPaths: { ...s.photoPaths, [x.slug]: paths.filter((_, k) => k !== n) } })
          }
          onChange={onPhotos}
        />
      </Field>
      <Field label="대략적인 양">
        <Input
          placeholder="예) 문짝 2장, 하부장 1m"
          value={part.amountNote}
          onChange={e => s.setPart(x.slug, { amountNote: e.target.value })}
        />
      </Field>
      <Field label="메모">
        <Input value={part.memo} onChange={e => s.setPart(x.slug, { memo: e.target.value })} />
      </Field>
    </>
  );
}
