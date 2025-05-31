import Image from "next/image";
interface HeaderProps {
  title?: string;
  subtitle?: string;
  size?: "Large" | "Medium"; // size prop 추가
}

function Header1({ title, subtitle, size = "Medium" }: HeaderProps) {
  const titleClass = size === "Large" ? "text-[26px] font-bold" : "text-[23px]"; // 크기별 클래스 설정

  return (
    <header className="flex flex-col items-start px-[20px] pt-[20px] gap-[8px]">
      <h1 className={`${titleClass} text-left`}>{title}</h1>
      <h2 className="text-[17px] text-gray-500 font-normal">{subtitle}</h2>
    </header>
  );
}

export default Header1;
