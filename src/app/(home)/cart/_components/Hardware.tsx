import { HARDWARE_CATEGORY_LIST } from "@/constants/category";
import { HardwareItem } from "@/types/itemTypes";

function Hardware({ item }: { item: HardwareItem }) {
  const currentCategory = HARDWARE_CATEGORY_LIST.find(item => item.slug === item.slug);
  const header = currentCategory?.header || "부속";

  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">{header}</h2>
      <div className="flex justify-between">
        <div>
          <p>제조사 : {item.madeBy}</p>
          <p>모델명 : {item.model}</p>
          {item.hardwareRequest && <p>요청 사항 : {item.hardwareRequest}</p>}
        </div>
      </div>
    </>
  );
}

export default Hardware;
