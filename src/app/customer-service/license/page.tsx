import { LICENSE_LIST } from "@/constants/license/licenseData";
import { LICENSE_PAGE } from "@/constants/pageName";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import LicenseList from "./components/LicenseList";

export default function LicensePage() {
  return (
    <div>
      <TopNavigator title="오픈소스 라이선스" page={LICENSE_PAGE} />
      <LicenseList list={LICENSE_LIST} />
    </div>
  );
}
