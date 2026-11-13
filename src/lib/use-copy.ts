"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * 복사 — 바로키친 어드민 useCopy 와 같은 규칙. 누른 버튼만 「복사됨」(copied 가 그 열쇠), 성공은 토스트.
 * 복사가 막히면(권한·http) 실패를 숨기지 않고 failed 에 글을 남긴다 — 화면은 그 글을 보여 주어 손으로 복사하게 한다.
 *
 *   const copy = useCopy();
 *   <Button onClick={() => copy.run("factory", ADDRESS)}>{copy.copied === "factory" ? "복사됨" : "주소 복사"}</Button>
 *   {copy.failed && <p>{copy.failed}</p>}
 */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  /** 복사했으면 true */
  const run = useCallback(async (key: string, text: string): Promise<boolean> => {
    setFailed(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success("복사했어요");
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
      return true;
    } catch {
      setFailed(text);
      return false;
    }
  }, []);
  return { copied, failed, run };
}
