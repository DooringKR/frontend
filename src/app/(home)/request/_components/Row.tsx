/** 「이름 | 값」 한 줄 — 주문 확인 화면과 주문 내역 상세(상황 주문)가 같이 쓴다 */
export default function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2 text-[15px]">
      {/* 이름 칸은 가장 긴 이름(「문짝 교체 · 설치」 93px)이 한 줄에 들어가게 */}
      <div className="w-24 shrink-0 text-gray-500">{label}</div>
      <div className="min-w-0 flex-1 whitespace-pre-line text-gray-800">{children}</div>
    </div>
  );
}
