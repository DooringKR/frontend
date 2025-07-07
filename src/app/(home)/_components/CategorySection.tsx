"use client";

import { CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Card from "@/components/Card/Card";

import useCartStore from "@/store/cartStore";

function CategorySection() {
  const router = useRouter();
  const { cartItems } = useCartStore();

  const handleCategoryClick = (slug: string) => {
    router.push(`/order?type=${slug}`);
    // const addressStorage = localStorage.getItem("address-storage");

    // if (!addressStorage) {
    //   router.push(`/address-check?category=${slug}`);
    // } else {
    //   router.push(`/order?category=${slug}`);
    // }
  };

  return (
    <section className="grid grid-cols-2 gap-2">
      {CATEGORY_LIST.map(item => (
        <Card
          key={item.name}
          image={item.image}
          title={item.name}
          onClick={() => handleCategoryClick(item.slug)}
        />
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
export default CategorySection;
