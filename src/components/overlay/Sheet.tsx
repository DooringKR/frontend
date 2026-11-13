"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

/**
 * 바텀시트 — 옛 BottomSheet·Modal 을 하나로(shadcn Drawer). 바로키친 어드민 BottomSheetFrame 과 같은 자리.
 * 제목(줄바꿈 \n 그대로)·설명·본문·아래 버튼 칸(footer)·머리 오른쪽 글 버튼(headerAction).
 * 밖을 누르거나 아래로 끌면 닫힌다. 겹쳐 띄우기는 확인(ConfirmSheet)뿐.
 */
export default function Sheet({
  open,
  onOpenChange,
  title,
  description,
  headerAction,
  footer,
  children,
  bodyClassName = "px-5",
  dismissible = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  headerAction?: { label: string; onClick: () => void };
  footer?: React.ReactNode;
  children?: React.ReactNode;
  bodyClassName?: string;
  /** false 면 끌거나 바깥을 눌러도 안 닫힌다(처리 중) */
  dismissible?: boolean;
}) {
  return (
    <Drawer open={open} onOpenChange={(o) => (o || dismissible) && onOpenChange(o)} dismissible={dismissible}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex w-full items-center justify-between gap-3">
            <DrawerTitle>{title}</DrawerTitle>
            {headerAction && (
              <button type="button" onClick={headerAction.onClick} className="shrink-0 text-[15px]/[22px] font-500 text-gray-400">
                {headerAction.label}
              </button>
            )}
          </div>
          {description ? (
            typeof description === "string" ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : (
              // 목록 등 블록 — p 안에 넣지 않는다
              <DrawerDescription asChild>
                <div>{description}</div>
              </DrawerDescription>
            )
          ) : (
            <DrawerDescription className="sr-only">{title}</DrawerDescription>
          )}
        </DrawerHeader>
        {children && <div className={`flex-1 overflow-y-auto pt-5 ${bodyClassName}`}>{children}</div>}
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : <div className="h-5" />}
      </DrawerContent>
    </Drawer>
  );
}
