import Image from "next/image";

import BackButton from "./BackButton/BackButton";

interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-9">
      <BackButton />
      {title && <h1 className="text-2xl">{title}</h1>}
      <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
    </header>
  );
}

export default Header;
