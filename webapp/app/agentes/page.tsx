"use client";

import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import {
  TrendingUp, TrendingDown, Minus, ExternalLink, Activity, Coins, Clock,
  Edit3, Plus, Bot, Sparkles, Wand2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AGENTS, type Agent, type AgentId, ARCHITECT_SKILL_SPEC, SkillSpec } from "@/lib/data";
import { SkillEditor } from "@/components/SkillEditor";
import { formatCurrency } from "@/lib/utils";

const COLOR_MAP = {
  blue: "from-naturgy-blue-500 to-naturgy-blue-700",
  orange: "from-naturgy-orange-500 to-naturgy-orange-700",
  violet: "from-violet-500 to-violet-700",
  green: "from-emerald-500 to-emerald-700",
  red: "from-red-500 to-red-700",
  amber: "from-amber-500 to-amber-700",
  cyan: "from-cyan-500 to-cyan-700",
  pink: "from-pink-500 to-pink-700",
} as const;

export default function AgentesPage() {
  const [selected, setSelected] = useState<AgentId | null>(null);
  const [editing, setEditing] = useState<SkillSpec | null>(null);
  const selectedAgent = selected ? AGENTS.find((a) => a.id === selected) : null;

  function startEditing(agent: Agent) {
    // Para esta demo: si es @architect cargamos el spec real,
    // si es otro generamos uno sintético basado en sus campos visibles.
    const spec: SkillSpec =
      agent.id === "architect"
        ? ARCHITECT_SKILL_SPEC
        : {
            num: agent.num,
            cmd: agent.cmd,
            name: agent.name,
            version: "1.0",
            sources: "Importado desde catálogo activo",
            identity: `${agent.name} — ${agent.domain}.`,
            mission: `Cumplir su rol en el SDLC: ${agent.domain}.`,
            criticalRules: ["Editar para definir las reglas innegociables..."],
            deliverables: [`Output: artefactos según ${agent.cmd}`],
            workflow: ["Lee BLUEPRINT.md", "Ejecuta su rol", "Reporta KPIs a @self-improve"],
            subagents: agent.subagents,
            kpis: agent.kpis.map((k) => ({ name: k.name.toLowerCase().replace(/\s+/g, "_"), target: k.value })),
            communicationStyle: "Tono profesional, conciso, en español.",
            handoffFrom: "Según playbook activo",
            handoffTo: "Según playbook activo",
            hooks: [],
            realityChecker: true,
          };
    setEditing(spec);
    setSelected(null);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Agentes IA</h1>
          <p className="text-sm text-muted-fg mt-1">
            18 agentes especializados. Cada uno con su misión, reglas críticas, sub-agentes y KPIs. Editables.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/agentes/nuevo">
            <Button>
              <Plus className="w-4 h-4" /> Nuevo agente
            </Button>
          </Link>
        </div>
      </div>

      {/* Editor expandido si hay edición en curso */}
      {editing && (
        <SkillEditor
          initial={editing}
          onSave={() => setEditing(null)}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Grid de agentes */}
      {!editing && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {AGENTS.map((a) => {
              // @ts-expect-error dynamic icon
              const Icon = Icons[a.icon] ?? Icons.Bot;
              const isMeta = a.id === "skill-creator";
              return (
                <button
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  className={`text-left rounded-xl border bg-card p-4 hover:border-naturgy-orange-500 transition-all relative overflow-hidden group ${
                    selected === a.id ? "border-naturgy-orange-500 ring-2 ring-naturgy-orange-500/30" : "border-border"
                  } ${isMeta ? "ring-1 ring-pink-500/30" : ""}`}
                >
                  <div className={`absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-br ${COLOR_MAP[a.color]} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${COLOR_MAP[a.color]} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-fg">{a.num}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono text-naturgy-orange-500 font-semibold">{a.cmd}</span>
                      {isMeta && (
                        <Badge variant="primary" className="text-[9px]">META</Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-fg leading-snug mt-1 min-h-[32px]">{a.domain}</div>
                    <div className="mt-3 flex items-center justify-between text-[10px]">
                      <span className="text-muted-fg">{a.callsToday} hoy</span>
                      <span className="font-mono text-naturgy-orange-500">{formatCurrency(a.costPerCall)}</span>
                    </div>
                    {a.subagents && (
                      <div className="absolute top-2 right-8 w-5 h-5 rounded-full bg-naturgy-orange-500/20 text-naturgy-orange-500 text-[9px] font-bold flex items-center justify-center">
                        {a.subagents.length}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Card "Crear nuevo" */}
            <Link
              href="/agentes/nuevo"
              className="rounded-xl border-2 border-dashed border-border bg-bg p-4 hover:border-naturgy-orange-500 hover:bg-naturgy-orange-500/5 transition-all flex flex-col items-center justify-center text-center min-h-[160px] group"
            >
              <div className="w-9 h-9 rounded-lg bg-muted group-hover:bg-naturgy-orange-500 transition-colors flex items-center justify-center mb-2">
                <Plus className="w-4 h-4 text-muted-fg group-hover:text-white" />
              </div>
              <div className="text-sm font-semibold">Nuevo agente</div>
              <div className="text-[10px] text-muted-fg mt-1">Manual o con @skill-creator</div>
            </Link>
          </div>

          {/* Detail panel */}
          {selectedAgent && (
            <AgentDetail
              agent={selectedAgent}
              onClose={() => setSelected(null)}
              onEdit={() => startEditing(selectedAgent)}
            />
          )}
        </>
      )}
    </div>
  );
}

function AgentDetail({
  agent, onClose, onEdit,
}: {
  agent: Agent; onClose: () => void; onEdit: () => void;
}) {
  // @ts-expect-error dynamic icon
  const Icon = Icons[agent.icon] ?? Icons.Bot;
  return (
    <Card className="border-naturgy-orange-500 animate-slide-up">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${COLOR_MAP[agent.color]} flex items-center justify-center text-white shadow-md`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-naturgy-orange-500 font-semibold">{agent.cmd}</span>
                <Badge variant="ghost" className="font-mono text-[10px]">SKILL {agent.num}</Badge>
              </div>
              <CardTitle className="mt-1">{agent.name}</CardTitle>
              <p className="text-sm text-muted-fg mt-1">{agent.domain}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={onEdit}>
              <Edit3 className="w-3.5 h-3.5" /> Editar SKILL
            </Button>
            <Button variant="secondary" size="sm">
              <ExternalLink className="w-3.5 h-3.5" /> Ver en GitHub
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Sub-agentes paralelos */}
        {agent.subagents && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-fg mb-2">Sub-agentes paralelos · {agent.subagents.length}</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              {agent.subagents.map((sa) => (
                <div key={sa} className="rounded-lg border border-border bg-bg p-3 hover:border-naturgy-orange-500 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-naturgy-orange-500" />
                    <span className="text-xs font-medium">{sa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPIs */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-fg mb-2">KPIs reportados a @self-improve</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agent.kpis.map((k, i) => {
              const TrendIcon = k.trend === "up" ? TrendingUp : k.trend === "down" ? TrendingDown : Minus;
              return (
                <div key={i} className="rounded-lg border border-border bg-bg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-fg uppercase">{k.name}</div>
                    <div className="text-lg font-bold mt-0.5">{k.value}</div>
                  </div>
                  <TrendIcon className={`w-4 h-4 ${
                    k.trend === "up" ? "text-naturgy-success" :
                    k.trend === "down" ? "text-naturgy-orange-500" : "text-muted-fg"
                  }`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Coste */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-bg p-3">
            <div className="text-[10px] text-muted-fg uppercase flex items-center gap-1.5">
              <Coins className="w-3 h-3" /> Coste medio por llamada
            </div>
            <div className="text-lg font-bold mt-1 font-mono">{formatCurrency(agent.costPerCall)}</div>
          </div>
          <div className="rounded-lg border border-border bg-bg p-3">
            <div className="text-[10px] text-muted-fg uppercase flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Duración media
            </div>
            <div className="text-lg font-bold mt-1 font-mono">{agent.avgDuration}s</div>
          </div>
          <div className="rounded-lg border border-border bg-bg p-3">
            <div className="text-[10px] text-muted-fg uppercase flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Llamadas hoy
            </div>
            <div className="text-lg font-bold mt-1 font-mono">{agent.callsToday}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
