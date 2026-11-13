"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * 체크박스 — 옛 Checkbox(square·circle·ghost × medium·large, SVG 그림)를 shadcn(Radix) 하나로.
 * 이름은 체크 옆 한 줄(Label 로 묶는다).
 */
const checkboxVariants = cva(
  "peer grid shrink-0 place-content-center border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:text-primary-foreground",
  {
    variants: {
      variant: {
        square: "rounded-[6px] border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        circle: "rounded-full border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        ghost: "border-transparent text-gray-300 data-[state=checked]:text-primary",
      },
      size: {
        medium: "size-5 [&_svg]:size-3.5",
        large: "size-7 [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "square", size: "medium" },
  }
)

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>
>(({ className, variant, size, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants({ variant, size }), className)} {...props}>
    {variant === "ghost" ? (
      <Check strokeWidth={3} />
    ) : (
      <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
        <Check strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    )}
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
