"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import NavRow from "@/components/nav/NavRow";
import Sheet from "@/components/overlay/Sheet";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import StepShell from "./_components/StepShell";
import { askedDraft, markAskedDraft, nextPathOf, useHydrated } from "./_lib/flow";
import { emptyPart, hasDraft, useRequestStore } from "./_lib/requestStore";
import { SITUATIONS, type Situation, type SituationSlug } from "./_lib/situations";
import { photoUrlOf, uploadPhotos } from "./_lib/submit";

const SWIPE_HINT = "옆으로 밀면 세부 정보를 바꿀 수 있어요";

type Slide =
  | { kind: "pick" }
  | { kind: "buttons"; s: Situation }
  | { kind: "detail"; s: Situation };

/**
 * 상황 입력 — 슬라이드(2026-11-13 QA): 상황 고르기 1장 + 고른 상황마다 「버튼」 1장·「자세히」 1장.
 * 한 장에 상황을 쌓지 않는다(정보가 많아져 길어진다 — 사용자 지적). 위에 「지금 / 전체」를 보인다(shadcn Carousel 예시).
 * DIY·자재 필요없는 수리는 슬라이드 없이 바로 다음 화면.
 * 화면 1 묶음(2026-11-12 사용자):
 *  - 현장 급한 수습: 강조. 고르면 15만 원만 더하고 다음 페이지는 없다. 어느 묶음과도 같이 고른다.
 *  - 부분가구 추가 · 문짝 교체 또는 설치 · 장 일부 또는 전체 교체: 서로 같이 고른다.
 *  - DIY · 자재 필요없는 수리: 다른 묶음과도, 서로도 같이 못 고른다(급한 수습만 같이).
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

  const buttonsOf = (slug: SituationSlug) => s.parts[slug]?.buttons ?? [];
  const invalid = (key: string) =>
    missed.has(key) &&
    (key === "situations" ? picked.length === 0 : buttonsOf(key as SituationSlug).length === 0);
  const mark = (key: string) => setMissed(m => new Set(m).add(key));

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setAt(api.selectedScrollSnap());
      window.scrollTo({ top: 0 });
    };
    // 슬라이드 묶음 높이 = 지금 보이는 장 높이. 안 그러면 짧은 장을 보는데도 가장 긴 장만큼 페이지가 길어져
    // 스크롤바가 생기고 틀이 움직였다. 장 안 내용이 바뀌어도(사진·고를 곳 표시) 다시 맞춘다.
    const fit = () => {
      const h = api.slideNodes()[api.selectedScrollSnap()]?.offsetHeight;
      if (h) api.containerNode().style.height = `${h}px`;
    };
    let ro = new ResizeObserver(fit);
    const watch = () => {
      ro.disconnect();
      ro = new ResizeObserver(fit);
      api.slideNodes().forEach(n => ro.observe(n));
      fit();
    };
    watch();
    api.on("select", onSelect).on("select", fit).on("reInit", watch);
    return () => {
      ro.disconnect();
      api.off("select", onSelect).off("select", fit).off("reInit", watch);
    };
  }, [api]);

  // 단계 줄에서 왔으면(/request?from=steps) 안내만, 처음 들어왔으면 작성하던 주문을 이어서 할지 묻는다
  useEffect(() => {
    if (!hydrated) return;
    if (window.location.search.includes("from=steps")) {
      router.replace("/request");
      if (useRequestStore.getState().situations.length > 0) toast(SWIPE_HINT);
      markAskedDraft();
    } else if (!askedDraft() && hasDraft(useRequestStore.getState())) setAskOpen(true);
    else markAskedDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const toFirstSlide = () => {
    api?.scrollTo(0);
    if (picked.length > 0) toast(SWIPE_HINT);
  };

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
  const title = cur.kind === "pick" ? "어떤 상황인가요?" : cur.s.name;
  const subtitle = cur.kind === "detail" ? buttonsOf(cur.s.slug).join(", ") : undefined;
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
      onNext={next}
      onPickSituation={toFirstSlide}
    >
      {/* 몇 장 중 몇째 — shadcn Carousel 예시의 「현재 / 전체」 글(text-sm text-muted-foreground) 그대로 */}
      <p className="-mb-2 text-center text-sm text-muted-foreground" aria-live="polite">
        {Math.min(at, slides.length - 1) + 1} / {slides.length}
      </p>
      <Carousel setApi={setApi} opts={{ watchDrag: picked.length > 0 }} className="-mx-5">
        <CarouselContent className="ml-0 items-start">
          {slides.map(sl =>
            sl.kind === "pick" ? (
              <CarouselItem key="pick" className="flex flex-col gap-5 px-5">
                <Choose
                  multiple
                  aria-label="현장 급한 수습"
                  value={s.urgent ? ["urgent"] : []}
                  onChange={v => s.set({ urgent: v.includes("urgent") })}
                  options={[
                    {
                      value: "urgent",
                      label: "현장 급한 수습",
                      emphasized: true,
                      description: (
                        <>
                          3일 이내 · 15만 원 추가
                          <br />
                          현장에 부족한 자재·가구 추가
                          <br />
                          현장 가구 사이즈나 사양이 안 맞을 때
                        </>
                      ),
                    },
                  ]}
                />
                <Separator className="bg-gray-100" />
                <Choose<SituationSlug>
                  multiple
                  aria-label="상황"
                  aria-invalid={invalid("situations")}
                  value={s.situations}
                  onChange={v => s.set({ situations: v })}
                  options={SITUATIONS.map(x => ({ value: x.slug, label: x.name }))}
                />
                <Separator className="bg-gray-100" />
                <NavRow
                  card
                  label="DIY(셀프 주문)"
                  disabled={picked.length > 0}
                  onClick={() => router.push("/diy")}
                />
                <NavRow
                  card
                  label="자재 필요없는 수리"
                  disabled={picked.length > 0}
                  onClick={() => router.push("/request/not-served")}
                />
              </CarouselItem>
            ) : sl.kind === "buttons" ? (
              <CarouselItem key={`${sl.s.slug}-buttons`} className="flex flex-col gap-5 px-5">
                <Choose
                  multiple
                  aria-label={sl.s.name}
                  aria-invalid={invalid(sl.s.slug)}
                  value={buttonsOf(sl.s.slug)}
                  onChange={v => s.setPart(sl.s.slug, { buttons: v })}
                  options={sl.s.buttons.map(b => ({ value: b, label: b }))}
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
