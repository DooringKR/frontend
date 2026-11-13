"use client";

import { useState } from "react";
import { toast } from "sonner";

import AddressField from "@/components/form/AddressField";
import Choose from "@/components/form/Choose";
import DateField from "@/components/form/DateField";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import PhoneInput from "@/components/form/PhoneInput";
import PhotoPick from "@/components/form/PhotoPick";
import TimeField from "@/components/form/TimeField";
import { useRequired } from "@/components/form/useRequired";
import PhotoThumbs from "@/components/media/PhotoThumbs";
import NavTiles from "@/components/nav/NavTiles";
import NavRow from "@/components/nav/NavRow";
import Pictogram from "@/components/pictogram/Pictogram";
import { PICTOGRAMS, type PictogramName } from "@/components/pictogram/paths";
import BottomBar from "@/components/overlay/BottomBar";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import Sheet from "@/components/overlay/Sheet";
import ProgressBar from "@/components/Progress/ProgressBar";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Notice from "@/components/state/Notice";
import { EmptyState, ErrorBanner, ListSkeleton, Loading } from "@/components/state/StateViews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ActionError, useAction } from "@/components/ui/use-action";
import { useCopy } from "@/lib/use-copy";
import { ChevronDown } from "lucide-react";

/** 견본의 한 칸 — data-behavior 로 동작 목록(lib/design/behaviors)과 잇는다(스크린샷 표가 이 칸을 찍는다) */
function Spec({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section data-behavior={id} className="flex flex-col gap-3 border-b border-gray-100 px-5 py-6">
      <h2 className="text-[14px] font-600 text-gray-500">
        {title} <span className="font-400 text-gray-400">· {id}</span>
      </h2>
      {children}
    </section>
  );
}

/**
 * 디자인 견본 — 바로가구의 동작마다 맡은 컴포넌트를 한 화면에 모았다(바로키친 어드민 /more/design 과 같은 자리).
 * 컴포넌트를 고치면 여기서 먼저 보고, 새 컴포넌트도 여기에 넣는다. 동작 목록은 src/lib/design/behaviors.ts.
 */
export default function DesignPage() {
  const [one, setOne] = useState<string | null>("가능");
  const [cards, setCards] = useState<string[]>(["door"]);
  const [many, setMany] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [width, setWidth] = useState("600");
  const [addr, setAddr] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [agree, setAgree] = useState(true);
  const [on, setOn] = useState(true);
  const [qty, setQty] = useState(1);
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const req = useRequired({ name: !!name.trim(), phone: phone.replace(/\D/g, "").length >= 10 || "전화번호를 확인해 주세요" });
  const save = useAction();
  const copy = useCopy();
  const [fold, setFold] = useState(false);
  const fail = useAction();

  return (
    <div className="flex flex-col pb-[140px]">
      <h1 className="px-5 pt-8 text-[22px] font-700 text-gray-900">디자인 견본</h1>
      <p className="px-5 pt-1 text-[14px] text-gray-500">동작마다 컴포넌트 하나 · shadcn</p>

      <Spec id="button" title="버튼">
        <div className="grid grid-cols-2 gap-2">
          <Button>기본</Button>
          <Button variant="secondary">회색</Button>
          <Button variant="outline">테두리</Button>
          <Button variant="inverse">연한 파랑</Button>
          <Button size="md">중간</Button>
          <Button size="md" variant="outline">
            중간 테두리
          </Button>
        </div>
      </Spec>

      <Spec id="action" title="누르는 일(연타 막기·도는 표시·실패는 옆)">
        <Button busy={save.busy} onClick={() => save.run(() => new Promise((r) => setTimeout(r, 1500)))}>
          저장
        </Button>
        <ActionError error={fail.error} />
        <Button variant="outline" busy={fail.busy} onClick={() => fail.run(async () => Promise.reject(new Error("저장하지 못했습니다. 다시 눌러 주세요.")))}>
          실패해 보기
        </Button>
      </Spec>

      <Spec id="field" title="필수값(버튼은 늘 눌림 → 첫 빈 칸으로 이동 + 칸 밑 알림)">
        <Field label="이름" required fieldRef={req.ref("name")} error={req.error("name")}>
          <Input aria-invalid={!!req.error("name")} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="연락처" required fieldRef={req.ref("phone")} error={req.error("phone")}>
          <PhoneInput aria-invalid={!!req.error("phone")} value={phone} onChange={setPhone} />
        </Field>
        <Button onClick={() => req.check() && toast.success("확인했어요")}>다음</Button>
      </Spec>

      <Spec id="text" title="글자 칸 · 여러 줄">
        <Input placeholder="예) 33평형" />
        <Textarea placeholder="요청사항" />
      </Spec>

      <Spec id="number" title="숫자·치수 칸(단위)">
        <NumberInput unit="mm" value={width} onChange={setWidth} aria-label="폭" />
      </Spec>

      <Spec id="phone" title="전화번호 칸">
        <PhoneInput value={phone} onChange={setPhone} />
      </Spec>

      <Spec id="address" title="주소 검색">
        <AddressField value={addr} onPick={setAddr} />
      </Spec>

      <Spec id="datetime" title="날짜 · 시각">
        <DateField value={date} onChange={setDate} />
        <TimeField value={time} onChange={setTime} />
      </Spec>

      <Spec id="choose" title="값 고르기 — 짧은 선택지는 칸">
        <Choose aria-label="주차" value={one} onChange={setOne} options={["가능", "불가", "유료"].map((v) => ({ value: v, label: v }))} />
      </Spec>
      <Spec id="choose-cards" title="값 고르기 — 긴 선택지·설명은 카드(여러 개)">
        <Choose
          multiple
          aria-label="상황"
          value={cards}
          onChange={setCards}
          options={[
            { value: "urgent", label: "현장 급한 수습", emphasized: true, description: "3일 이내 · 15만 원 추가" },
            { value: "partial", label: "부분가구 추가" },
            { value: "door", label: "문짝 교체 또는 설치" },
            { value: "diy", label: "DIY(셀프 주문)", disabled: true },
          ]}
        />
      </Spec>
      <Spec id="pictogram" title="선택지 그림 — 강조할 부분만 파랑(scripts/pictograms)">
        <div className="grid grid-cols-6 gap-3">
          {(Object.keys(PICTOGRAMS) as PictogramName[]).map((n) => (
            <div key={n} className="flex flex-col items-center gap-1 text-[11px] text-gray-400">
              <Pictogram name={n} />
              {n}
            </div>
          ))}
        </div>
      </Spec>
      <Spec id="choose-sheet" title="값 고르기 — 9개 이상은 시트">
        <Choose
          aria-label="색상"
          title="색상"
          value={many}
          onChange={setMany}
          options={["화이트", "아이보리", "그레이", "블랙", "오크", "월넛", "메이플", "체리", "직접 입력"].map((v) => ({ value: v, label: v }))}
        />
      </Spec>

      <Spec id="checkbox" title="체크박스 · 켜기·끄기">
        <div className="flex items-center gap-2">
          <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
          <Label htmlFor="agree" className="text-[16px] text-gray-700">
            개인정보 수집·이용 동의
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox variant="circle" size="large" checked={agree} onCheckedChange={(v) => setAgree(v === true)} aria-label="둥근 체크" />
          <Checkbox variant="ghost" checked={agree} onCheckedChange={(v) => setAgree(v === true)} aria-label="체크만" />
          <Switch checked={on} onCheckedChange={setOn} aria-label="알림" />
        </div>
      </Spec>

      <Spec id="quantity" title="수량 바꾸기">
        <QuantitySelector trashable quantity={qty} onIncrease={() => setQty(qty + 1)} onDecrease={() => setQty(Math.max(1, qty - 1))} onTrash={() => setConfirm(true)} />
      </Spec>

      <Spec id="fileupload" title="사진 고르기">
        <PhotoPick value={files} onChange={setFiles} maxFiles={3} />
      </Spec>

      <Spec id="sheet" title="바텀시트 · 지우기 전 확인">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="md" onClick={() => setSheet(true)}>
            시트 열기
          </Button>
          <Button variant="outline" size="md" onClick={() => setConfirm(true)}>
            확인받기
          </Button>
        </div>
        <Sheet open={sheet} onOpenChange={setSheet} title={"받는 방법을\n골라 주세요"} description="시트 설명 한 줄" footer={<Button className="w-full" onClick={() => setSheet(false)}>확인</Button>}>
          <Choose aria-label="받는 방법" value={one} onChange={setOne} options={["가능", "불가", "유료"].map((v) => ({ value: v, label: v }))} />
        </Sheet>
        <ConfirmSheet
          open={confirm}
          onOpenChange={setConfirm}
          title="장바구니에서 뺄까요?"
          description="되돌릴 수 없어요."
          confirmLabel="빼기"
          destructive
          onConfirm={() => new Promise((r) => setTimeout(r, 800))}
        />
      </Spec>

      <Spec id="toast" title="토스트(성공만)">
        <Button variant="outline" size="md" onClick={() => toast.success("장바구니에 담았어요")}>
          토스트 띄우기
        </Button>
      </Spec>

      <Spec id="load" title="불러오는 중 · 빈 목록 · 읽기 실패">
        <Loading variant="inline" />
        <ListSkeleton rows={2} />
        <EmptyState text="주문 내역이 없어요" action={{ label: "주문하기", onClick: () => undefined }} />
        <ErrorBanner text="주문 내역을 읽지 못했습니다." onRetry={() => undefined} />
      </Spec>

      <Spec id="notice" title="안내·경고 상자">
        <Notice title="주문해도 바로 결제되지 않아요">견적서 받고 직접 송금으로 안전하게 결제해 주세요.</Notice>
        <Notice tone="blue" title="오늘 배송 가능">오후 2시 전 주문</Notice>
        <Notice tone="red" title="로그인하지 못했어요">다시 시도해 주세요.</Notice>
      </Spec>

      <Spec id="statuslabel" title="상태 띠">
        <div className="flex flex-wrap gap-2">
          <Badge>접수됨</Badge>
          <Badge color="green">배송 중</Badge>
          <Badge color="yellow">확인 중</Badge>
          <Badge color="gray">취소</Badge>
          <Badge color="blue" weight="strong">
            오늘 배송
          </Badge>
        </div>
      </Spec>

      <Spec id="viewer" title="사진 크게 보기">
        <PhotoThumbs size="row" photos={[{ src: "/img/banner/Banner1.png", alt: "견본 사진 1" }, { src: "/img/banner/Banner2.png", alt: "견본 사진 2" }]} />
      </Spec>

      <Spec id="accordion" title="접기·펼치기">
        <Collapsible open={fold} onOpenChange={setFold} className="rounded-[12px] border border-border px-4 py-3">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-[16px] font-600 text-gray-800">
            주문 상품 3개
            <ChevronDown className={`size-5 text-gray-400 transition-transform ${fold ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 text-[14px] text-gray-600">문짝 2 · 부분장 1</CollapsibleContent>
        </Collapsible>
      </Spec>

      <Spec id="copy" title="복사 · 전화 걸기">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="md" onClick={() => copy.run("addr", "경기 남양주시 가운로 1")}>
            {copy.copied === "addr" ? "복사됨" : "공장 주소 복사"}
          </Button>
          <Button asChild variant="outline" size="md">
            <a href="tel:0315284002">전화 걸기</a>
          </Button>
        </div>
        {copy.failed && <p className="text-[14px] text-gray-600">{copy.failed}</p>}
      </Spec>

      <Spec id="navrow" title="눌러서 이동">
        <NavRow card label="DIY(셀프 주문)" description="품목을 직접 골라 주문" onClick={() => undefined} />
        <NavRow card label="자재 필요없는 수리" disabled />
        <NavTiles
          items={[
            { key: "lower", label: "하부장", image: "/img/cabinet-category/Lower.png", onClick: () => undefined },
            { key: "upper", label: "상부장", image: "/img/cabinet-category/Upper.png", selected: true, onClick: () => undefined },
          ]}
        />
      </Spec>

      <Spec id="progress" title="단계 진행 막대">
        <div className="relative h-10">
          <ProgressBar progress={60} className="!static" />
        </div>
      </Spec>

      <Spec id="bottombar" title="아래 고정 버튼 칸">
        <div className="-mx-5">
          <BottomBar className="!static" aside={<span className="flex flex-col"><span className="text-[17px] font-600 text-gray-700">합계 120,000원</span><span className="text-[14px] text-gray-400">배송비 별도</span></span>}>
            <Button>장바구니 담기</Button>
          </BottomBar>
        </div>
      </Spec>

      <BottomBar>
        <Button variant="secondary">이전</Button>
        <Button>다음</Button>
      </BottomBar>
    </div>
  );
}
