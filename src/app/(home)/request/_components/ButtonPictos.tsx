import Pictogram from "@/components/pictogram/Pictogram";
import { cn } from "@/lib/utils";

import { BUTTON_SHORT, pictogramOf, type SituationSlug } from "../_lib/situations";

/**
 * 품목 그림 칸 — 그림 위·이름 아래, 네 칸씩 카드 폭 전체(QA 「아래 썸네일 픽토그램 형식 4열로」 2026-11-15, 「왼쪽 끝부터 오른쪽 끝까지」).
 * 첫 장 미리보기와 설명 장의 고른 가구가 같이 쓴다. 치수는 있는 규칙: 그림 32(Pictogram 기본), 이름 12/16·간격 4(단계 줄 이름), 칸 사이 8(Choose).
 * 이름은 띄어쓰기에서만 줄을 바꾼다(「주방 / 상하부장」). 칸 폭에 안 들어가는 낱말만 짧은 이름(BUTTON_SHORT). 카드(버튼) 안에도 들어가서 span 으로.
 */
export default function ButtonPictos({ slug, buttons, className }: { slug: SituationSlug; buttons: string[]; className?: string }) {
  return (
    <span className={cn("grid w-full grid-cols-4 gap-2", className)}>
      {buttons.map(b => (
        <span key={b} className="flex flex-col items-center gap-1">
          <Pictogram name={pictogramOf(slug, b)} />
          <span className="break-keep text-center text-[12px] leading-4 font-500 text-gray-700">{BUTTON_SHORT[b] ?? b}</span>
        </span>
      ))}
    </span>
  );
}
