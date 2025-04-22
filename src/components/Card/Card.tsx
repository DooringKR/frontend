import Image from "next/image";
import Link from "next/link";

interface CardProps {
  href: string;
  title: string;
}

function Card({ href, title }: CardProps) {
  return (
    <Link
      href={href}
      className="flex aspect-square w-full max-w-[226px] flex-col overflow-hidden rounded-xl border bg-white"
    >
      <div className="relative w-full basis-[75%]">
        <Image src="/img/Checker.png" fill alt={title} />
      </div>
      <div className="flex w-full basis-[25%] items-center justify-center ">
        <span className="text-base font-medium">{title}</span>
      </div>
    </Link>
  );
}

export default Card;
