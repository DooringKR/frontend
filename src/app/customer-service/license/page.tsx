import { LICENSE_PAGE } from "@/constants/pageName";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import LicenseList from "./components/LicenseList";

export interface LicenseItem {
  name: string;
  slug: string;
}

// 나중에 리스트 추가 시 여기에 추가만 하면 됨
export const LICENSE_LIST: LicenseItem[] = [
  {
    name: "토스페이스",
    slug: "tossface",
  },
];

export default function LicensePage() {
  return (
    <div>
      <TopNavigator title="오픈소스 라이선스" page={LICENSE_PAGE} />
      <LicenseList list={LICENSE_LIST} />
    </div>
  );
}
