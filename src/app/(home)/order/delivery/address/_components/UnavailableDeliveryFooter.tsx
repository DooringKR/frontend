import { Button } from "@/components/ui/button";

import { CS_TEL } from "../../../_lib/order";

function UnavailableDeliveryFooter() {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4">
      <span className="text-[15px] font-500 text-gray-500">
        20시 31분 이후 도착해도 괜찮다면
        <br />
        고객센터에 직접 전화해주세요.
      </span>
      <Button asChild variant="outline" size="md" className="w-fit">
        <a href={CS_TEL}>고객센터 전화하기</a>
      </Button>
    </div>
  );
}

export default UnavailableDeliveryFooter;
