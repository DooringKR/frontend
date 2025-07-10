import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import PickUpAddressCard from "./_components/PickUpAddressCard";

export default function PickUpPage() {
  return (
    <div>
      <TopNavigator title="주문하기" />
      <div>
        <ReceiveOptionBar
          icon={"/icons/parcel.svg"}
          alt={"소포 아이콘"}
          title={"직접 픽업"}
          children={<PickUpAddressCard />}
          bottomBarClassName="mt-8"
        />
      </div>
    </div>
  );
}
