"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()}>
      <Image src="/icons/Arrow_Left.svg" width={24} height={24} alt="뒤로가기" />
    </button>
  );
}

export default BackButton;
