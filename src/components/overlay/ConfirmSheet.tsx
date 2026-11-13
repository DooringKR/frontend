"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionError, useAction } from "@/components/ui/use-action";

import Sheet from "./Sheet";

/**
 * 확인받기 — 되돌릴 수 없는 일(지우기·취소·로그아웃 등)은 시트로 한 번 묻는다. 바로키친 어드민 ConfirmSheet 와 같은 규칙.
 * 확인을 누르면 도는 동안 막고, 실패하면 시트 안(버튼 위)에 알린다. 성공하면 닫는다.
 * confirmText = 그 글을 그대로 쳐야 확인이 눌린다(탈퇴처럼 되돌릴 수 없는 큰 일 — 필수값 규칙의 예외).
 */
export default function ConfirmSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  destructive = false,
  confirmText,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  confirmText?: string;
  /** 설명 밑 본문(안내 줄·링크 등) */
  children?: React.ReactNode;
  onConfirm: () => Promise<unknown> | unknown;
}) {
  const act = useAction();
  const [typed, setTyped] = useState("");
  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          act.clear();
          setTyped("");
        }
        onOpenChange(o);
      }}
      title={title}
      description={description}
      bodyClassName="px-5"
      dismissible={!act.busy}
      footer={
        <div className="flex w-full flex-col gap-3">
          <ActionError error={act.error} />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)} disabled={act.busy}>
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? "destructive" : "default"}
              className="flex-1"
              busy={act.busy}
              disabled={!!confirmText && typed.trim() !== confirmText}
              onClick={() =>
                act.run(async () => {
                  await onConfirm();
                  onOpenChange(false);
                })
              }
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      }
    >
      {children}
      {confirmText && (
        <Input placeholder={confirmText} value={typed} onChange={(e) => setTyped(e.target.value)} aria-label={`${confirmText} 입력`} />
      )}
    </Sheet>
  );
}

/**
 * 확인받기를 한 줄로 — `const confirm = useConfirm()` → `confirm.ask("…지울까요?", run, { confirmLabel })`, 화면에 `{confirm.sheet}`.
 * 넣은 값을 지우는 일(모름·공통값 사용·문 수 줄이기·종류 다시 고르기)처럼 묻는 문구만 바뀌는 곳에 쓴다(문 화면에서 올림).
 */
export function useConfirm() {
  const [s, setS] = useState<{ open: boolean; title: string; description?: string; confirmLabel?: string; run: () => unknown }>({
    open: false,
    title: "",
    run: () => undefined,
  });
  return {
    ask: (title: string, run: () => unknown, opts?: { description?: string; confirmLabel?: string }) =>
      setS({ open: true, title, run, description: opts?.description, confirmLabel: opts?.confirmLabel }),
    sheet: (
      <ConfirmSheet
        open={s.open}
        onOpenChange={(open) => setS((p) => ({ ...p, open }))}
        title={s.title}
        description={s.description}
        confirmLabel={s.confirmLabel ?? "지우기"}
        destructive
        onConfirm={s.run}
      />
    ),
  };
}
