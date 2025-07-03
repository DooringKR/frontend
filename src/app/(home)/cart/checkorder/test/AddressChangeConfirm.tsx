import BottomButton from "@/components/BottomButton/BottomButton";

import UnavailableDeliveryFooter from "./UnavailableDeliveryFooter";

function AddressChangeConfirm() {
  return (
    <div className="rounded-3xl border border-red-400">
      <div className="flex items-center justify-center px-5 py-3">
        <div className="h-1 w-10 rounded-full bg-gray-200"></div>
      </div>
      <div className="pt-2">
        <div className="flex flex-col gap-5 px-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-700 text-gray-900">주소를 정말 바꿀까요?</h1>
            <h2 className="font-400 text-gray-500">바뀐 주소는 오늘배송이 불가해요.</h2>
          </div>
          <UnavailableDeliveryFooter />
        </div>
        <BottomButton
          type="2buttons"
          button2Text="네, 바꿀게요"
          button1Text="닫기"
          button1Type="BrandInverse"
          button2Type="Brand"
        />
      </div>
    </div>
  );
}

export default AddressChangeConfirm;
