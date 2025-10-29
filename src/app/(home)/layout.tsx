"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useBizClientStore from "@/store/bizClientStore";
import { setAmplitudeUserId, setAmplitudeUserProperties } from "@/services/analytics/amplitude";
import { supabase } from "@/lib/supabase";
import { formatBusinessTypeToEnglish } from "@/utils/formatBusinessType";

// const NAV_ITEMS = [
//   { href: "/", label: "홈", key: "home" },
//   { href: "/cart", label: "장바구니", key: "Shopping_Cart" },
//   { href: "/mypage", label: "마이페이지", key: "user" },
// ];

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const bizClient = useBizClientStore((state) => state.bizClient);

  // bizClient가 로드되면 Amplitude User ID 및 Properties 설정
  useEffect(() => {
    const setUserInfo = async () => {
      if (bizClient?.id) {
        // User ID 설정
        setAmplitudeUserId(bizClient.id);
        
        // Supabase에서 provider 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        const provider = user?.app_metadata?.provider 
          || user?.identities?.[0]?.provider 
          || 'unknown';
        
        // User Properties 설정
        setAmplitudeUserProperties({
          business_type: formatBusinessTypeToEnglish(bizClient.business_type),
          providers: provider,
        });
      }
    };
    
    setUserInfo();
  }, [bizClient?.id, bizClient?.business_type]);

  return (
    <div>
      {/* <Header /> */}
      {children}

      {/* <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white text-sm font-semibold">
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
      </footer> */}
    </div>
  );
}

export default Layout;
