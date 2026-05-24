import Link from "next/link";
import {
  TrendingUp, TrendingDown, Minus, Sparkles, Cpu, Boxes,
  Workflow, Coins, ArrowRight, Zap, Activity, CheckCircle2,
  AlertTriangle, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { MODULES, AGENTS, BUILD_EVENTS, SDLC_PHASES, ROLES } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const activeModules = MODULES.filter((m) => m.status === "building" || m.status === "testing");
  const deployed = MODULES.filter((m) => m.status === "deployed").length;
  const issues = MODULES.filter((m) => m.status === "issue").length;
  const totalCostToday = AGENTS.reduce((s, a) => s + a.callsToday * a.costPerCall, 0);
  const totalCallsToday = AGENTS.reduce((s, a) => s + a.callsToday, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-naturgy-orange-500/20 rounded-full blur-3xl" />
        <div className="relative p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="primary">v1.3 · Factoría agéntica</Badge>
                <span className="flex items-center gap-1.5 text-xs text-naturgy-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-naturgy-success animate-pulse" />
                  Plataforma operativa
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                Hola, Jesús. <span className="text-gradient-orange">FactorIA 2.0</span> está construyendo {activeModules.length} módulos en este momento.
              </h1>
              <p className="text-muted-fg text-base">
                17 agentes especializados, 4 roles, una plataforma. De la idea al despliegue en producción con
                guardarrailes corporativos.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link href="/procesos">
                  <Button size="lg">
                    <Sparkles className="w-4 h-4" /> Empezar un proceso nuevo
                  </Button>
                </Link>
                <Link href="/builder">
                  <Button size="lg" variant="secondary">
                    <Cpu className="w-4 h-4" /> Ver el enjambre en vivo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mini live indicator */}
            <div className="hidden md:block">
              <Card className="bg-bg/40 backdrop-blur min-w-[260px]">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-fg">Enjambre AKS</span>
                    <span className="flex items-center gap-1 text-xs text-naturgy-success">
                      <Activity className="w-3 h-3" /> Live
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl gradient-orange flex items-center justify-center agent-pulse">
                        <Cpu className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold leading-none">5</div>
                      <div className="text-xs text-muted-fg">pods activos</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-fg leading-tight">
                    Tokens hoy: <span className="font-mono text-fg">142k</span> ·{" "}
                    Coste: <span className="font-mono text-naturgy-orange-500">{formatCurrency(totalCostToday)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Boxes className="w-5 h-5" />}
          label="Módulos en construcción"
          value={activeModules.length.toString()}
          delta="+2 vs ayer"
          trend="up"
        />
        <KpiCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Módulos desplegados"
          value={deployed.toString()}
          delta="100% gates OK"
          trend="up"
        />
        <KpiCard
          icon={<Coins className="w-5 h-5" />}
          label="Coste hoy"
          value={formatCurrency(totalCostToday)}
          delta={`${formatNumber(totalCallsToday)} llamadas`}
          trend="flat"
        />
        <KpiCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Incidentes activos"
          value={issues.toString()}
          delta={issues > 0 ? "1 SEV-2 en curso" : "Sin incidentes"}
          trend={issues > 0 ? "down" : "flat"}
          danger={issues > 0}
        />
      </section>

      {/* SDLC ribbon */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Pipeline SDLC en tiempo real</CardTitle>
              <p className="text-sm text-muted-fg mt-1">
                Spec → Mapeo entidades → Build IA → Testing → Promoción → Despliegue
              </p>
            </div>
            <Link href="/modulos" className="text-sm text-naturgy-orange-500 hover:underline flex items-center gap-1">
              Ver todos los módulos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {SDLC_PHASES.map((phase, i) => {
              const count = MODULES.filter((m) => m.phase === phase.id).length;
              return (
                <div
                  key={phase.id}
                  className="relative rounded-lg border border-border bg-bg p-3 hover:border-naturgy-orange-500 transition-all group"
                >
                  <div className="text-[10px] font-mono text-muted-fg">{`Fase ${i + 1}`}</div>
                  <div className="text-sm font-semibold mt-1 leading-tight">{phase.label}</div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-bold text-naturgy-orange-500">{count}</span>
                    <div className="flex gap-1">
                      {phase.roles.slice(0, 3).map((r) => (
                        <span
                          key={r}
                          title={ROLES[r].label}
                          className={`w-1.5 h-1.5 rounded-full bg-${ROLES[r].color}-500`}
                          style={{
                            backgroundColor:
                              r === "process-owner" ? "#0066B3" :
                              r === "domain-owner" ? "#6366F1" :
                              r === "product-owner" ? "#8B5CF6" :
                              "#FF671B",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two-column */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active modules */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Módulos en construcción</CardTitle>
              <Badge variant="ghost">{activeModules.length} activos</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeModules.map((m) => (
              <Link
                key={m.id}
                href={`/modulos`}
                className="block p-3 rounded-lg border border-border bg-bg hover:border-naturgy-orange-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-mono text-xs text-muted-fg shrink-0 group-hover:bg-naturgy-orange-500/10 group-hover:text-naturgy-orange-500 transition-colors">
                    {m.id.slice(-3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{m.name}</span>
                      <Badge variant="ghost" className="text-[10px]">{m.archetype}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-fg mt-0.5">
                      <span>{m.domain}</span>·<span>PO: {m.productOwner}</span>·<span>{m.lastUpdate}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={m.progress} className="flex-1" />
                      <span className="text-xs font-mono text-muted-fg shrink-0">{m.progress}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex -space-x-1">
                      {m.agentsActive.slice(0, 3).map((a) => (
                        <div
                          key={a}
                          title={a}
                          className="w-6 h-6 rounded-full bg-naturgy-orange-500 border-2 border-card text-[9px] font-bold text-white flex items-center justify-center"
                        >
                          {a.slice(0, 2)}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-muted-fg">{formatCurrency(m.costToDate)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-naturgy-orange-500" />
                Actividad en vivo
              </CardTitle>
              <span className="text-[10px] text-muted-fg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-naturgy-success animate-pulse" /> Tiempo real
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-[420px] overflow-y-auto">
            {BUILD_EVENTS.slice(0, 8).map((e) => (
              <div key={e.id} className="flex gap-2.5 text-xs">
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      e.status === "running"
                        ? "bg-naturgy-orange-500 animate-pulse"
                        : e.status === "ok"
                        ? "bg-naturgy-success"
                        : e.status === "warning"
                        ? "bg-naturgy-warning"
                        : "bg-naturgy-danger"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono text-naturgy-orange-500 font-semibold">@{e.agent}</span>
                    <span className="text-[10px] font-mono text-muted-fg">{e.ts}</span>
                    <span className="text-[10px] text-muted-fg">{e.module}</span>
                  </div>
                  <p className="text-fg/90 leading-snug mt-0.5">{e.action}</p>
                  {e.cost !== undefined && (
                    <span className="text-[10px] text-muted-fg font-mono">
                      {e.duration}s · {formatCurrency(e.cost)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Roles section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Tu vista según tu rol</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(ROLES) as [keyof typeof ROLES, (typeof ROLES)[keyof typeof ROLES]][]).map(
            ([key, role], i) => {
              const colors = ["bg-naturgy-blue-500", "bg-indigo-500", "bg-violet-500", "bg-naturgy-orange-500"];
              return (
                <Card key={key} className="hover:border-naturgy-orange-500 transition-all cursor-pointer group">
                  <CardContent className="p-5 space-y-3">
                    <div className={`w-10 h-10 rounded-lg ${colors[i]} flex items-center justify-center text-white text-lg font-bold`}>
                      {role.label.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-naturgy-orange-500 transition-colors">
                        {role.label}
                      </h3>
                      <p className="text-xs text-muted-fg mt-1 leading-relaxed">{role.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  delta,
  trend,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  danger?: boolean;
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <Card className="hover:border-naturgy-orange-500 transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${danger ? "bg-naturgy-danger/15 text-naturgy-danger" : "bg-naturgy-orange-500/15 text-naturgy-orange-500"}`}>
            {icon}
          </div>
          <TrendIcon
            className={`w-4 h-4 ${
              trend === "up" ? "text-naturgy-success" : trend === "down" ? "text-naturgy-orange-500" : "text-muted-fg"
            }`}
          />
        </div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-fg mt-2">{label}</div>
        <div className="text-[11px] text-muted-fg/80 mt-1">{delta}</div>
      </CardContent>
    </Card>
  );
}
