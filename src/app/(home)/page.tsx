import { CATEGORY_LIST } from "@/constants/category";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import Card from "@/components/Card/Card";

import DeliveryTimer from "./_components/DeliveryTimer";

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  const user = null;

  return (
    <div className="mx-5 flex flex-col gap-4 py-9">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">
            {user ? "돌아오신 것을 환영해요!" : "믿고 주문하는"}
          </h1>
          <p className="text-base font-semibold">도어링 A/S 자재 배송</p>
        </div>
        <Image src="/icons/Headphones.svg" width={24} height={24} alt="문의하기 버튼" />
      </div>
      <DeliveryTimer user={user} />
      <section className="grid grid-cols-2 gap-2">
        {CATEGORY_LIST.map(item => (
          <Card key={item.name} title={item.name} href={item.href} />
        ))}
        <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[10px] border bg-white text-center">
          <Image src="/icons/Headphones.svg" width={48} height={48} alt="찾는 게 없어요 아이콘" />
          <p className="text-base font-medium">찾는 게 없어요.</p>
          <Link href="/" className="text-[11px] font-normal leading-[13px] tracking-[0.06px]">
            카톡으로 직접 주문하기 &gt;
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Page;
