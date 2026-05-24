"use client";

import { useState } from "react";
import {
  Sparkles, ArrowUp, ArrowDown, MessageSquare, CheckCircle2, X,
  TrendingUp, Lightbulb, Send, ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SUGGESTIONS, ROLES } from "@/lib/data";
import { VoiceInput } from "@/components/VoiceInput";
import { useToast } from "@/components/ToastProvider";

const STATUS_VARIANT = {
  proposed: "ghost",
  approved: "primary",
  applied: "success",
  rejected: "danger",
} as const;

export default function MejoraPage() {
  const [selected, setSelected] = useState<string | null>(SUGGESTIONS[0].id);
  const current = SUGGESTIONS.find((s) => s.id === selected) || SUGGESTIONS[0];
  const [feedback, setFeedback] = useState("");
  const toast = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary"><Sparkles className="w-3 h-3" /> @self-improve</Badge>
            <Badge variant="ghost">Análisis continuo · cada cierre de proyecto</Badge>
          </div>
          <h1 className="text-2xl font-bold">Auto-mejora</h1>
          <p className="text-sm text-muted-fg mt-1 max-w-2xl">
            La Factoría aprende de cada proyecto. Detecta patrones, lee feedback de usuarios y propone mejoras
            concretas a sus propios agentes. Tú apruebas, ella aplica.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="text-right">
            <div className="text-xs text-muted-fg">Mejora neta KPIs últimos 30d</div>
            <div className="text-2xl font-bold text-naturgy-success">+12%</div>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Sugerencias activas", value: SUGGESTIONS.filter(s => s.status === "proposed").length, accent: "orange" },
          { label: "Aprobadas (en backlog)", value: SUGGESTIONS.filter(s => s.status === "approved").length, accent: "blue" },
          { label: "Aplicadas este mes", value: 7, accent: "green" },
          { label: "Lecciones acumuladas", value: 142, accent: "violet" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-fg">{s.label}</div>
              <div className="text-2xl font-bold mt-1">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase text-muted-fg">Sugerencias detectadas</h2>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`w-full text-left rounded-lg border bg-card p-4 transition-all ${
                selected === s.id
                  ? "border-naturgy-orange-500 ring-1 ring-naturgy-orange-500/30"
                  : "border-border hover:border-naturgy-orange-500"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] text-muted-fg">{s.id}</span>
                <Badge variant={STATUS_VARIANT[s.status]}>{s.status}</Badge>
              </div>
              <h3 className="font-semibold text-sm leading-snug">{s.title}</h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-fg">
                  <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3 text-naturgy-success" />{s.votes.up}</span>
                  <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3" />{s.votes.down}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{s.comments.length}</span>
                </div>
                <span className="text-naturgy-orange-500 font-mono text-[10px]">{s.expectedDelta}</span>
              </div>
            </button>
          ))}

          {/* Add new */}
          <div className="rounded-lg border border-dashed border-border p-4 bg-bg">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
              <Lightbulb className="w-4 h-4 text-naturgy-orange-500" />
              ¿Una idea de mejora?
            </div>
            <p className="text-xs text-muted-fg mb-2">Compártela. Pasa a la cola, @self-improve la analiza con histórico y la propone.</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ej: 'el @architect debería preguntar siempre el tipo de auth desde el principio porque siempre lo cambiamos en la iteración 3'"
              className="w-full text-xs p-2 rounded-md border border-border bg-card focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              rows={3}
            />
            <div className="flex justify-between mt-2">
              <VoiceInput value={feedback} onChange={setFeedback} size="sm" title="Dictar feedback" />
              <Button
                size="sm"
                disabled={!feedback.trim()}
                onClick={() => {
                  toast({
                    kind: "success",
                    title: "Feedback enviado",
                    description: "@self-improve lo cruzará con histórico y propondrá una sugerencia si encaja",
                  });
                  setFeedback("");
                }}
              >
                <Send className="w-3 h-3" /> Enviar
              </Button>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-naturgy-orange-500/40">
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">{current.id}</Badge>
                    <Badge variant={STATUS_VARIANT[current.status]}>{current.status}</Badge>
                  </div>
                  <CardTitle>{current.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {current.status === "proposed" && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          toast({
                            kind: "info",
                            title: "Sugerencia rechazada",
                            description: `${current.id} archivada con motivo`,
                          })
                        }
                      >
                        <X className="w-3.5 h-3.5" /> Rechazar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            kind: "success",
                            title: "Sugerencia aprobada",
                            description: `${current.id} pasa al backlog · @self-improve preparará diff`,
                          })
                        }
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
                      </Button>
                    </>
                  )}
                  {current.status === "approved" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        toast({
                          kind: "success",
                          title: "Aplicando mejora",
                          description: "Commit en .skills/ con diff propuesto · push tras tu visto bueno",
                        })
                      }
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Aplicar ahora
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-fg mb-1">Razón</h4>
                <p className="text-sm leading-relaxed">{current.rationale}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-bg p-3">
                  <div className="text-[10px] text-muted-fg uppercase">KPI a mejorar</div>
                  <div className="font-mono text-sm font-semibold mt-1 text-naturgy-orange-500">{current.impactKPI}</div>
                </div>
                <div className="rounded-lg border border-border bg-bg p-3">
                  <div className="text-[10px] text-muted-fg uppercase">Mejora esperada</div>
                  <div className="text-sm font-semibold mt-1 text-naturgy-success flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {current.expectedDelta}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-fg mb-2">Evidencia (eventos reales)</h4>
                <div className="space-y-1">
                  {current.evidence.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono p-2 rounded-md bg-bg border border-border">
                      <ChevronRight className="w-3 h-3 text-naturgy-orange-500" />
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-fg mb-2 flex items-center justify-between">
                  Comentarios de la organización
                  <span className="font-normal text-[11px]">
                    👍 {current.votes.up} · 👎 {current.votes.down}
                  </span>
                </h4>
                <div className="space-y-2">
                  {current.comments.map((c, i) => {
                    const role = ROLES[c.role];
                    return (
                      <div key={i} className="rounded-lg border border-border bg-bg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-naturgy-orange-500 text-white text-[10px] font-semibold flex items-center justify-center">
                            {c.author.split(" ").map((w) => w[0]).join("")}
                          </div>
                          <span className="text-xs font-semibold">{c.author}</span>
                          <Badge variant="ghost" className="text-[10px]">{role.label}</Badge>
                          <span className="text-[10px] text-muted-fg ml-auto">{c.ts}</span>
                        </div>
                        <p className="text-xs text-fg/90 leading-relaxed">{c.text}</p>
                      </div>
                    );
                  })}

                  {/* New comment */}
                  <div className="flex gap-2 pt-2">
                    <input
                      placeholder="Aporta tu punto de vista..."
                      className="flex-1 h-9 px-3 rounded-md border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <Button size="sm" variant="secondary">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cómo funciona */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-naturgy-orange-500" />
                Cómo aprende la Factoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                {[
                  { t: "Lee KPIs de cada SKILL", d: "Tras cada proyecto, @self-improve agrega métricas y compara con histórico." },
                  { t: "Cruza con feedback humano", d: "Tus comentarios y los de POs / DOs alimentan el contexto." },
                  { t: "Detecta patrones recurrentes", d: "Mismo problema en 3+ proyectos → propuesta automática de mejora." },
                  { t: "Propone, NO aplica solo", d: "Cada cambio en un SKILL requiere aprobación humana (regla R9)." },
                ].map((step, i) => (
                  <div key={i} className="rounded-lg border border-border bg-bg p-3">
                    <div className="flex items-center gap-2 font-semibold text-fg mb-1">
                      <span className="w-5 h-5 rounded-full bg-naturgy-orange-500 text-white text-[10px] flex items-center justify-center">{i + 1}</span>
                      {step.t}
                    </div>
                    <p className="text-muted-fg leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
