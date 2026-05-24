import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-muted text-fg",
  primary: "bg-naturgy-orange-500 text-white",
  blue: "bg-naturgy-blue-500 text-white",
  success: "bg-naturgy-success/15 text-naturgy-success",
  warning: "bg-naturgy-warning/15 text-naturgy-warning",
  danger: "bg-naturgy-danger/15 text-naturgy-danger",
  outline: "border border-border text-fg",
  ghost: "bg-card text-muted-fg",
} as const;

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof VARIANTS }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
