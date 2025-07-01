import React, { useState, useRef } from "react";
import BannerPagination from "./_components/Pagination";
import Image from "next/image";

const images = [
    "/img/banner/Banner1.png",
    "/img/banner/Banner2.png",
    "/img/banner/Banner2.png",
    "/img/banner/Banner2.png",
];

const Banner: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const total = images.length;

    // 마우스 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        setDragX(e.clientX - startX.current);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (Math.abs(dragX) > 80) {
            if (dragX < 0 && current < total - 1) {
                setCurrent(current + 1);
            } else if (dragX > 0 && current > 0) {
                setCurrent(current - 1);
            }
        }
        setDragX(0);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    // 드래그 시작
    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startX.current = e.clientX;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    // 터치 이벤트
    const onTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        startX.current = e.touches[0].clientX;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setDragX(e.touches[0].clientX - startX.current);
    };
    const onTouchEnd = () => {
        setIsDragging(false);
        if (Math.abs(dragX) > 80) {
            if (dragX < 0 && current < total - 1) {
                setCurrent(current + 1);
            } else if (dragX > 0 && current > 0) {
                setCurrent(current - 1);
            }
        }
        setDragX(0);
    };

    return (
        <div
            style={{
                width: "100%",
                margin: "0 auto",
                textAlign: "center",
                position: "relative",
                userSelect: isDragging ? "none" : undefined,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 8,
                    margin: "auto",
                    zIndex: 2,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <BannerPagination total={total} current={current} />
            </div>
            <div
                style={{
                    display: "flex",
                    transition: isDragging ? "none" : "transform 0.3s cubic-bezier(.4,0,.2,1)",
                    transform: `translateX(calc(${-current * 100}% + ${dragX}px))`,
                    cursor: isDragging ? "grabbing" : "grab",
                    width: "100%",
                }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        style={{ width: "100%", flexShrink: 0, position: "relative" }}
                        draggable={false}
                        onDragStart={e => e.preventDefault()}
                    >
                        <Image
                            src={src}
                            alt={`배너 이미지 ${idx + 1}`}
                            width={1200}
                            height={400}
                            style={{ width: "100%", height: "auto", objectFit: "contain" } as React.CSSProperties}
                            priority={idx === 0}
                            draggable={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;

