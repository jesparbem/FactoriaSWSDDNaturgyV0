"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Workflow, Boxes, Bot, Cpu, Sparkles,
  Coins, TrendingUp, Settings, Zap, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { href: "/equipo", label: "Equipo · Roles", icon: Users, group: "main" },
  { href: "/procesos", label: "Procesos de Negocio", icon: Workflow, group: "build" },
  { href: "/builder", label: "Builder · Enjambre", icon: Cpu, group: "build", live: true },
  { href: "/modulos", label: "Módulos", icon: Boxes, group: "build" },
  { href: "/prototyping", label: "Rapid Prototyping", icon: Zap, group: "build" },
  { href: "/agentes", label: "Agentes IA", icon: Bot, group: "tech" },
  { href: "/costes", label: "Costes", icon: Coins, group: "tech" },
  { href: "/mejora", label: "Auto-mejora", icon: Sparkles, group: "tech", badge: "3" },
];

const groups: { id: string; label: string }[] = [
  { id: "main", label: "Vista general" },
  { id: "build", label: "Construcción" },
  { id: "tech", label: "Plataforma" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-lg gradient-orange flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">Factoría SDD</div>
          <div className="text-xs text-muted-fg leading-tight">Naturgy · v1.3</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-fg mb-2">
              {group.label}
            </div>
            <ul className="space-y-1">
              {navItems
                .filter((i) => i.group === group.id)
                .map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active
                            ? "bg-naturgy-orange-500 text-white font-medium shadow-sm"
                            : "text-fg/80 hover:bg-muted hover:text-fg"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.live && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-naturgy-success animate-pulse" />
                          </span>
                        )}
                        {item.badge && (
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                            active ? "bg-white/20" : "bg-naturgy-orange-500 text-white"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link
          href="#"
          className="flex items-center gap-3 px-2 py-2 rounded-md text-sm text-fg/70 hover:bg-muted hover:text-fg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Configuración</span>
        </Link>
        <div className="mt-3 px-2 text-[11px] text-muted-fg leading-relaxed">
          Plataforma agéntica · 17 agentes · 4 roles
          <br />
          ADAI · GitHub · AKS · AI Foundry
        </div>
      </div>
    </aside>
  );
}
