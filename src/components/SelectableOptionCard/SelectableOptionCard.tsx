"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * 켜고 끄는 옵션 카드(체크박스 동작의 카드 모양) — 머리 줄(그림·이름·띠·설명·체크)을 누르면 켜지고 꺼진다.
 * 켜면 아래에 그 옵션의 칸(expandableContent)이 펼쳐진다. 펼친 칸 안을 눌러도 카드가 꺼지지 않는다(예전 버그).
 */
export default function SelectableOptionCard({
  title,
  description,
  showImage = false,
  imageUrl,
  showChip = false,
  chipText,
  chipColor = "yellow",
  showExpandableContent = false,
  expandableContent,
  checked,
  onChange,
  className = "",
}: {
  title: string;
  description?: string;
  showImage?: boolean;
  imageUrl?: string;
  showChip?: boolean;
  chipText?: string;
  chipColor?: "blue" | "yellow" | "green" | "gray";
  showExpandableContent?: boolean;
  expandableContent?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 self-stretch bg-background px-4 pb-4 pt-2", className)}>
      <label className="flex cursor-pointer items-center gap-2 self-stretch rounded-[12px] transition-colors hover:bg-muted">
        {showImage && imageUrl && <Image src={imageUrl} alt={title} width={56} height={56} className="size-14 rounded-lg object-cover" />}
        <span className="flex flex-1 flex-col">
          <span className="flex items-center gap-1 text-[16px]/5 font-700 text-gray-700">
            {title}
            {showChip && chipText && <Badge color={chipColor}>{chipText}</Badge>}
          </span>
          {description && <span className="text-[14px]/5 text-gray-500">{description}</span>}
        </span>
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} aria-label={title} />
      </label>
      {showExpandableContent && checked && expandableContent && <div className="flex flex-col self-stretch">{expandableContent}</div>}
    </div>
  );
}
