"use client";

import { forwardRef } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * 숫자 칸 — 단위(mm·개·°)를 칸 안 오른쪽에 늘 보인다(옛 BoxedInput type=number·BoringInputField 를 하나로).
 * 숫자만 받는다(소수점은 decimal). 범위 검사는 화면의 useRequired 규칙에 글로 적는다 — 알림은 다음을 누를 때 칸 밑에.
 * 값은 문자열 그대로(빈 칸 = ''). 숫자로 바꾸는 것은 쓰는 쪽.
 * size="sm" = 그림 위에 놓는 작은 칸(문 미리보기 보링 위치 — 값은 그 대상 위에서 고친다).
 */
const NumberInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "onChange" | "value" | "type" | "size"> & {
    value: string | number | null | undefined;
    onChange: (v: string) => void;
    unit?: string;
    decimal?: boolean;
    size?: "md" | "sm";
  }
>(({ value, onChange, unit, decimal = false, size = "md", className, ...props }, ref) => (
  <div className="relative w-full">
    <Input
      ref={ref}
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value.replace(decimal ? /[^\d.]/g : /\D/g, ""))}
      className={cn(unit && "pr-12", size === "sm" && "h-9 rounded-[10px] px-1 text-center text-[16px]", className)}
      {...props}
    />
    {unit && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[17px] text-gray-400">{unit}</span>}
  </div>
));
NumberInput.displayName = "NumberInput";
export default NumberInput;
