import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-[12px] border border-input bg-background px-4 py-3 text-[17px] font-400 text-gray-700 transition-colors placeholder:text-gray-400 hover:border-brand-100 focus-visible:border-brand-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-muted disabled:text-gray-400 aria-[invalid=true]:border-red-300 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-300 file:border-0 file:bg-transparent",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
