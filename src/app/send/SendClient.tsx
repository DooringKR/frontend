"use client";

import Footer from "@/app/(home)/_components/Footer";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import { Button } from "@/components/ui/button";
import { kakaopaySendUrl, tossSendUrl, TRANSFER_BANK } from "@/lib/transfer";
import { useCopy } from "@/lib/use-copy";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 text-[16px]">
      <div className="w-16 shrink-0 text-gray-500">{label}</div>
      <div className="min-w-0 flex-1 text-right text-gray-800">{children}</div>
    </div>
  );
}

/** 금액·계좌, 계좌번호 복사, 아래에 송금 앱 두 개 — 앱이 안 열려도 복사로 보낼 수 있다 */
export default function SendClient({ amount }: { amount: number | null }) {
  const copy = useCopy();
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="입금 안내" subtitle="아래 계좌로 보내 주세요" />
      <div className="mx-5 mt-6 flex flex-col divide-y divide-gray-100">
        {amount && (
          <Row label="금액">
            <span className="font-700">{won(amount)}</span>
          </Row>
        )}
        <Row label="은행">{TRANSFER_BANK.bank}</Row>
        <Row label="계좌">{TRANSFER_BANK.number}</Row>
        <Row label="예금주">{TRANSFER_BANK.holder}</Row>
      </div>
      <Button
        variant="outline"
        className="mx-5 mt-3"
        onClick={() => void copy.run("account", TRANSFER_BANK.number.replace(/\D/g, ""))}
      >
        {copy.copied === "account" ? "복사됨" : "계좌번호 복사"}
      </Button>
      {copy.failed && <p className="mx-5 mt-2 text-[14px] text-gray-500">복사하지 못했어요. {copy.failed} 를 길게 눌러 복사해 주세요</p>}
      <div className="mt-auto pt-10">
        <Footer />
      </div>
      <BottomBar>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild>
            <a href={tossSendUrl(amount)}>토스로 보내기</a>
          </Button>
          <Button asChild variant="kakao">
            <a href={kakaopaySendUrl(amount)}>카카오페이로 보내기</a>
          </Button>
        </div>
      </BottomBar>
    </div>
  );
}
