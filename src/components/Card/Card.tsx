"use client";

import Image from "next/image";

interface CardProps {
  image: string;
  title: string;
  onClick?: () => void;
}

function Card({ image, title, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="flex aspect-square w-full max-w-[226px] flex-col overflow-hidden rounded-xl border bg-white cursor-pointer"
    >
      <div className="relative w-full basis-[75%]">
        <Image src={image} fill alt={title} />
      </div>
      <div className="flex w-full basis-[25%] items-center justify-center">
        <span className="text-base font-medium">{title}</span>
      </div>
    </div>
  );
}

export default Card;
