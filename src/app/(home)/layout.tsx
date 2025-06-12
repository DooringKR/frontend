"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Header from "@/components/BeforeEditByKi/Header";

const NAV_ITEMS = [
  { href: "/", label: "홈", key: "home" },
  { href: "/cart", label: "장바구니", key: "Shopping_Cart" },
  { href: "/mypage", label: "마이페이지", key: "user" },
];

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen pb-20">
      {/* <Header /> */}
      {children}

      <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white text-sm font-semibold">
        <nav className="flex h-[68px] items-center justify-around px-4">
          {NAV_ITEMS.map(({ href, label, key }) => {
            const isActive = pathname === href;
            const iconSrc = `/icons/${key}-${isActive ? "active" : "inactive"}.svg`;
            const textColor = isActive ? "#2c2c2c" : "#757575";

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center justify-center gap-2"
                style={{ color: textColor }}
              >
                <Image src={iconSrc} width={24} height={24} alt={label} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}

export default Layout;
