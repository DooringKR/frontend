"use client";

import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

import Choose from "@/components/form/Choose";
import NavRow from "@/components/nav/NavRow";
import Pictogram from "@/components/pictogram/Pictogram";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { useRequestStore } from "../_lib/requestStore";
import { trackRequest } from "../_lib/track";
import ButtonPictos from "./ButtonPictos";
import { DIY_DISCOUNT, manwon, SITUATIONS, type SituationSlug, URGENT_FEE, URGENT_NAME, URGENT_WHEN_SHORT } from "../_lib/situations";

/** 금액 칩 — 더하면 빨강, 빼면 파랑(QA 「선택지별 추가금액 시나리오」 2026-11-15). 크기는 바로배송 칩과 같다 */
const money = "px-1 text-[12px]/[18px]";

/**
 * 상황 고르기(화면 1) — 상황 입력 첫 장과 홈(QA 「랜딩페이지단계에서 첫 화면(상황입력)이 나오게」 2026-11-15)이 같이 쓴다.
 * 고른 값은 상황 주문 저장소에 바로 남아서, 홈에서 고르고 주문하기를 누르면 그대로 이어진다. 부모가 세로 간격(gap)을 정한다.
 *  - 바로배송: 강조. 어느 묶음과도 같이 고른다.
 *  - 문짝 교체 · 설치 · 가구 추가 · 가구 교체: 서로 같이 고른다. 고르면 다음 장에서 고를 품목이 그림으로 미리 보인다.
 *  - DIY · 자재 필요없는 수리: 상황을 하나라도 고르면 막힌다. 누르면 바로 그 화면으로.
 */
export default function SituationPicker({ invalid }: { invalid?: boolean }) {
  const router = useRouter();
  const s = useRequestStore();
  const anyPicked = s.situations.length > 0;
  return (
    <>
      <Choose
        multiple
        aria-label={URGENT_NAME}
        value={s.urgent ? ["urgent"] : []}
        onChange={v => s.set({ urgent: v.includes("urgent") })}
        options={[
          {
            value: "urgent",
            label: URGENT_NAME,
            emphasized: true,
            image: <Pictogram name="urgent" />,
            // 조건 칩은 이름 옆(2026-11-15 사용자) — 시간은 옅은 파랑 + 시계, 금액은 꽉 찬 빨강으로 종류가 갈리게
            badge: (
              <span className="inline-flex flex-wrap gap-1 align-middle">
                <Badge color="blue" weight="weak" className="gap-0.5 px-1 text-[12px]/[18px]">
                  <Clock className="size-3" strokeWidth={2.5} />
                  {URGENT_WHEN_SHORT}
                </Badge>
                <Badge color="red" weight="strong" className={money}>
                  +{manwon(URGENT_FEE)}
                </Badge>
              </span>
            ),
            description: <>오늘 바로 시공이 필요하세요? {URGENT_NAME} 서비스를 선택해보세요</>,
          },
        ]}
      />
      <Separator className="bg-gray-100" />
      <Choose<SituationSlug>
        multiple
        aria-label="상황"
        aria-invalid={invalid}
        value={s.situations}
        onChange={v => s.set({ situations: v })}
        // 고르면 다음 장에서 고를 품목이 미리 보인다(QA 「표현 변경」 펼침, 2026-11-15 사용자 「A, 글 없이 띄워만」) — 고르기는 다음 장
        options={SITUATIONS.map(x => ({
          value: x.slug,
          label: x.name,
          image: <Pictogram name={x.pictogram} />,
          badge: x.fee ? (
            <Badge color="red" weight="strong" className={money}>
              +{manwon(x.fee)}
            </Badge>
          ) : undefined,
          description: x.subtitle,
          // 글 이름표는 오히려 읽기 어려워 픽토그램 + 밑에 이름(2026-11-15 사용자), 카드 폭 전체에 네 칸씩(QA 「4열로」)
          extra: s.situations.includes(x.slug) ? <ButtonPictos slug={x.slug} buttons={x.buttons} /> : undefined,
        }))}
      />
      <Separator className="bg-gray-100" />
      <NavRow
        card
        label={
          <>
            DIY(셀프 주문)
            <Badge color="blue" weight="strong" className={cn(money, "ml-1.5 align-middle", anyPicked && "opacity-40")}>
              −{manwon(DIY_DISCOUNT)}
            </Badge>
          </>
        }
        icon={<Pictogram name="diy" />}
        disabled={anyPicked}
        onClick={() => {
          trackRequest("Branch Chosen", { branch: "diy" });
          router.push("/diy");
        }}
      />
      <NavRow
        card
        label="자재 필요없는 수리"
        icon={<Pictogram name="repair" />}
        disabled={anyPicked}
        onClick={() => {
          trackRequest("Branch Chosen", { branch: "repair" });
          router.push("/request/not-served");
        }}
      />
    </>
  );
}
