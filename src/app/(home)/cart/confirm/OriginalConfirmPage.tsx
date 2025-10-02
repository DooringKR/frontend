// "use client";

// import {
//   ACCESSORY_CATEGORY_LIST,
//   CABINET_CATEGORY_LIST,
//   DOOR_CATEGORY_LIST,
//   HARDWARE_CATEGORY_LIST,
// } from "@/constants/category";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import Button from "@/components/BeforeEditByKi/Button/Button";
// import BottomButton from "@/components/BottomButton/BottomButton";

// import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";

// export default function OriginalConfirmPage() {
//   const router = useRouter();
//   const [order, setOrder] = useState<any>(null);
//   const [showDetails, setShowDetails] = useState(true);

//   const ALL_CATEGORIES = [
//     ...DOOR_CATEGORY_LIST,
//     ...ACCESSORY_CATEGORY_LIST,
//     ...HARDWARE_CATEGORY_LIST,
//     ...CABINET_CATEGORY_LIST,
//   ];

//   useEffect(() => {
//     const recentOrderRaw = localStorage.getItem("recentOrder");
//     if (recentOrderRaw) {
//       const orderData = JSON.parse(recentOrderRaw);
//       setOrder(orderData);
//     }

//     return () => {
//       localStorage.removeItem("cartItems");
//       localStorage.removeItem("recentOrder");
//       useCurrentOrderStore.getState().clearCurrentItem();
//     };
//   }, []);

//   const handleCopyAccount = () => {
//     navigator.clipboard.writeText("토스뱅크 1234-5678-1234");
//     alert("계좌번호가 복사되었습니다!");
//   };

//   const handleGoHome = () => {
//     localStorage.removeItem("cartItems");
//     localStorage.removeItem("recentOrder");
//     useCurrentOrderStore.getState().clearCurrentItem();
//     router.push("/");
//   };

//   const getHeaderFromSlug = (slug: string): string => {
//     const found = ALL_CATEGORIES.find(item => item.slug === slug);
//     return found?.header ?? slug;
//   };

//   const getDeliveryLabel = (deliveryDate: string) => {
//     const date = new Date(deliveryDate);
//     const now = new Date();

//     const isSameDay = date.toDateString() === now.toDateString();

//     const tomorrow = new Date();
//     tomorrow.setDate(now.getDate() + 1);
//     const isTomorrow = date.toDateString() === tomorrow.toDateString();

//     if (isSameDay) return "당일배송";
//     if (isTomorrow) return "익일배송";
//     return date.toLocaleDateString();
//   };

//   if (!order) {
//     return <p className="p-5">주문 정보가 없습니다.</p>;
//   }

//   return (
//     <div className="relative">
//       <div className="flex flex-col p-5 pb-20">
//         <p className="mb-2 font-semibold text-green-600">주문 접수 완료</p>
//         <p className="mb-4 text-xl font-bold leading-tight">
//           {order.recipientPhoneNumber}로
//           <br />
//           10분 안에 확인 전화드려요
//         </p>
//         <div className="relative w-full">
//           <Image
//             src="/img/Checker.png"
//             alt="통화이미지"
//             width={0}
//             height={0}
//             sizes="100vw"
//             className="h-auto w-full object-contain"
//           />
//         </div>
//         <p className="mb-5 mt-10">
//           전화로 주문을 확인하면 <br />
//           결제금액을 아래 계좌로 송금해주세요
//         </p>
//         <div className="mb-4 w-full bg-gray-300 p-4">
//           <div className="mb-2 flex justify-between">
//             <span>결제금액</span>
//             <span>{order.totalPrice.toLocaleString()}원</span>
//           </div>
//           <hr className="my-2 border-black" />
//           <div className="flex items-center justify-between">
//             <span className="font-semibold text-blue-600">토스뱅크 1234-5678-1234</span>
//             <button className="text-sm" onClick={handleCopyAccount}>
//               복사
//             </button>
//           </div>
//         </div>

//         <div className="mb-4 w-full bg-gray-300">
//           <button
//             onClick={() => setShowDetails(!showDetails)}
//             className="flex w-full justify-between p-3"
//           >
//             <span className="font-semibold">주문내역 보기</span>
//             <Image src="/icons/Arrow_Bottom.svg" width={15} height={7.5} alt="토글버튼" />
//           </button>
//           {showDetails && (
//             <div className="border-black p-3 text-sm">
//               <div className="mb-2 flex justify-between">
//                 <span className="font-semibold">총 결제금액</span>
//                 <span>{order.totalPrice.toLocaleString()}원</span>
//               </div>
//               <hr className="my-3 border-black" />
//               {order.cartItems.map((item: any, idx: number) => {
//                 if (!item) return null;

//                 const commonPrice = (
//                   <p className="mt-1 font-semibold">
//                     {item.price?.toLocaleString()}원 {item.count}개
//                   </p>
//                 );

//                 switch (item.category) {
//                   case "door":
//                     return (
//                       <div key={idx} className="mb-3 border-b border-black pb-2">
//                         <p className="font-semibold">{getHeaderFromSlug(item.slug)}</p>
//                         <p>색상 : {item.color}</p>
//                         <p>가로 길이 : {item.width?.toLocaleString()}mm</p>
//                         <p>세로 길이 : {item.height?.toLocaleString()}mm</p>
//                         <p>경첩 개수 : {item.hinge?.hingeCount ?? "-"}</p>
//                         <p>경첩 방향 : {item.hinge?.hingePosition === "left" ? "좌경" : "우경"}</p>
//                         <p>
//                           보링 치수 : 상{item.hinge?.topHinge ?? "-"}
//                           {item.hinge?.middleHinge ? `, 중${item.hinge.middleHinge}` : ""}
//                           {item.hinge?.bottomHinge ? `, 하${item.hinge.bottomHinge}` : ""}
//                         </p>
//                         {item.doorRequest && <p>추가 요청: {item.doorRequest}</p>}
//                         {commonPrice}
//                       </div>
//                     );

//                   case "finish":
//                     return (
//                       <div key={idx} className="mb-3 border-b border-black pb-2">
//                         <p className="font-semibold">마감재</p>
//                         <p>색상 : {item.color}</p>
//                         <p>깊이 : {item.depth.baseDepth?.toLocaleString()}mm</p>
//                         {item.depth.additionalDepth && (
//                           <p>⤷ 깊이 키움 : {item.depth.additionalDepth?.toLocaleString()}mm</p>
//                         )}
//                         <p>높이 : {item.height.baseHeight?.toLocaleString()}mm</p>
//                         {item.height.additionalHeight && (
//                           <p>⤷ 높이 키움 : {item.height.additionalHeight?.toLocaleString()}mm</p>
//                         )}
//                         {item.finishRequest && <p>요청 사항 : {item.finishRequest}</p>}
//                         {commonPrice}
//                       </div>
//                     );

//                   case "hardware":
//                     return (
//                       <div key={idx} className="mb-3 border-b border-black pb-2">
//                         <p className="font-semibold">{getHeaderFromSlug(item.slug)}</p>
//                         <p>제조사 : {item.madeBy}</p>
//                         <p>모델명 : {item.model}</p>
//                         {item.hardwareRequests && <p>요청 사항 : {item.hardwareRequests}</p>}
//                         {commonPrice}
//                       </div>
//                     );

//                   case "cabinet":
//                     return (
//                       <div key={idx} className="mb-3 border-b border-black pb-2">
//                         <p className="font-semibold">{getHeaderFromSlug(item.slug)}</p>
//                         {item.handleType && <p>손잡이 종류: {item.handleType}</p>}
//                         {item.compartmentCount !== 0 && <p>구성 칸 수: {item.compartmentCount}</p>}
//                         {item.flapStayType && <p>쇼바 종류: {item.flapStayType}</p>}
//                         <p>색상: {item.color}</p>
//                         <p>두께: {item.thickness}</p>
//                         <p>너비: {item.width}mm</p>
//                         <p>깊이: {item.depth}mm</p>
//                         <p>높이: {item.height}mm</p>
//                         <p>마감 방식: {item.finishType ? item.finishType : "선택 안됨"}</p>
//                         <p>서랍 종류: {item.drawerType}</p>
//                         <p>레일 종류: {item.railType}</p>
//                         {item.cabinetRequests && <p>기타 요청 사항: {item.cabinetRequests}</p>}
//                         {commonPrice}
//                       </div>
//                     );

//                   case "accessory":
//                     return (
//                       <div key={idx} className="mb-3 border-b border-black pb-2">
//                         <p className="font-semibold">{getHeaderFromSlug(item.slug)}</p>
//                         <p>제조사 : {item.madeBy}</p>
//                         <p>모델명 : {item.model}</p>
//                         {item.accessoryRequests && <p>요청 사항 : {item.accessoryRequests}</p>}
//                         {commonPrice}
//                       </div>
//                     );

//                   default:
//                     return null;
//                 }
//               })}
//               <div className="mb-2 mt-3 border-b border-black pb-3">
//                 <p className="font-semibold">배송일정</p>
//                 <p>{getDeliveryLabel(order.deliveryDate)}</p>
//               </div>
//               <div className="mb-2 border-b border-black pb-3">
//                 <p className="font-semibold">배송주소</p>
//                 <p>{order.address1}</p>
//                 <p>{order.address2}</p>
//               </div>
//               <div className="mb-2 border-b border-black pb-3">
//                 <p className="font-semibold">배송기사 요청사항</p>
//                 <p>{order.deliveryRequest}</p>
//                 {order.foyerAccessType?.gatePassword && (
//                   <p>공동현관 비밀번호: {order.foyerAccessType.gatePassword}</p>
//                 )}
//               </div>
//               <div className="mb-2 border-b border-black pb-3">
//                 <p className="font-semibold">현장에서 받는 분 연락처</p>
//                 <p>{order.recipientPhoneNumber}</p>
//               </div>

//               <div className="mb-2">
//                 <p className="font-semibold">바로가구 요청사항</p>
//                 <p>{order.otherRequests || "없음"}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <BottomButton
//         className="fixed bottom-0 left-0 right-0 z-50 max-w-[460px] border-t"
//         type="2buttons"
//         button1Text="홈으로"
//         button2Text="계좌 복사"
//         onButton1Click={handleGoHome}
//         onButton2Click={handleCopyAccount}
//       />
//     </div>
//   );
// }
