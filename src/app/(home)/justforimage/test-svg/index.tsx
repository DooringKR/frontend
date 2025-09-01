"use client";
import Link from "next/link";

export default function SvgTestIndex() {
  return (
    <div>
      <h1>SVG 생성 테스트 모음</h1>
      <ul>
        <li><Link href="/test-svg/general">일반문</Link></li>
        <li><Link href="/test-svg/maeda">마에다 서랍</Link></li>
        <li><Link href="/test-svg/flap">플랩문</Link></li>
        <li><Link href="/test-svg/cabinet">부분장</Link></li>
        <li><Link href="/test-svg/drawer">서랍장</Link></li>
        <li><Link href="/test-svg/finish">마감재</Link></li>
      </ul>
    </div>
  );
}
