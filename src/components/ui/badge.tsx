import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * 상태 띠(옛 Chip) — 색 5가지 × 세기 2가지. 상태 글자·색은 쓰는 곳의 표 하나에서 정한다.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[8px] px-[6px] py-[2px] text-[14px]/[20px] font-500",
  {
    variants: {
      color: {
        blue: "",
        yellow: "",
        green: "",
        gray: "",
        purple: "",
        red: "",
      },
      weight: {
        weak: "",
        strong: "text-white",
      },
    },
    compoundVariants: [
      { color: "blue", weight: "weak", className: "bg-blue-50 text-blue-500" },
      { color: "yellow", weight: "weak", className: "bg-yellow-50 text-[#F0B100]" },
      { color: "green", weight: "weak", className: "bg-green-50 text-green-500" },
      { color: "gray", weight: "weak", className: "bg-gray-100 text-gray-600" },
      { color: "purple", weight: "weak", className: "bg-violet-50 text-violet-500" },
      { color: "red", weight: "weak", className: "bg-red-50 text-red-500" },
      { color: "blue", weight: "strong", className: "bg-blue-500" },
      { color: "yellow", weight: "strong", className: "bg-yellow-500" },
      { color: "green", weight: "strong", className: "bg-green-400" },
      { color: "gray", weight: "strong", className: "bg-gray-500" },
      { color: "purple", weight: "strong", className: "bg-violet-500" },
      { color: "red", weight: "strong", className: "bg-red-500" },
    ],
    defaultVariants: { color: "blue", weight: "weak" },
  }
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, color, weight, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ color, weight }), className)} {...props} />
}

export { Badge, badgeVariants }
