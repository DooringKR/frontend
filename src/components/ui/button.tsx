import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * 버튼 — 바로가구 버튼 모양(옛 Button type)을 shadcn 변형으로 옮겼다.
 *  variant: default(Brand) · secondary(Gray) · outline(Outlined) · inverse(BrandInverse) · ghost · link · destructive · kakao
 *  size:    lg(Large, 50px·17px) · md(Medium, 40px·16px) · sm(32px) · icon
 * busy = 처리 중(연타 막기·도는 표시) — 어드민 useAction·Button busy 와 같은 규칙. 처리는 useAction 이 맡는다.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[12px] font-500 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-brand-600 disabled:bg-brand-100",
        secondary: "bg-secondary text-secondary-foreground hover:bg-gray-200 disabled:text-gray-300",
        outline: "border border-input bg-background text-secondary-foreground hover:bg-muted disabled:bg-muted disabled:text-gray-300",
        inverse: "bg-accent text-accent-foreground hover:bg-brand-200 disabled:bg-brand-50 disabled:text-brand-200",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50",
        ghost: "text-secondary-foreground hover:bg-muted disabled:text-gray-300",
        link: "text-primary underline-offset-4 hover:underline disabled:text-gray-300",
        // 카카오 로그인 규정 색
        kakao: "rounded-full bg-[#FEE600] text-black hover:bg-[#FEE600]/90 disabled:bg-[#FEE600]/60",
      },
      size: {
        lg: "h-[50px] px-4 text-[17px] [&_svg]:size-5",
        md: "h-10 px-3 text-[16px] [&_svg]:size-5",
        sm: "h-8 rounded-[8px] px-3 text-[14px] [&_svg]:size-4",
        icon: "size-10 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** 처리 중 — 막고 도는 표시 */
  busy?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, busy = false, disabled, children, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        {...(asChild ? {} : { type: type ?? "button" })}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {busy && <Loader2 className="animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
