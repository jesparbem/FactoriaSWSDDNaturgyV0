"use client";

import { Coins, TrendingDown, Layers, Cloud, Cpu, Zap, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AGENTS, COST_TIMELINE, MODULES } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function CostesPage() {
  const totalToday = AGENTS.reduce((s, a) => s + a.callsToday * a.costPerCall, 0);
  const totalCalls = AGENTS.reduce((s, a) => s + a.callsToday, 0);
  const sortedAgents = [...AGENTS].sort((a, b) => b.callsToday * b.costPerCall - a.callsToday * a.costPerCall);
  const maxBar = Math.max(...COST_TIMELINE.map((c) => c.cost));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Costes</h1>
        <p className="text-sm text-muted-fg mt-1">
          Trazabilidad por agente, por módulo y por equipo. Cuotas en Azure AI Foundry · imputable a dueños.
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiBox icon={<Coins />} label="Coste hoy" value={formatCurrency(totalToday)} sub={`${formatNumber(totalCalls)} llamadas`} />
        <KpiBox icon={<TrendingDown />} label="Mes en curso" value={formatCurrency(3247.80)} sub="-12% vs mes anterior" tone="success" />
        <KpiBox icon={<Cpu />} label="Tokens hoy" value="142k" sub="claude-opus-4-7 (78%)" />
        <KpiBox icon={<Zap />} label="Coste por módulo (medio)" value={formatCurrency(124.50)} sub="MVP típico: ~80€" />
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Coste últimos 7 días</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {COST_TIMELINE.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-mono text-muted-fg">{formatCurrency(d.cost)}</div>
                <div className="w-full bg-muted rounded-md overflow-hidden flex flex-col justify-end" style={{ height: "140px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-naturgy-orange-600 to-naturgy-orange-400 transition-all"
                    style={{ height: `${(d.cost / maxBar) * 100}%` }}
                  />
                </div>
                <div className="text-xs font-medium">{d.day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top agentes */}
        <Card>
          <CardHeader>
            <CardTitle>Coste por agente (hoy)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedAgents.slice(0, 8).map((a) => {
              const cost = a.callsToday * a.costPerCall;
              const max = sortedAgents[0].callsToday * sortedAgents[0].costPerCall;
              return (
                <div key={a.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-naturgy-orange-500">{a.cmd}</span>
                    <span className="font-mono">{formatCurrency(cost)} · {a.callsToday} calls</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-naturgy-orange-500 to-naturgy-orange-400"
                      style={{ width: `${(cost / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top módulos */}
        <Card>
          <CardHeader>
            <CardTitle>Coste por módulo (acumulado)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[...MODULES]
              .sort((a, b) => b.costToDate - a.costToDate)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted transition-colors">
                  <div className="w-9 h-9 rounded-md bg-naturgy-orange-500/10 text-naturgy-orange-500 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-fg">{m.domain} · PO: {m.productOwner}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold">{formatCurrency(m.costToDate)}</div>
                    <Badge
                      variant={m.status === "deployed" ? "success" : m.status === "issue" ? "danger" : "ghost"}
                      className="text-[10px]"
                    >
                      {m.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Cuotas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-naturgy-orange-500" />
              Cuotas Azure AI Foundry
            </CardTitle>
            <Badge variant="ghost">Refresh cada hora</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { team: "Procurement", consumed: 42, total: 100, status: "ok" },
              { team: "Comercial Cliente", consumed: 78, total: 100, status: "warning" },
              { team: "Operación Red", consumed: 28, total: 100, status: "ok" },
            ].map((c) => {
              const pct = (c.consumed / c.total) * 100;
              return (
                <div key={c.team} className="rounded-lg border border-border bg-bg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">{c.team}</span>
                    {c.status === "warning" && (
                      <Badge variant="warning"><AlertTriangle className="w-2.5 h-2.5" /> Cerca</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold">{pct.toFixed(0)}%</span>
                    <span className="text-xs text-muted-fg font-mono">€{c.consumed * 12}/€{c.total * 12} mes</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 75 ? "bg-naturgy-warning" : "bg-naturgy-success"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiBox({
  icon, label, value, sub, tone = "default",
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; tone?: "default" | "success" | "warning";
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
          tone === "success" ? "bg-naturgy-success/15 text-naturgy-success" :
          tone === "warning" ? "bg-naturgy-warning/15 text-naturgy-warning" :
          "bg-naturgy-orange-500/15 text-naturgy-orange-500"
        }`}>
          {icon}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-fg mt-1">{label}</div>
        <div className="text-[11px] text-muted-fg/80 mt-0.5">{sub}</div>
      </CardContent>
    </Card>
  );
}
