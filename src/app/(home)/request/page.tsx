"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import { useRequired } from "@/components/form/useRequired";
import NavRow from "@/components/nav/NavRow";
import Sheet from "@/components/overlay/Sheet";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import StepShell from "./_components/StepShell";
import { askedDraft, markAskedDraft, nextPathOf, useHydrated } from "./_lib/flow";
import { emptyPart, hasDraft, useRequestStore } from "./_lib/requestStore";
import { SITUATIONS, type SituationSlug } from "./_lib/situations";
import { photoUrlOf, uploadPhotos } from "./_lib/submit";

const TITLES = ["어떤 상황인가요?", "무엇이 필요한가요?", "자세히 알려주세요"];
const SWIPE_HINT = "옆으로 밀면 세부 정보를 바꿀 수 있어요";

/**
 * 상황 입력 — 슬라이드 3장(2026-11-13 QA): 상황 고르기 / 상황별 버튼 / 상황 자세히.
 * 고른 상황이 여럿이면 2·3장 안에 상황별로 위아래로 쌓는다(장 수는 늘 3). DIY·자재 필요없는 수리는 슬라이드 없이 바로 다음 화면.
 * 화면 1 묶음(2026-11-12 사용자):
 *  - 현장 급한 수습: 강조. 고르면 15만 원만 더하고 다음 페이지는 없다. 어느 묶음과도 같이 고른다.
 *  - 부분가구 추가 · 문짝 교체 또는 설치 · 장 일부 또는 전체 교체: 서로 같이 고른다.
 *  - DIY · 자재 필요없는 수리: 다른 묶음과도, 서로도 같이 못 고른다(급한 수습만 같이).
 * 사진은 고르는 즉시 올린다(기기에는 경로만 남긴다). 치수는 받지 않는다 — 실무자가 실측하거나 전화로 받는다.
 */
export default function RequestStartPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const picked = SITUATIONS.filter((x) => s.situations.includes(x.slug));
  const [api, setApi] = useState<CarouselApi>();
  const [at, setAt] = useState(0);
  const [askOpen, setAskOpen] = useState(false);
  const [uploading, setUploading] = useState<SituationSlug | null>(null);
  const [photoError, setPhotoError] = useState<Partial<Record<SituationSlug, string>>>({});

  const req1 = useRequired({ situations: picked.length > 0 || "상황을 하나 이상 골라 주세요" });
  const req2 = useRequired(
    Object.fromEntries(
      picked.map((x) => [x.slug, (s.parts[x.slug]?.buttons.length ?? 0) > 0 || "하나 이상 골라 주세요"]),
    ) as Record<SituationSlug, boolean | string>,
  );
  const buttonsDone = picked.every((x) => (s.parts[x.slug]?.buttons.length ?? 0) > 0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setAt(api.selectedScrollSnap());
      window.scrollTo({ top: 0 });
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
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
    if (at === 0) return req1.check() && api?.scrollNext();
    if (at === 1) return req2.check() && api?.scrollNext();
    if (!buttonsDone) {
      api?.scrollTo(1, true);
      requestAnimationFrame(() => req2.check());
      return;
    }
    router.push(nextPathOf("situation"));
  };

  const addPhotos = async (slug: SituationSlug, files: File[]) => {
    setUploading(slug);
    setPhotoError((e) => ({ ...e, [slug]: undefined }));
    try {
      const paths = await uploadPhotos(files);
      const cur = useRequestStore.getState().photoPaths;
      s.set({ photoPaths: { ...cur, [slug]: [...(cur[slug] ?? []), ...paths] } });
    } catch (e) {
      console.error("[request] 사진 올리기 실패", e);
      setPhotoError((x) => ({ ...x, [slug]: "사진을 올리지 못했어요. 다시 골라 주세요" }));
    } finally {
      setUploading(null);
    }
  };

  const savedAt = s.savedAt
    ? new Date(s.savedAt).toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <StepShell step="situation" title={TITLES[at]} onNext={next} onPickSituation={toFirstSlide}>
      <Carousel setApi={setApi} opts={{ watchDrag: picked.length > 0 }} className="-mx-5">
        <CarouselContent className="ml-0 items-start">
          <CarouselItem className="flex flex-col gap-5 px-5">
            <Choose
              multiple
              aria-label="현장 급한 수습"
              value={s.urgent ? ["urgent"] : []}
              onChange={(v) => s.set({ urgent: v.includes("urgent") })}
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
            <Field fieldRef={req1.ref("situations")} error={req1.error("situations")}>
              <Choose<SituationSlug>
                multiple
                aria-label="상황"
                value={s.situations}
                onChange={(v) => s.set({ situations: v })}
                options={SITUATIONS.map((x) => ({ value: x.slug, label: x.name }))}
              />
            </Field>
            <Separator className="bg-gray-100" />
            <NavRow card label="DIY(셀프 주문)" disabled={picked.length > 0} onClick={() => router.push("/diy")} />
            <NavRow
              card
              label="자재 필요없는 수리"
              disabled={picked.length > 0}
              onClick={() => router.push("/request/not-served")}
            />
          </CarouselItem>

          <CarouselItem className="flex flex-col gap-5 px-5">
            {picked.map((x) => (
              <Field key={x.slug} label={x.name} fieldRef={req2.ref(x.slug)} error={req2.error(x.slug)}>
                <Choose
                  multiple
                  aria-label={x.name}
                  value={s.parts[x.slug]?.buttons ?? []}
                  onChange={(v) => s.setPart(x.slug, { buttons: v })}
                  options={x.buttons.map((b) => ({ value: b, label: b }))}
                />
              </Field>
            ))}
          </CarouselItem>

          <CarouselItem className="flex flex-col gap-5 px-5">
            {picked.map((x, i) => {
              const part = s.parts[x.slug] ?? emptyPart();
              const paths = s.photoPaths[x.slug] ?? [];
              return (
                <section key={x.slug} aria-label={x.name} className="flex flex-col gap-5">
                  {i > 0 && <Separator className="bg-gray-100" />}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[17px] font-700 text-gray-900">{x.name}</h3>
                    {part.buttons.length > 0 && <p className="text-[14px] text-gray-500">{part.buttons.join(", ")}</p>}
                  </div>
                  <Field label="현장 사진 (선택)" error={photoError[x.slug]}>
                    <PhotoPick
                      value={[]}
                      maxFiles={5}
                      busy={uploading === x.slug}
                      uploaded={paths.map((p, n) => ({ src: photoUrlOf(p), name: `${x.name} 사진 ${n + 1}` }))}
                      onRemoveUploaded={(n) =>
                        s.set({ photoPaths: { ...s.photoPaths, [x.slug]: paths.filter((_, k) => k !== n) } })
                      }
                      onChange={(files) => files.length > 0 && void addPhotos(x.slug, files)}
                    />
                  </Field>
                  <Field label="대략적인 양">
                    <Input
                      placeholder="예) 문짝 2장, 하부장 1m"
                      value={part.amountNote}
                      onChange={(e) => s.setPart(x.slug, { amountNote: e.target.value })}
                    />
                  </Field>
                  <Field label="메모">
                    <Input value={part.memo} onChange={(e) => s.setPart(x.slug, { memo: e.target.value })} />
                  </Field>
                </section>
              );
            })}
          </CarouselItem>
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
