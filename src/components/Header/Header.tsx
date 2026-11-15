import Image from "next/image";

interface HeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: "Large" | "Medium"; // size prop 추가
  /** 제목 줄 오른쪽(상황 주문 — 고를 곳이 비었다는 알림) */
  aside?: React.ReactNode;
}

function Header({ title, subtitle, size = "Large", aside }: HeaderProps) {
  const titleClass = size === "Large" ? "text-[26px] font-bold" : "text-[23px] font-700"; // 크기별 클래스 설정

  return (
    <header className="flex flex-col items-start gap-[8px] px-[20px] pt-[20px]">
      <div className="flex w-full items-baseline justify-between gap-2">
        <h1 className={`${titleClass} text-left`}>{title}</h1>
        {aside}
      </div>
      <h2 className="text-[17px] font-normal text-gray-500">{subtitle}</h2>
    </header>
  );
}

export default Header;
