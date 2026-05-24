"use client";

import { Search, Bell, Mic, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "process-owner", label: "Process Owner", color: "bg-naturgy-blue-500" },
  { id: "domain-owner", label: "Domain Owner", color: "bg-indigo-500" },
  { id: "product-owner", label: "Product Owner", color: "bg-violet-500" },
  { id: "tech-enabler", label: "Technology Enabler", color: "bg-naturgy-orange-500" },
];

export function Topbar() {
  const [role, setRole] = useState("product-owner");
  const [dark, setDark] = useState(true);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-6 lg:px-8 gap-4">
      {/* Search + voice */}
      <div className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
        <input
          type="text"
          placeholder='Describe tu proceso o pide "Constrúyelo ya..."'
          className="w-full h-10 pl-10 pr-12 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-card transition-colors flex items-center justify-center"
          title="Dictado por voz (SDD)"
        >
          <Mic className="w-4 h-4 text-naturgy-orange-500" />
        </button>
      </div>

      {/* Role switcher */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-muted rounded-lg">
        {ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              role === r.id
                ? "bg-card text-fg shadow-sm"
                : "text-muted-fg hover:text-fg"
            )}
          >
            <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1.5", r.color)} />
            {r.label}
          </button>
        ))}
      </div>

      {/* Notifications + theme + user */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setDark(!dark);
            document.documentElement.classList.toggle("dark");
          }}
          className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
          title="Cambiar tema"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="h-9 w-9 rounded-md hover:bg-muted transition-colors flex items-center justify-center relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-naturgy-orange-500 animate-pulse" />
        </button>
        <div className="ml-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-naturgy-orange-400 to-naturgy-orange-600 flex items-center justify-center text-white text-sm font-semibold">
            JE
          </div>
        </div>
      </div>
    </header>
  );
}
