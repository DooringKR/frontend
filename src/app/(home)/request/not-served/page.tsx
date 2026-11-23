"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import { TYPE_MESSAGE, useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ActionError, useAction } from "@/components/ui/use-action";
import useBizClientStore from "@/store/bizClientStore";
import { setAfterLogin } from "@/utils/afterLogin";

import { useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";
import { NotLoggedIn, photoUrlOf, sendRepairInquiry, uploadPhotos } from "../_lib/submit";

/**
 * 가구 단순 수리 — 상황 접수(노션 QA 「단계별 가구 종류 및 시나리오 수정」 2026-11-15, 사용자 「받은 내용은 폼으로 저장해서 어드민에서 모아 보게」).
 * 글·사진을 남기면 SituationOrder(kind = repair_inquiry)에 쌓이고, 관리자가 어드민 「가구 단순 수리 문의」에서 보고 전화로 답한다.
 *  - 문구는 QA 원문 그대로(제목 = 안내 문장, 아래 = ※ 줄), 칸은 상황 주문 설명 장과 같은 「참고 사진 (선택)」·「상황 설명」
 *  - 상황 주문처럼 로그인해야 보낸다 — 연락처는 가입 정보. 글·사진은 기기에 남아 로그인하고 돌아와도 그대로
 *  - 글은 필수, 사진은 선택
 */
export default function RepairInquiryPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const loggedIn = !!useBizClientStore((b) => b.bizClient);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string>();
  const [sent, setSent] = useState(false);
  const send = useAction({ holdOnSuccess: true });
  const req = useRequired({ note: !!s.repairNote.trim() || TYPE_MESSAGE });

  const addPhotos = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    setPhotoError(undefined);
    try {
      const paths = await uploadPhotos(files);
      s.set({ repairPhotos: [...useRequestStore.getState().repairPhotos, ...paths] });
    } catch (e) {
      console.error("[repair] 사진 올리기 실패", e);
      setPhotoError("사진을 올리지 못했어요. 다시 골라 주세요");
    } finally {
      setUploading(false);
    }
  };

  const toLogin = () => {
    setAfterLogin("/request/not-served");
    router.push("/start");
  };

  const submit = () => {
    if (!req.check()) return;
    return send.run(async () => {
      if (!loggedIn) return toLogin();
      try {
        await sendRepairInquiry(s.repairNote.trim(), s.repairPhotos, s.urgent);
      } catch (e) {
        if (e instanceof NotLoggedIn) return toLogin();
        throw e;
      }
      s.set({ repairNote: "", repairPhotos: [] });
      setSent(true);
    });
  };

  if (sent)
    return (
      <div className="flex flex-col pt-[60px]">
        <TopNavigator />
        <Header title="접수됐어요" subtitle="확인 후 가능 여부를 답변 드릴게요" />
        <BottomBar>
          <Button onClick={() => router.replace("/")}>홈으로</Button>
        </BottomBar>
      </div>
    );

  return (
    <div className="flex flex-col pt-[60px] pb-[140px]">
      <TopNavigator />
      <Header title="수리가 필요한 상황을 적어주시면, 확인 후 가능 여부를 답변 드릴게요" subtitle="※ 현재 기준 양 이하의 작은 수리 작업은 불가할 수 있어요." />
      <div className="flex flex-col gap-5 px-5 pt-8">
        {/* 상황 주문 설명 장과 같게 — 참고 사진(선택)과 상황 설명(필수)을 나눈다(2026-11-15 사용자) */}
        <Field label="참고 사진 (선택)" error={photoError}>
          <PhotoPick
            value={[]}
            maxFiles={5}
            busy={uploading}
            uploaded={s.repairPhotos.map((p, n) => ({ src: photoUrlOf(p), name: `수리 사진 ${n + 1}` }))}
            onRemoveUploaded={(n) => s.set({ repairPhotos: s.repairPhotos.filter((_, k) => k !== n) })}
            onChange={(files) => void addPhotos(files)}
          />
        </Field>
        <Field label="상황 설명" required fieldRef={req.ref("note")} error={req.error("note")}>
          <Textarea
            aria-invalid={!!req.error("note") || undefined}
            placeholder="예) 서랍 레일이 고장났어요"
            value={hydrated ? s.repairNote : ""}
            onChange={(e) => s.set({ repairNote: e.target.value })}
          />
        </Field>
      </div>
      <BottomBar top={<ActionError error={send.error} className="mb-3" />}>
        <Button busy={send.busy} onClick={submit}>
          {loggedIn ? "접수하기" : "로그인하고 접수하기"}
        </Button>
      </BottomBar>
    </div>
  );
}
