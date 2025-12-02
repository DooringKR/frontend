// "use client";

// import Image from "next/image";
// import React, { useState } from "react";

// import BannerPagination from "./_components/Pagination";

// // 배너 데이터 타입 정의
// interface BannerData {
//   src: string;
//   alt: string;
//   link?: string; // 선택적 링크
// }

// const banners: BannerData[] = [
//   // {
//   //   src: "/img/banner/Banner1.png",
//   //   alt: "배너 이미지 1",
//   // },
//   {
//     src: "/img/banner/Banner2.png",
//     alt: "배너 이미지 2",

//   },
//   {
//     src: "/img/banner/Banner3.png",
//     alt: "배너 이미지 3",
//     link: "https://tally.so/r/wbaEV7",

//   },
//   {
//     src: "/img/banner/Banner4.png",
//     alt: "배너 이미지 4",
//     link: "https://litt.ly/membership", // 예시 링크
//     // link 없음 - 클릭해도 아무 동작 안함
//   },
// ];

// const Banner: React.FC = () => {
//   const [current, setCurrent] = useState(0);
//   const total = banners.length;

//   const goToPrevious = () => {
//     setCurrent((prev) => (prev > 0 ? prev - 1 : total - 1));
//   };

//   const goToNext = () => {
//     setCurrent((prev) => (prev < total - 1 ? prev + 1 : 0));
//   };

//   const handleBannerClick = (banner: BannerData) => {
//     if (banner.link) {
//       window.open(banner.link, '_blank', 'noopener,noreferrer');
//     }
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         margin: "0 auto",
//         textAlign: "center",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* 배너 이미지들 */}
//       <div
//         style={{
//           display: "flex",
//           transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
//           transform: `translateX(-${current * 100}%)`,
//           width: "100%",
//         }}
//       >
//         {banners.map((banner, idx) => (
//           <div
//             key={idx}
//             style={{
//               width: "100%",
//               flexShrink: 0,
//               position: "relative",
//               cursor: banner.link ? "pointer" : "default",
//             }}
//             onClick={() => handleBannerClick(banner)}
//           >
//             <Image
//               src={banner.src}
//               alt={banner.alt}
//               width={1200}
//               height={400}
//               style={{
//                 width: "100%",
//                 height: "auto",
//                 objectFit: "contain",
//                 transition: banner.link ? "opacity 0.2s ease" : "none",
//               } as React.CSSProperties}
//               priority={idx === 0}
//               draggable={false}
//               onMouseEnter={(e) => {
//                 if (banner.link) {
//                   e.currentTarget.style.opacity = "0.9";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (banner.link) {
//                   e.currentTarget.style.opacity = "1";
//                 }
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* 네비게이션 컨트롤 영역 */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 0",
//           pointerEvents: "none",
//         }}
//       >
//         {/* 이전 버튼 */}
//         <button
//           onClick={goToPrevious}
//           style={{
//             background: "none",
//             border: "none",
//             width: 40,
//             height: 40,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             transition: "all 0.2s ease",
//             pointerEvents: "auto",
//             opacity: 0.9,
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.opacity = "1";
//             e.currentTarget.style.transform = "scale(1.2)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.opacity = "0.9";
//             e.currentTarget.style.transform = "scale(1)";
//           }}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M15 18L9 12L15 6" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </button>

//         {/* 다음 버튼 */}
//         <button
//           onClick={goToNext}
//           style={{
//             background: "none",
//             border: "none",
//             width: 40,
//             height: 40,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             transition: "all 0.2s ease",
//             pointerEvents: "auto",
//             opacity: 0.9,
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.opacity = "1";
//             e.currentTarget.style.transform = "scale(1.2)";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.opacity = "0.9";
//             e.currentTarget.style.transform = "scale(1)";
//           }}
//         >
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M9 18L15 12L9 6" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </button>
//       </div>

//       {/* 페이지네이션 */}
//       <div
//         style={{
//           position: "absolute",
//           left: 0,
//           right: 0,
//           bottom: 8,
//           margin: "auto",
//           zIndex: 2,
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <BannerPagination total={total} current={current} />
//       </div>
//     </div>
//   );
// };

// export default Banner;
