import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full rounded-full bg-muted overflow-hidden", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          "bg-gradient-to-r from-naturgy-orange-500 to-naturgy-orange-400",
          barClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
