// /customer-service/license/[slug]/page.tsx
import { LICENSE_CONTENTS } from "@/constants/licenseContents";
import { LICENSE_PAGE } from "@/constants/pageName";
import { notFound } from "next/navigation";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { LICENSE_LIST } from "../page";

type Params = {
  params: {
    slug: string;
  };
};

export default function LicenseDetailPage({ params }: Params) {
  const { slug } = params;
  const content = LICENSE_CONTENTS[slug];
  const license = LICENSE_LIST.find(item => item.slug === slug);

  if (!content || !license) return notFound();

  return (
    <div className="whitespace-pre-line text-[17px] font-400 leading-relaxed text-gray-500">
      <TopNavigator title={license.name} page={LICENSE_PAGE} />
      {content}
    </div>
  );
}
