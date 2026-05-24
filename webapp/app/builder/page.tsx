"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Cloud, GitPullRequest, Box, Terminal, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { SWARM_PODS, BUILD_EVENTS, AGENTS } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function BuilderPage() {
  const [tick, setTick] = useState(0);
  // Tick para que el progreso se sienta vivo
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(i);
  }, []);

  const totalCostUsd = SWARM_PODS.reduce((s, p) => s + p.costUsd, 0);
  const totalTokens = SWARM_PODS.reduce((s, p) => s + p.tokens, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">Live</Badge>
            <span className="flex items-center gap-1.5 text-xs text-naturgy-success">
              <span className="w-1.5 h-1.5 rounded-full bg-naturgy-success animate-pulse" />
              Enjambre AKS operativo
            </span>
          </div>
          <h1 className="text-2xl font-bold">Builder · Enjambre de agentes</h1>
          <p className="text-sm text-muted-fg mt-1">
            Pods efímeros en AKS · Workers headless con Claude Code · trazabilidad spec ↔ commit ↔ artefacto
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Terminal className="w-4 h-4" /> Ver logs</Button>
          <Button><Zap className="w-4 h-4" /> Lanzar nuevo enjambre</Button>
        </div>
      </div>

      {/* Architecture diagram */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-naturgy-orange-500" />
            Arquitectura del enjambre · ADAI → GitHub → AKS → AI Foundry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 items-stretch">
            <ArchBox title="ADAI" subtitle="Workbench" desc="POs definen specs · validan contra catálogo" tone="blue" />
            <ArchArrow label="spec.ready" />
            <ArchBox title="GitHub" subtitle="Source of truth" desc="YAML versionado · CODEOWNERS por dominio" tone="blue" />
            <ArchArrow label="webhook" />
            <ArchBox title="Orquestador" subtitle="Service Bus + Container App" desc="Lanza pods · cuotas · prioridades" tone="orange" />
            <ArchArrow label="dispatch" />
            <ArchBox title="AKS" subtitle="Enjambre headless" desc="KEDA · Karpenter · pods efímeros" tone="orange" pulse />
            <ArchArrow label="PR + callback" />
          </div>
          <div className="mt-4 p-3 rounded-lg border border-naturgy-orange-500/30 bg-naturgy-orange-500/5">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-lg bg-naturgy-orange-500/20 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-naturgy-orange-500" />
              </div>
              <div>
                <div className="font-semibold">Azure AI Foundry</div>
                <div className="text-xs text-muted-fg">
                  Catálogo de modelos (Claude, GPT, propios) · cuotas por equipo · trazabilidad · safety transversal
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swarm stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={<Box />} label="Pods activos" value={SWARM_PODS.filter(p => p.status !== "done").length.toString()} />
        <StatBox icon={<Activity />} label="Tokens consumidos" value={formatNumber(totalTokens)} />
        <StatBox icon={<Zap />} label="Coste AI Foundry" value={`$${totalCostUsd.toFixed(2)}`} subtitle="Modelos: claude-opus-4-7" />
        <StatBox icon={<GitPullRequest />} label="PRs abiertos hoy" value="7" subtitle="3 en review · 2 merged" />
      </div>

      {/* Live pods + activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pods en vivo</CardTitle>
              <Badge variant="ghost">{SWARM_PODS.length} workers</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {SWARM_PODS.map((pod) => {
              const agent = AGENTS.find((a) => a.id === pod.agent);
              const dynProgress =
                pod.status === "done" || pod.status === "delivering"
                  ? pod.progress
                  : Math.min(99, pod.progress + ((tick * 2) % 6));
              return (
                <div key={pod.id} className="rounded-lg border border-border bg-bg p-4 hover:border-naturgy-orange-500 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-naturgy-orange-500/10 flex items-center justify-center font-mono text-xs">
                      {pod.id.slice(-3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-naturgy-orange-500">{agent?.cmd}</span>
                        <span className="font-mono text-xs text-muted-fg truncate">{pod.spec}</span>
                      </div>
                      <div className="text-[11px] text-muted-fg mt-0.5">
                        pod-id: <span className="font-mono">{pod.id}</span> · {pod.durationS}s · {formatNumber(pod.tokens)} tokens · ${pod.costUsd.toFixed(2)}
                      </div>
                    </div>
                    <StatusBadge status={pod.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={dynProgress} className="flex-1" />
                    <span className="text-xs font-mono text-muted-fg shrink-0 w-10 text-right">{dynProgress}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Live stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-naturgy-orange-500" />
              Stream JSON
            </CardTitle>
            <p className="text-xs text-muted-fg">stdout del worker headless · correlation = spec_id</p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-naturgy-blue-950 border border-border p-3 font-mono text-[10px] leading-relaxed max-h-[400px] overflow-y-auto space-y-2">
              {BUILD_EVENTS.slice(0, 8).map((e) => (
                <div key={e.id} className="text-naturgy-neutral-300">
                  <span className="text-naturgy-neutral-400">[{e.ts}]</span>{" "}
                  <span className={
                    e.status === "running" ? "text-naturgy-orange-400" :
                    e.status === "ok" ? "text-green-400" :
                    e.status === "warning" ? "text-yellow-400" : "text-red-400"
                  }>
                    [{e.status.toUpperCase()}]
                  </span>{" "}
                  <span className="text-naturgy-orange-500">@{e.agent}</span>{" "}
                  <span className="text-naturgy-neutral-400">{e.module}</span>
                  <div className="pl-4 text-naturgy-neutral-200 break-words">{e.action}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guardarrailes */}
      <Card>
        <CardHeader>
          <CardTitle>Guardarrailes del worker</CardTitle>
          <p className="text-sm text-muted-fg mt-1">Cinco palancas del Agent SDK · cada decisión queda auditada con spec_id</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { title: "Permission modes", desc: "auto en workers · sin humanos en el loop", status: "auto" },
              { title: "allowedTools", desc: "Read, Edit, Write, Bash(git:*), Bash(npm:*)", status: "allowlist" },
              { title: "Hooks", desc: "PreToolUse bloquea rm -rf, push --force", status: "active" },
              { title: "canUseTool", desc: "Callback runtime: ¿ruta permitida?", status: "active" },
              { title: "MCP servers", desc: "ADAI · Artifactory · Vault · App Insights", status: "5/5" },
            ].map((g, i) => (
              <div key={i} className="rounded-lg border border-border bg-bg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">{g.title}</span>
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {g.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-fg leading-snug">{g.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArchBox({ title, subtitle, desc, tone, pulse }: { title: string; subtitle: string; desc: string; tone: "blue" | "orange"; pulse?: boolean }) {
  const toneCls = tone === "blue"
    ? "border-naturgy-blue-500/40 bg-naturgy-blue-500/5"
    : "border-naturgy-orange-500/40 bg-naturgy-orange-500/5";
  return (
    <div className={`rounded-lg border p-3 col-span-1 ${toneCls} ${pulse ? "agent-pulse" : ""}`}>
      <div className="text-[10px] font-mono text-muted-fg uppercase">{subtitle}</div>
      <div className="font-semibold text-sm">{title}</div>
      <p className="text-[11px] text-muted-fg mt-1 leading-snug">{desc}</p>
    </div>
  );
}

function ArchArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-muted-fg col-span-1">
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-naturgy-orange-500 to-transparent" />
      <span className="text-[10px] font-mono mt-1">{label}</span>
    </div>
  );
}

function StatBox({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string; subtitle?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-fg mb-2">
          <div className="w-7 h-7 rounded-md bg-naturgy-orange-500/15 text-naturgy-orange-500 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-xs">{label}</span>
        </div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        {subtitle && <div className="text-[11px] text-muted-fg mt-2">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: "init" | "building" | "delivering" | "done" | "error" }) {
  const config = {
    init: { variant: "ghost", icon: <Loader2 className="w-2.5 h-2.5 animate-spin" />, label: "init" },
    building: { variant: "primary", icon: <Loader2 className="w-2.5 h-2.5 animate-spin" />, label: "building" },
    delivering: { variant: "warning", icon: <GitPullRequest className="w-2.5 h-2.5" />, label: "delivering" },
    done: { variant: "success", icon: <CheckCircle2 className="w-2.5 h-2.5" />, label: "done" },
    error: { variant: "danger", icon: null, label: "error" },
  } as const;
  const c = config[status];
  return <Badge variant={c.variant as "ghost" | "primary" | "warning" | "success" | "danger"}>{c.icon}{c.label}</Badge>;
}
