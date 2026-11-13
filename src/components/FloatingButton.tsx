import Link from "next/link";
import SalesmanIcon from "public/icons/Salesman";

/** 넓은 화면(1024 이상)에서만 본문 오른쪽 바깥에 떠 있는 「문의하기」(좁은 화면은 홈 푸터의 고객센터 링크). */
export default function FloatingButton() {
  return (
    <Link
      href="/customer-service"
      className="fixed bottom-10 z-50 hidden items-center gap-2 rounded-[12px] bg-white px-4 py-[10px] [@media(min-width:1024px)]:flex"
      style={{
        boxShadow: "0 0 20px 0 rgba(3, 7, 18, 0.10)",
        right: "calc(50% - 230px - 245px)", // 메인화면 오른쪽 바깥에서 40px 떨어진 위치
      }}
    >
      <SalesmanIcon />
      <span className="text-[17px]/[24px] font-600 text-gray-500">바로가구에 문의하기</span>
    </Link>
  );
}
