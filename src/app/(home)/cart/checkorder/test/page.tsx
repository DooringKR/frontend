"use client";

import { useState } from "react";

import TestConfirmPage from "./Confirm";

export default function Page() {
  const [isClicked, setIsClicked] = useState(false);

  const handleEstimatedTimeClick = () => {
    console.log("클릭");
    setIsClicked(prev => !prev);
  };

  return (
    // <div className="mb- flex min-h-screen flex-col justify-between p-5">
    //   <div className="flex flex-grow flex-col gap-5">
    //     <img src={"/icons/exclamation-mark.svg"} alt="느낌표 아이콘" className="h-12 w-12" />
    //     <div className="flex flex-col gap-2">
    //       <h1 className="text-[26px] font-700">
    //         입력한 주소는
    //         <br />
    //         오늘배송 어려워요
    //       </h1>
    //       <span className="text-[17px] font-400 text-gray-500">
    //         오늘배송 받으려면
    //         <br />
    //         예상 도착 시간이 오후 6시 전이어야 해요.
    //       </span>
    //     </div>
    //     <div>
    //       <div
    //         className={`flex justify-between border-gray-200 px-4 py-3 ${isClicked ? "rounded-t-xl border-l border-r border-t" : "rounded-xl border"}`}
    //         onClick={handleEstimatedTimeClick}
    //       >
    //         <span className="font-500 text-gray-500">예상 도착 시간</span>
    //         <div className="flex gap-1">
    //           <span className="text-[17px] font-600 text-blue-500">20시 31분</span>
    //           {isClicked ? (
    //             <img src={"/icons/chevron-down-thick.svg"} alt="아래쪽 화살표" />
    //           ) : (
    //             <img src={"/icons/chevron-right-thick.svg"} alt="오른쪽 화살표" />
    //           )}
    //         </div>
    //       </div>
    //       {/* 얘는 조건부 렌더 */}
    //       {isClicked ? (
    //         <>
    //           <div className="mx-4 h-[1px] rounded-full bg-gray-200"></div>
    //           <div className="rounded-b-xl border-b border-l border-r border-gray-200 px-4 py-3">
    //             <div className="flex flex-col gap-3">
    //               <div className="flex justify-between font-500">
    //                 <div className="text-gray-500">현재 시각</div>
    //                 <div>18시 41분</div>
    //               </div>
    //               <div className="flex justify-between font-500">
    //                 <div className="text-gray-500">주문 접수 및 제작 시간</div>
    //                 <div>+ 30분</div>
    //               </div>
    //               <div className="flex justify-between font-500">
    //                 <div className="text-gray-500">예상 배송 시간</div>
    //                 <div>+ 1시간 20분</div>
    //               </div>
    //             </div>
    //             <div className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-gray-100 px-4 py-3">
    //               충청남도 천안시 동남구
    //               구성14길길길긹릭릭릭리기릭리기리기리ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ
    //             </div>
    //           </div>
    //         </>
    //       ) : (
    //         ""
    //       )}
    //     </div>
    //     <UnavailableDeliveryFooter />
    //     {/* <AddressChangeConfirm /> */}
    //   </div>
    //   <div className="pt-5">
    //     <Button type="Brand" text="확인했어요" />
    //   </div>
    // </div>

    <TestConfirmPage />
  );
}
