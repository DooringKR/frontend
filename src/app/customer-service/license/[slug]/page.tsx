// /customer-service/license/[slug]/page.tsx
import { LICENSE_CONTENTS } from "@/constants/license/licenseContents";
import { LICENSE_LIST } from "@/constants/license/licenseData";
import { LICENSE_PAGE } from "@/constants/pageName";
import { notFound } from "next/navigation";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import LicenseAnalyticsClient from "./LicenseAnalyticsClient";

export default function LicenseDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const content = LICENSE_CONTENTS[slug];
  const license = LICENSE_LIST.find(item => item.slug === slug);

  if (!content || !license) return notFound();

  

  return (
    <div className="whitespace-pre-line text-[17px] font-400 leading-relaxed text-gray-500">
      <TopNavigator title={license.name} page={LICENSE_PAGE} />
      <InitAmplitude />
      <LicenseAnalyticsClient slug={slug} />
      <div className="p-5">{content}</div>
    </div>
  );
}
