"use client";

import { forwardRef } from "react";

import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

/**
 * 전화번호 칸 — 숫자만 받고 010-0000-0000 모양으로 보인다(바로키친 어드민 PhoneInput 과 같은 규칙).
 * 저장할 때 숫자만 남길지는 쓰는 쪽이 정한다(value 는 보이는 모양 그대로).
 */
const PhoneInput = forwardRef<HTMLInputElement, Omit<React.ComponentProps<"input">, "onChange" | "value"> & { value: string; onChange: (v: string) => void }>(
  ({ value, onChange, placeholder = "010-0000-0000", ...props }, ref) => (
    <Input
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
      {...props}
    />
  ),
);
PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
