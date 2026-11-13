import { LicenseItem } from "@/constants/license/licenseData";
import NavRow from "@/components/nav/NavRow";

interface Props {
  list: LicenseItem[];
}

export default function LicenseList({ list }: Props) {
  return (
    <ul className="py-2">
      {list.map(item => (
        <li key={item.slug}>
          <NavRow label={item.name} href={`/customer-service/license/${item.slug}`} />
        </li>
      ))}
    </ul>
  );
}
