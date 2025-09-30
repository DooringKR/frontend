"use client";

import { useRouter } from "next/navigation";

interface ReceiveOptionBarProps {
  icon: string;
  alt: string;
  title: string;
  bottomBarClassName?: string;
  children?: React.ReactNode;
}

export default function ReceiveOptionBar({
  icon,
  alt,
  title,
  bottomBarClassName,
  children,
}: ReceiveOptionBarProps) {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex gap-2">
          <img src={icon} alt={alt} className="h-6 w-6" />
          <h1 className="text-[17px] font-600">{title}</h1>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[15px] font-500 text-blue-500"
        >
          변경
        </button>
      </div>
      {children && <div className="mx-5">{children}</div>}
      <div className={`h-4 bg-gray-100 ${bottomBarClassName}`}></div>
    </div>
  );
}
