import { cn } from "@/lib/utils";
import * as React from "react";

const VARIANTS = {
  primary: "bg-naturgy-orange-500 text-white hover:bg-naturgy-orange-600 shadow-sm",
  secondary: "bg-card border border-border text-fg hover:bg-muted",
  ghost: "text-fg hover:bg-muted",
  outline: "border border-naturgy-orange-500 text-naturgy-orange-500 hover:bg-naturgy-orange-50/10",
  danger: "bg-naturgy-danger text-white hover:bg-red-700",
} as const;

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
