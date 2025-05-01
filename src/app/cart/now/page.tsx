"use client";

import useDoorStore from "@/store/doorStore";

function CartNowPage() {
  const { doorItem } = useDoorStore();
  return (
    <div >
      바로구매
    </div>
  );
}
export default CartNowPage