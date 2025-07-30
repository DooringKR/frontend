import Link from "next/link";

import { LicenseItem } from "../page";

interface Props {
  list: LicenseItem[];
}

export default function LicenseList({ list }: Props) {
  return (
    <div className="p-5">
      <ul className="space-y-3">
        {list.map(item => (
          <li key={item.slug}>
            <Link href={`/customer-service/license/${item.slug}`} className="flex justify-between">
              <div className="cursor-pointer text-[17px] font-500 text-gray-700">{item.name}</div>
              <img src={"/icons/listed-button.svg"} alt="오른쪽 화살표 아이콘" className="" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
