"use client";

import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";

import Card from "@/components/Card/Card";

function CategorySection() {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/order/cabinet/color?slug=${slug}`);
  };

  return (
    <section className="grid grid-cols-2 gap-2">
      {CABINET_CATEGORY_LIST.map(item => (
        <Card
          image={item.image}
          key={item.name}
          title={item.name}
          onClick={() => handleCategoryClick(item.slug)}
        />
      ))}
    </section>
  );
}
export default CategorySection;
