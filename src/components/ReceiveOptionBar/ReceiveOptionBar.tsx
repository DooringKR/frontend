"use client";

import { Button } from "@/components/ui/button";

interface ReceiveOptionBarProps {
  icon: string;
  alt: string;
  title: string;
  /** 「변경」 — 받는 방법 화면으로 돌아가기(넣어 둔 값을 지킬지는 화면이 정한다) */
  onChange: () => void;
  bottomBarClassName?: string;
  children?: React.ReactNode;
}

/** 주문 화면 맨 위 — 고른 받는 방법(배송·직접 픽업)과 「변경」 */
export default function ReceiveOptionBar({ icon, alt, title, onChange, bottomBarClassName, children }: ReceiveOptionBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon} alt={alt} className="h-6 w-6" />
          <h1 className="text-[17px] font-600">{title}</h1>
        </div>
        <Button variant="link" size="sm" onClick={onChange}>
          변경
        </Button>
      </div>
      {children && <div className="mx-5">{children}</div>}
      <div className={`h-4 bg-gray-100 ${bottomBarClassName ?? ""}`}></div>
    </div>
  );
}
