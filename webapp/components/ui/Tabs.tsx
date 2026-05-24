"use client";

import { useState, ReactNode, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const TabsCtx = createContext<{ value: string; set: (v: string) => void } | null>(null);

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}) {
  const [value, set] = useState(defaultValue);
  return (
    <TabsCtx.Provider value={{ value, set }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex gap-1 p-1 bg-muted rounded-lg", className)}>{children}</div>
  );
}

export function TabsTrigger({
  value: v,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsCtx);
  if (!ctx) return null;
  const active = ctx.value === v;
  return (
    <button
      onClick={() => ctx.set(v)}
      className={cn(
        "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
        active ? "bg-card text-fg shadow-sm" : "text-muted-fg hover:text-fg",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value: v, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx);
  if (!ctx || ctx.value !== v) return null;
  return <div className="mt-4 animate-fade-in">{children}</div>;
}
