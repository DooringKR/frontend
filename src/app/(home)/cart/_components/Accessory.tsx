import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";

import { AccessoryItem } from "@/store/Items/accessoryStore";

function Accessory({ item }: { item: AccessoryItem }) {
  const currentCategory = ACCESSORY_CATEGORY_LIST.find(item => item.slug === item.slug);
  const header = currentCategory?.header || "부속";

  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">{header}</h2>
      <div className="flex justify-between">
        <div>
          <p>제조사 : {item.madeBy}</p>
          <p>모델명 : {item.model}</p>
          {item.accessoryRequests && <p>요청 사항 : {item.accessoryRequests}</p>}
        </div>
      </div>
    </>
  );
}

export default Accessory;
