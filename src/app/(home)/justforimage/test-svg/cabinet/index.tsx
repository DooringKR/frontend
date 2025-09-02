// index.tsx
"use client";
import Link from "next/link";

export default function CabinetTestIndex() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Cabinet SVG Test Pages</h1>
      <ul style={{ fontSize: 20 }}>
        <li><Link href="/justforimage/test-svg/cabinet/page">부분장</Link></li>
        <li><Link href="/justforimage/test-svg/cabinet/upper">상부장</Link></li>
        <li><Link href="/justforimage/test-svg/cabinet/open">오픈장</Link></li>
        <li><Link href="/justforimage/test-svg/cabinet/flap">플랩장</Link></li>
      </ul>
    </div>
  );
}
