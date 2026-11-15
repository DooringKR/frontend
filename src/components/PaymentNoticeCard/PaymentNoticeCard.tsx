import Notice from "@/components/state/Notice";

/**
 * 결제 안내 — 홈·리포트·장바구니·주문 확인이 같은 문구 하나를 쓴다(예전엔 홈 판이 따로 있어 문구가 달랐다).
 */
export default function PaymentNoticeCard({ className }: { className?: string }) {
    return (
        <Notice tone="blue" title="지금 주문해도 바로 결제되지 않아요" className={className}>
            {/* 「확인 이후」 빨간 굵은 글(QA 「단계별 가구 종류 및 시나리오 수정」 2026-11-15) */}
            담당 직원이 통화 후 견적서를 따로 보내드려요. 결제는 견적서 <b className="font-700 text-destructive">확인 이후</b> 진행해주세요.
        </Notice>
    );
}
