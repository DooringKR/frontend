import Image from "next/image";

interface HeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: "Large" | "Medium"; // size prop 추가
}

function Header({ title, subtitle, size = "Large" }: HeaderProps) {
  const titleClass = size === "Large" ? "text-[26px] font-bold" : "text-[23px] font-700"; // 크기별 클래스 설정

  return (
    <header className="flex flex-col items-start gap-[8px] px-[20px] pt-[20px]">
      <h1 className={`${titleClass} text-left`}>{title}</h1>
      <h2 className="text-[17px] font-normal text-gray-500">{subtitle}</h2>
    </header>
  );
}

export default Header;
