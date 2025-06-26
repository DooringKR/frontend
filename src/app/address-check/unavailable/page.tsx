import BottomButton from "@/components/BottomButton/BottomButton";
import CurrentTime from "@/components/DeliveryTimeCheck/CurrentTime";

export default function UnavailableDeliveryPage() {
  return (
    <div className="relative mx-auto min-h-screen max-w-[500px]">
      <div className="overflow-y-auto pb-[80px]">
        <div className="p-5">
          <div>
            <img
              src="/icons/exclamation-mark.svg"
              alt="경고 아이콘"
              className="h-[60px] w-[60px]"
            />
            <div className="mt-5 flex-col gap-2">
              <h1 className="text-[23px] font-700">입력한 주소는 오늘배송 불가해요</h1>
              <p className="text-[17px] font-400 text-gray-500">
                예상 도착시간이 18시보다 늦으면 오늘배송 불가해요
              </p>
            </div>
            <div className="my-10">
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img src="/icons/truck.svg" alt="트럭" className="mr-3" />
                    <span className="text-[17px] font-600">예상 도착시간</span>
                  </div>
                  <span className="text-[17px] font-600 text-blue-500">20시 01분</span>
                </div>
                <div className="flex gap-3 py-2">
                  <div className="mx-[14.5px] w-[3px] bg-gray-200"></div>
                  <span className="mb-7 w-full text-base font-400 text-gray-500">
                    충청남도 천안시 동나구 구성15길 25시까지 1시간 13분 걸려요
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img src="/icons/tool.svg" alt="렌치" className="mr-3" />
                    <span className="text-[17px] font-600">주문 확인 및 제작</span>
                  </div>
                  <span className="text-[17px] font-600 text-blue-500">18시 30분</span>
                </div>
                <div className="flex gap-3 py-2">
                  <div className="mx-[14.5px] w-[3px] bg-gray-200"></div>
                  <span className="mb-7 w-full text-base font-400 text-gray-500">
                    주문 확인하고 제작까지 30분 걸려요
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img src="/icons/watch.svg" alt="시계" className="mr-3" />
                    <span className="text-[17px] font-600">현재 시각</span>
                  </div>
                  <CurrentTime />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50">
          <div className="px-5 py-10 font-400 text-gray-500">
            20시 01분 이후 도착해도 괜찮다면 고객센터에 직접 전화해주세요.
          </div>
        </div>
      </div>
      <div>
        <BottomButton
          className="fixed bottom-0 left-0 z-50 mx-auto w-full max-w-[500px]"
          type="2buttons"
          button1Text="확인했어요"
          button2Text="고객센터 전화"
          button1Type="BrandInverse"
          // onButton1Click={handleStart}
        />
      </div>
    </div>
  );
}
