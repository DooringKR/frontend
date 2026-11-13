import * as React from "react"

import { cn } from "@/lib/utils"

/** 바로가구 입력 상자 모양 — 글자 칸·주소 칸·고르기 시트 칸이 같이 쓴다 */
export const inputBox =
  "flex h-[50px] w-full rounded-[12px] border border-input bg-background px-4 text-[17px] font-400 text-gray-700 transition-colors placeholder:text-gray-400 hover:border-brand-100 focus-visible:border-brand-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-muted disabled:text-gray-400 aria-[invalid=true]:border-red-300 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-300 file:border-0 file:bg-transparent"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputBox,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
