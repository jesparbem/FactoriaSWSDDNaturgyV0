"use client";

import { useState } from "react";
import Link from "next/link";
import { Boxes, Filter, Plus, Search, ExternalLink, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { MODULES, SDLC_PHASES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const STATUS_VARIANT = {
  draft: "ghost",
  building: "primary",
  testing: "warning",
  review: "warning",
  deployed: "success",
  issue: "danger",
} as const;

export default function ModulosPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? MODULES : MODULES.filter((m) => m.phase === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Módulos</h1>
          <p className="text-sm text-muted-fg mt-1">
            Unidades autocontenidas (funcionalidad + datos). Cada módulo tiene su PO y su Domain Owner.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Filter className="w-4 h-4" /> Filtros avanzados</Button>
          <Button><Plus className="w-4 h-4" /> Nuevo módulo</Button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
          <input
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Buscar por nombre, dominio o PO..."
          />
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === "all" ? "bg-card text-fg shadow-sm" : "text-muted-fg hover:text-fg"
            }`}
          >
            Todos · {MODULES.length}
          </button>
          {SDLC_PHASES.map((p) => {
            const count = MODULES.filter((m) => m.phase === p.id).length;
            return (
              <button
                key={p.id}
                onClick={() => setFilter(p.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === p.id ? "bg-card text-fg shadow-sm" : "text-muted-fg hover:text-fg"
                }`}
              >
                {p.label} · {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modules grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <Card key={m.id} className="hover:border-naturgy-orange-500 transition-all">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-naturgy-orange-500/10 text-naturgy-orange-500 flex items-center justify-center shrink-0">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{m.name}</h3>
                      <Badge variant="ghost" className="font-mono text-[10px]">{m.id}</Badge>
                    </div>
                    <div className="text-xs text-muted-fg mt-1">
                      {m.domain} · <span className="font-mono">{m.archetype}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[m.status]}>{m.status}</Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-fg">Fase: <span className="text-fg font-medium">{SDLC_PHASES.find(p => p.id === m.phase)?.label}</span></span>
                  <span className="font-mono">{m.progress}%</span>
                </div>
                <Progress value={m.progress} />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-muted-fg text-[10px] uppercase">PO</div>
                  <div className="font-medium mt-0.5 truncate">{m.productOwner}</div>
                </div>
                <div>
                  <div className="text-muted-fg text-[10px] uppercase">Domain Owner</div>
                  <div className="font-medium mt-0.5 truncate">{m.domainOwner}</div>
                </div>
                <div>
                  <div className="text-muted-fg text-[10px] uppercase">Coste acumulado</div>
                  <div className="font-mono mt-0.5">{formatCurrency(m.costToDate)}</div>
                </div>
              </div>

              {m.agentsActive.length > 0 && (
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <span className="text-[10px] text-muted-fg uppercase">Agentes activos:</span>
                  <div className="flex flex-wrap gap-1">
                    {m.agentsActive.map((a) => (
                      <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-naturgy-orange-500/15 text-naturgy-orange-500">
                        @{a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2">
                <span className="text-[11px] text-muted-fg">Última actividad: {m.lastUpdate}</span>
                <div className="flex gap-2">
                  <Link href="/builder">
                    <Button variant="ghost" size="sm"><GitBranch className="w-3.5 h-3.5" /> Build</Button>
                  </Link>
                  <Button variant="secondary" size="sm"><ExternalLink className="w-3.5 h-3.5" /> Abrir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
