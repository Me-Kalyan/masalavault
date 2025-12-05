import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "ghost" | "search"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const baseStyles = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow]"
    
    const variants = {
      default: cn(
        "dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
      ),
      ghost: cn(
        "h-auto w-full min-w-0 border-0 bg-transparent px-0 py-0 text-base shadow-none",
        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0",
        "aria-invalid:ring-0 aria-invalid:border-0"
      ),
      search: cn(
        "h-auto w-full min-w-0 border-0 bg-transparent px-0 py-0 text-base md:text-lg shadow-none",
        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0",
        "placeholder:text-muted-foreground/70 placeholder:transition-opacity placeholder:duration-200",
        "aria-invalid:ring-0 aria-invalid:border-0"
      )
    }

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          baseStyles,
          variants[variant],
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
