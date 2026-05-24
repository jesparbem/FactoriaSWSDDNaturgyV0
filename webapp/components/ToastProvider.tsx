"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { CheckCircle2, AlertTriangle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "info" | "warning" | "danger";
interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

const Ctx = createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++counter;
    setToasts((curr) => [...curr, { id, ...t }]);
    setTimeout(() => {
      setToasts((curr) => curr.filter((x) => x.id !== id));
    }, 4500);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => setToasts((c) => c.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx.toast;
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const cfg = {
    success: { icon: CheckCircle2, color: "text-naturgy-success", bg: "bg-naturgy-success/10 border-naturgy-success/30" },
    info: { icon: Info, color: "text-naturgy-blue-500", bg: "bg-naturgy-blue-500/10 border-naturgy-blue-500/30" },
    warning: { icon: AlertTriangle, color: "text-naturgy-warning", bg: "bg-naturgy-warning/10 border-naturgy-warning/30" },
    danger: { icon: AlertTriangle, color: "text-naturgy-danger", bg: "bg-naturgy-danger/10 border-naturgy-danger/30" },
  }[toast.kind];
  const Icon = cfg.icon;
  return (
    <div className={cn("flex gap-3 p-3 rounded-lg border bg-card shadow-lg animate-slide-up", cfg.bg)}>
      <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", cfg.color)} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold leading-tight">{toast.title}</div>
        {toast.description && (
          <div className="text-xs text-muted-fg mt-1 leading-snug">{toast.description}</div>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-muted-fg hover:text-fg transition-colors h-5 w-5 flex items-center justify-center"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * Hook que sincroniza el tema dark/light con localStorage en el cliente.
 * Aplica/quita la clase 'dark' del <html> según preferencia persistida.
 */
export function useTheme() {
  const [dark, setDark] = useState<boolean>(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("naturgy-theme") : null;
    const initial = stored ? stored === "dark" : true;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = useCallback(() => {
    setDark((d) => {
      const nxt = !d;
      document.documentElement.classList.toggle("dark", nxt);
      window.localStorage.setItem("naturgy-theme", nxt ? "dark" : "light");
      return nxt;
    });
  }, []);

  return { dark, toggle };
}
