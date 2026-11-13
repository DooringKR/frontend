"use client";

import { useCallback, useRef, useState } from "react";

/**
 * 누르는 일(주문하기·저장·보내기·지우기) 한 묶음 — 바로키친 어드민 ui/useAction 과 같은 규칙.
 * 도는 동안 막고(빠른 연타도 ref 로), 실패하면 알림 글을 들고 있는다. 알림은 ActionError 로 누른 자리 옆에 둔다.
 *
 *   const send = useAction();
 *   <Button busy={send.busy} onClick={() => send.run(async () => { … })}>주문하기</Button>
 *   <ActionError error={send.error} />
 *
 * holdOnSuccess: 성공 뒤 다른 화면으로 넘어가는 일 — 넘어가는 동안 다시 눌러 두 번 하지 않게 계속 막아 둔다.
 */
export function useAction({ holdOnSuccess = false }: { holdOnSuccess?: boolean } = {}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const running = useRef(false);

  const run = useCallback(
    async (fn: () => Promise<unknown>): Promise<boolean> => {
      if (running.current) return false;
      running.current = true;
      setBusy(true);
      setError(null);
      let ok = false;
      try {
        await fn();
        ok = true;
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        return false;
      } finally {
        if (!(ok && holdOnSuccess)) {
          running.current = false;
          setBusy(false);
        }
      }
    },
    [holdOnSuccess],
  );

  const clear = useCallback(() => setError(null), []);
  return { busy, error, run, clear, setError };
}

/** 누른 일이 실패했을 때 — 버튼 바로 위·아래에 둔다 */
export function ActionError({ error, className }: { error?: string | null; className?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className={`text-[14px] text-destructive ${className ?? ""}`}>
      {error}
    </p>
  );
}
