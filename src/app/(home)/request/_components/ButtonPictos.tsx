import Pictogram from "@/components/pictogram/Pictogram";
import { cn } from "@/lib/utils";

import { BUTTON_PICTOGRAM, BUTTON_SHORT } from "../_lib/situations";

/**
 * 품목 그림 칸 — 그림 위·이름 아래, 네 칸씩 카드 폭 전체(QA 「아래 썸네일 픽토그램 형식 4열로」 2026-11-15, 「왼쪽 끝부터 오른쪽 끝까지」).
 * 첫 장 미리보기와 자세히 장의 고른 가구가 같이 쓴다. 치수는 있는 규칙: 그림 32(Pictogram 기본), 이름 12/16·간격 4(단계 줄 이름), 칸 사이 8(Choose).
 * 이름은 짧게(BUTTON_SHORT), 줄 바꾸지 않는다(가장 긴 「식기세척기장」이 칸 폭과 거의 같다). 카드(버튼) 안에도 들어가서 span 으로.
 */
export default function ButtonPictos({ buttons, className }: { buttons: string[]; className?: string }) {
  return (
    <span className={cn("grid w-full grid-cols-4 gap-2", className)}>
      {buttons.map(b => (
        <span key={b} className="flex flex-col items-center gap-1">
          <Pictogram name={BUTTON_PICTOGRAM[b]} />
          <span className="whitespace-nowrap text-[12px] leading-4 font-500 text-gray-700">{BUTTON_SHORT[b] ?? b}</span>
        </span>
      ))}
    </span>
  );
}
