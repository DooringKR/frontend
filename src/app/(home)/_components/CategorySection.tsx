"use client";

import { CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Card from "@/components/Card/Card";

import useCartStore from "@/store/cartStore";

export default function CategorySection() {
  const router = useRouter();
  const { cartItems } = useCartStore();

  const handleCategoryClick = (category: string) => {
    if (cartItems.length === 0) {
      router.push(`/address-check?category=${category}`);
    } else {
      router.push(`/order/${category}`);
    }
  };

  return (
    <section className="grid grid-cols-2 gap-2">
      {CATEGORY_LIST.map(item => (
        <Card key={item.name} title={item.name} onClick={() => handleCategoryClick(item.name)} />
      ))}

      {/* 찾는게 없어요 */}
      <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[10px] border bg-white text-center">
        <Image src="/icons/Headphones.svg" width={48} height={48} alt="찾는 게 없어요 아이콘" />
        <p className="text-base font-medium">찾는 게 없어요.</p>
        <Link href="/" className="text-[11px] font-normal leading-[13px] tracking-[0.06px]">
          카톡으로 직접 주문하기 &gt;
        </Link>
      </div>
    </section>
  );
}
