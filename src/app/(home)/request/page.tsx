"use client";

import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import { PICK_MESSAGE, TYPE_MESSAGE } from "@/components/form/useRequired";
import NavRow from "@/components/nav/NavRow";
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
import { Textarea } from "@/components/ui/textarea";

import ButtonPictos from "./_components/ButtonPictos";
import SituationPicker from "./_components/SituationPicker";
import StepShell from "./_components/StepShell";
import { askedDraft, buttonsReady, detailReady, markAskedDraft, nextPathOf, useHydrated } from "./_lib/flow";
import { emptyPart, hasDraft, useRequestStore } from "./_lib/requestStore";
import { BUTTON_DETAIL, DIRECT, FULLSET, pictogramOf, SITUATIONS, type Situation, type SituationSlug, URGENT_NAME, URGENT_WHEN } from "./_lib/situations";
import { photoUrlOf, uploadPhotos } from "./_lib/submit";
import { trackRequest } from "./_lib/track";

type Slide =
  | { kind: "pick" }
  | { kind: "fullset"; s: Situation }
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
    // 가구 추가는 품목 앞에 풀세트 확인 장(풀세트면 개수대연구소 상담으로)
    ...picked.flatMap(x => [
      ...(x.slug === "partial" ? [{ kind: "fullset", s: x } as Slide] : []),
      { kind: "buttons", s: x } as Slide,
      { kind: "detail", s: x } as Slide,
    ]),
  ];
  const [api, setApi] = useState<CarouselApi>();
  const [at, setAt] = useState(0);
  const [askOpen, setAskOpen] = useState(false);
  /** 올리는 중인 사진 칸 — 상황 slug(설명 사진) 또는 「slug:before」(기존 사진) */
  const [uploading, setUploading] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<Record<string, string | undefined>>({});
  /** 다음을 눌러 봤는데 안 채운 곳 — 「situations」, 상황 slug(품목 장), 「slug:detail」(설명 장) */
  const [missed, setMissed] = useState<Set<string>>(new Set());
  /** 들어오자마자 갈 장 — 다음 단계의 「이전」(?at=last)은 마지막 장 */
  const startAt = useRef<"last" | null>(null);
  /** 슬라이드 묶음 높이 맞추기 — 장이 바뀌어 제목 줄 높이가 달라진 뒤(그린 뒤)에도 다시 부른다 */
  const fitRef = useRef<() => void>(() => {});

  const buttonsOf = (slug: SituationSlug) => s.parts[slug]?.buttons ?? [];
  const invalid = (key: string) => {
    if (!missed.has(key)) return false;
    if (key === "situations") return picked.length === 0;
    if (key.endsWith(":detail")) return !detailReady(s, key.split(":")[0] as SituationSlug);
    return !buttonsReady(s, key as SituationSlug);
  };
  const mark = (key: string) => setMissed(m => new Set(m).add(key));
  // 장마다 다음으로 갈 준비가 됐는지 — 첫 장은 상황 하나 이상, 품목 장은 품목이나 「직접 입력」, 설명 장은 flow.ts detailReady, 풀세트 장은 늘
  const readyAt = (i: number) => {
    const sl = slides[i];
    if (!sl || sl.kind === "fullset") return true;
    if (sl.kind === "pick") return picked.length > 0;
    return sl.kind === "buttons" ? buttonsReady(s, sl.s.slug) : detailReady(s, sl.s.slug);
  };
  const keyAt = (i: number) => {
    const sl = slides[i];
    return sl.kind === "pick" ? "situations" : sl.kind === "detail" ? `${sl.s.slug}:detail` : sl.s.slug;
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
      const room = window.innerHeight - top - 172; // 아래 고정 버튼 칸(두 줄 — 버튼 50·50, 줄 사이 12, 그러데이션·여백 60)
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
  // 홈에서 고르고 주문하기로 왔으면(?from=home) 묻지 않고 첫 장에 고른 그대로(2026-11-15 사용자 「그 화면이 떠야」 — 둘째 장으로 건너뛰지 않는다),
  // 처음 들어왔으면 작성하던 주문을 이어서 할지 묻는다
  useEffect(() => {
    if (!hydrated) return;
    const q = window.location.search;
    if (q.includes("at=last") || q.includes("from=steps") || q.includes("from=home")) {
      if (q.includes("at=last")) startAt.current = "last";
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
      api.scrollTo(api.scrollSnapList().length - 1, true);
      startAt.current = null;
    });
    return () => cancelAnimationFrame(id);
  }, [api, hydrated, slides.length]);

  const toFirstSlide = () => api?.scrollTo(0);

  const next = () => {
    if (!readyAt(at)) return mark(keyAt(at));
    if (at < slides.length - 1) return api?.scrollNext();
    // 마지막 장 — 덜 된 장이 있으면 그 장으로
    const miss = slides.findIndex((_, i) => !readyAt(i));
    if (miss >= 0) {
      mark(keyAt(miss));
      return api?.scrollTo(miss);
    }
    router.push(nextPathOf("situation"));
  };

  /** 「AS가 필요한 상황을 직접 입력할게요」 — 다음을 누르지 않고 바로 설명 장으로(QA 「단계별 가구 종류 및 시나리오 수정」 2026-11-15). 품목 장이 끝난 걸로 바뀌어 설명 장이 그려진 뒤 넘긴다 */
  const goDirect = (slug: SituationSlug) => {
    s.setPart(slug, { direct: true });
    requestAnimationFrame(() => requestAnimationFrame(() => api?.scrollNext()));
  };

  const addPhotos = async (slug: SituationSlug, files: File[]) => {
    const key = slug;
    setUploading(key);
    setPhotoError(e => ({ ...e, [key]: undefined }));
    try {
      const paths = await uploadPhotos(files);
      const cur = useRequestStore.getState().photoPaths;
      s.set({ photoPaths: { ...cur, [slug]: [...(cur[slug] ?? []), ...paths] } });
      trackRequest("Photo Uploaded", { situation: slug, count: files.length, ok: true });
    } catch (e) {
      console.error("[request] 사진 올리기 실패", e);
      trackRequest("Photo Uploaded", { situation: slug, count: files.length, ok: false });
      setPhotoError(x => ({ ...x, [key]: "사진을 올리지 못했어요. 다시 골라 주세요" }));
    } finally {
      setUploading(null);
    }
  };

  const cur = slides[Math.min(at, slides.length - 1)];
  // 다음 버튼 색(L3) — 지금 장이 준비됐는지(마지막 장이면 모든 장이)
  const nextReady = at < slides.length - 1 ? readyAt(at) : slides.every((_, i) => readyAt(i));
  // 칸 이름이 없는 장이라 알림은 제목 줄 오른쪽
  const titleError =
    (cur.kind === "pick" && invalid("situations")) || (cur.kind === "buttons" && invalid(cur.s.slug)) ? PICK_MESSAGE : undefined;
  // 제목은 묻는 말로 — 품목 장은 상황마다(어떤 문짝·가구가 필요한지, 어떤 가구를 교체할지), 설명 장은 공통(2026-11-15 사용자)
  const title =
    cur.kind === "pick"
      ? "어떤 상황인가요?"
      : cur.kind === "fullset"
        ? FULLSET.title
        : cur.kind === "buttons"
          ? cur.s.question
          : "어떤 상황인지 알려주시겠어요?";
  // 제목 밑 부제는 쓰지 않는다 — 장마다 제목 높이가 같아야 점 줄이 늘 같은 자리(QA 「가구 추가 시」 2026-11-15 「페이지 위치를 알리는 ui 는 고정」).
  // 고른 가구·풀세트 설명은 장 안으로. 장이 바뀐 뒤 높이를 다시 맞춘다
  useLayoutEffect(() => fitRef.current(), [at]);

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
      slide={{
        kind: cur.kind,
        situation: cur.kind === "pick" ? undefined : cur.s.slug,
        index: Math.min(at, slides.length - 1),
        count: slides.length,
      }}
      title={title}
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
            ) : sl.kind === "fullset" ? (
              // 네 → 개수대연구소 상담 폼(새 탭), 아니요·다음 → 품목 고르기
              <CarouselItem key="partial-fullset" className="flex flex-col gap-3 px-5">
                {/* 설명은 장 안에(제목 밑 부제 대신 — 점 줄 자리 고정), 글자는 Header 부제와 같게 */}
                <p className="mb-2 text-[17px] text-gray-500">{FULLSET.description}</p>
                <NavRow card external href={FULLSET.formUrl} label="네, 주방 풀세트예요" icon={<Pictogram name="whole" />} />
                <NavRow card label="아니요, 일부 가구만 필요해요" icon={<Pictogram name="partial" />} onClick={() => api?.scrollNext()} />
              </CarouselItem>
            ) : sl.kind === "buttons" ? (
              <CarouselItem key={`${sl.s.slug}-buttons`} className="flex flex-col gap-5 px-5">
                <Choose
                  multiple
                  aria-label={sl.s.name}
                  aria-invalid={invalid(sl.s.slug)}
                  value={buttonsOf(sl.s.slug)}
                  // 품목을 고르면 「직접 입력」은 풀린다(정의된 품목과 같이 못 고른다)
                  onChange={v => s.setPart(sl.s.slug, { buttons: v, ...(v.length ? { direct: false } : {}) })}
                  options={sl.s.buttons.map(b => ({
                    value: b,
                    label: b,
                    image: <Pictogram name={pictogramOf(sl.s.slug, b)} />,
                    // 카드는 고르기만, 설명·실제 사진은 「자세히 ›」 팝업으로(창고문 시범)
                    detail: BUTTON_DETAIL[b] && { text: BUTTON_DETAIL[b].text, images: BUTTON_DETAIL[b].photos },
                  }))}
                />
                {/* 정의된 품목에 없는 주문용 — 품목을 하나라도 고르면 막힌다(첫 장 DIY·수리처럼) */}
                <NavRow
                  card
                  label={<span className="break-keep">{DIRECT.label}</span>}
                  icon={<PencilLine className="size-6" />}
                  disabled={buttonsOf(sl.s.slug).length > 0}
                  onClick={() => goDirect(sl.s.slug)}
                />
              </CarouselItem>
            ) : (
              <CarouselItem key={`${sl.s.slug}-detail`} className="flex flex-col gap-5 px-5">
                <DetailFields
                  s={sl.s}
                  uploading={uploading}
                  photoError={photoError}
                  invalid={invalid(`${sl.s.slug}:detail`)}
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
                trackRequest("Draft Answered", { choice: "restart" });
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
                trackRequest("Draft Answered", { choice: "resume" });
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

/**
 * 상황 하나의 설명 장 — 제목 「어떤 상황인지 알려주시겠어요?」(QA 「단계별 가구 종류 및 시나리오 수정」 2026-11-15). 치수는 받지 않는다(실무자가 실측하거나 전화로 받는다).
 *  - 고른 가구(그림 칸) → 사진 칸 + 글 칸(옛 현장 사진·대략적인 양을 하나로, 메모 칸은 뺌 — 제목이 묻는 말이라 칸 이름 없이) → 문짝·가구 추가: 경첩도 필요한가요?(선택)
 *  - 사진·글은 선택. 품목 없이 직접 입력이면 글이 꼭 있어야 한다
 */
function DetailFields({
  s: x,
  uploading,
  photoError,
  invalid,
  onPhotos,
}: {
  s: Situation;
  uploading: string | null;
  photoError: Record<string, string | undefined>;
  /** 다음을 눌러 봤는데 덜 채움 — 빠진 칸에 알림 */
  invalid: boolean;
  onPhotos: (files: File[]) => void;
}) {
  const s = useRequestStore();
  const part = s.parts[x.slug] ?? emptyPart();
  const paths = s.photoPaths[x.slug] ?? [];
  const textMissing = invalid && !!part.direct && part.buttons.length === 0 && !part.amountNote.trim();
  return (
    <>
      {/* 고른 가구 — 제목 밑 글 대신 그림 칸으로(QA 「가구 추가 시」, 첫 장 미리보기와 같은 컴포넌트) */}
      {part.buttons.length > 0 && (
        <Field label="고른 가구">
          <ButtonPictos slug={x.slug} buttons={part.buttons} />
        </Field>
      )}
      <Field error={photoError[x.slug] ?? (textMissing ? TYPE_MESSAGE : undefined)}>
        <PhotoPick
          value={[]}
          maxFiles={5}
          busy={uploading === x.slug}
          uploaded={paths.map((p, n) => ({ src: photoUrlOf(p), name: `${x.name} 사진 ${n + 1}` }))}
          onRemoveUploaded={n =>
            s.set({ photoPaths: { ...s.photoPaths, [x.slug]: paths.filter((_, k) => k !== n) } })
          }
          onChange={onPhotos}
        />
        <Textarea
          aria-invalid={textMissing || undefined}
          placeholder="예) 문짝 2장, 하부장 1m"
          value={part.amountNote}
          onChange={e => s.setPart(x.slug, { amountNote: e.target.value })}
        />
      </Field>
      {x.asksHinge && (
        <Field label="경첩도 필요한가요? (선택)">
          <Choose
            aria-label="경첩"
            value={part.hinge == null ? null : part.hinge ? "yes" : "no"}
            onChange={v => s.setPart(x.slug, { hinge: v === "yes" })}
            options={[
              { value: "yes", label: "필요해요" },
              { value: "no", label: "필요 없어요" },
            ]}
          />
        </Field>
      )}
    </>
  );
}
