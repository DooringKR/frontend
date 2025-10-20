"use client";

import { useEffect } from "react";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";

type Props = {
  slug: string;
};

export default function LicenseAnalyticsClient({ slug }: Props) {
  useEffect(() => {
    setScreenName("license_" + slug);
    const prev = getPreviousScreenName();

    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, [slug]);

  return null;
}
