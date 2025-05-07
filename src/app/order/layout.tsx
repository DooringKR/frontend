import BackButton from "@/app/order/_components/BackButton";
import Image from "next/image";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex items-center justify-between px-5 pt-9">
        <BackButton />
        <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
