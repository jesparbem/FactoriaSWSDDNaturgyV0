"use client";

import { useState } from "react";
import {
  Search, Paintbrush, Users, ArrowRight, Sparkles, Mic, Upload,
  FileCode2, Activity, ChevronRight, CheckCircle2, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SPECS_EXTRACTION_METHODS } from "@/lib/data";
import { VoiceInput } from "@/components/VoiceInput";
import { useToast } from "@/components/ToastProvider";
import { FeatureCanvas } from "@/components/FeatureCanvas";

const iconMap = { Search, Paintbrush, Users } as const;

export default function ProcesosPage() {
  const [method, setMethod] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Procesos de Negocio</h1>
          <p className="text-sm text-muted-fg mt-1">
            De idea a especificación funcional. Elige cómo arrancas y la Factoría hace el resto.
          </p>
        </div>
        <Badge variant="ghost" className="text-xs">
          Basado en <span className="font-mono text-naturgy-orange-500 ml-1">OpenSpec</span> · YAML versionado en GitHub
        </Badge>
      </div>

      {/* 3 methods */}
      {!method && (
        <div>
          <h2 className="text-base font-semibold mb-3">¿Cómo quieres definir las especificaciones?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SPECS_EXTRACTION_METHODS.map((m, i) => {
              const Icon = iconMap[m.icon as keyof typeof iconMap];
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="text-left rounded-xl border border-border bg-card hover:border-naturgy-orange-500 transition-all p-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-naturgy-orange-500/5 rounded-full blur-3xl group-hover:bg-naturgy-orange-500/15 transition-all" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="font-mono">{`Vía ${i + 1}`}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{m.title}</h3>
                    <p className="text-xs text-naturgy-orange-500 mt-1">{m.subtitle}</p>
                    <p className="text-sm text-muted-fg mt-3 leading-relaxed min-h-[60px]">{m.description}</p>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {m.inputs.map((input) => (
                            <span key={input} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-fg">
                              {input}
                            </span>
                          ))}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-fg group-hover:text-naturgy-orange-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-[11px] text-muted-fg mt-2">
                        <strong className="text-fg">Mejor para:</strong> {m.bestFor}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Method workflow */}
      {method === "process-detailed" && (
        <ProcessDetailedFlow step={step} setStep={setStep} onBack={() => { setMethod(null); setStep(0); }} />
      )}
      {method === "existing-app" && (
        <ExistingAppFlow onBack={() => { setMethod(null); setStep(0); }} />
      )}
      {method === "vibe-coding" && (
        <VibeCodingFlow onBack={() => { setMethod(null); setStep(0); }} />
      )}

      {/* Recent processes */}
      {!method && (
        <Card>
          <CardHeader>
            <CardTitle>Procesos recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: "Aprobaciones de compras > 50k€", owner: "Marta L.", date: "hace 2 días", status: "spec", method: "process-detailed" },
              { name: "Lectura contadores OCR", owner: "Iván B.", date: "hace 5 días", status: "deployed", method: "vibe-coding" },
              { name: "Onboarding técnico campo", owner: "Iván B.", date: "hace 1 semana", status: "build", method: "process-detailed" },
              { name: "Migración portal proveedores", owner: "Marta L.", date: "hace 2 semanas", status: "review", method: "existing-app" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg hover:border-naturgy-orange-500 transition-all">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <FileCode2 className="w-4 h-4 text-muted-fg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-fg">
                    {p.owner} · {p.date} · <span className="font-mono">{p.method}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    p.status === "deployed" ? "success" :
                    p.status === "build" ? "primary" :
                    p.status === "review" ? "warning" : "ghost"
                  }
                >
                  {p.status}
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-fg" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- Flow 3: Process detailed + AI (con dictado) ---
function ProcessDetailedFlow({ step, setStep, onBack }: { step: number; setStep: (n: number) => void; onBack: () => void }) {
  const steps = ["Describe", "IA analiza", "Canvas de aprobaciones", "Construcción"];
  const [text, setText] = useState("");
  const [showYaml, setShowYaml] = useState(false);
  const toast = useToast();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="primary">Vía 3 · Proceso detallado + IA</Badge>
            <CardTitle className="mt-2">Define tu proceso de negocio</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>← Cambiar vía</Button>
        </div>
        {/* Stepper */}
        <div className="flex items-center gap-2 mt-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                i < step ? "bg-naturgy-success text-white" :
                i === step ? "bg-naturgy-orange-500 text-white" :
                "bg-muted text-muted-fg"
              }`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-naturgy-success" : "bg-border"} ${i === steps.length - 1 ? "hidden" : ""}`} />
              <div className={`text-xs ${i === step ? "text-fg font-semibold" : "text-muted-fg"} mr-2 hidden md:block`}>{s}</div>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ejemplo: Quiero un proceso para que cualquier empleado pueda solicitar una compra de hasta 50.000€. Debe pasar por aprobación del jefe directo, validación del responsable de presupuesto del departamento, y finalmente enviarse a SAP MM para crear el pedido. Si el importe es >10k€, debe pasar también por compliance..."
                className="w-full min-h-[200px] p-4 pr-14 rounded-lg border border-border bg-bg text-sm placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              <div className="absolute top-3 right-3">
                <VoiceInput value={text} onChange={setText} title="Dictar proceso (es-ES)" />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="secondary" size="sm">
                <Upload className="w-3.5 h-3.5" /> Adjuntar documento
              </Button>
              <Badge variant="ghost" className="ml-auto">{text.length} caracteres · auto-guardado</Badge>
            </div>
            <div className="flex justify-end">
              <Button
                disabled={!text.trim()}
                onClick={() => {
                  setStep(1);
                  toast({
                    kind: "info",
                    title: "@architect analizando",
                    description: "Identificando actores, fases, entidades e integraciones...",
                  });
                  setTimeout(() => setStep(2), 3000);
                }}
              >
                <Sparkles className="w-4 h-4" /> Analizar con IA
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center agent-pulse">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">@architect está analizando tu proceso</h3>
                <p className="text-sm text-muted-fg mt-1">Identificando actores, fases, entidades e integraciones...</p>
              </div>
              <div className="w-full max-w-md space-y-2 text-left">
                {["Clasifica arquetipo: app-interna-corporativa", "Detecta 4 actores (solicitante, jefe, presupuesto, compliance)", "Identifica 3 entidades (Solicitud, Aprobación, PedidoSAP)", "Localiza 2 integraciones (SAP MM, Workflow Engine)"].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-fg animate-slide-up" style={{ animationDelay: `${i * 200}ms` }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-naturgy-success" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(2)} className="mt-4">
                Ver specs generadas <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary">SPEC-2026-0142</Badge>
                <Badge variant="ghost">v0.1 · 6 funcionalidades extraídas</Badge>
                <Badge variant="success">@reality PASS</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowYaml((s) => !s)}>
                  <FileCode2 className="w-3.5 h-3.5" /> {showYaml ? "Ocultar YAML" : "Ver YAML"}
                </Button>
                <Button variant="secondary" size="sm">
                  <ArrowRight className="w-3.5 h-3.5" /> Ver en GitHub
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-fg">
              La IA ha troceado tu proceso en funcionalidades aprobables por separado. Cada tarjeta necesita el visto
              bueno de los roles correspondientes (Process Owner / Domain Owner / Product Owner / Compliance) antes
              de entrar en construcción. Puedes aprobar, pedir cambios o rechazar cada una.
            </p>

            {showYaml && (
              <details open className="rounded-lg border border-border bg-bg overflow-hidden animate-fade-in">
                <summary className="cursor-pointer text-xs font-mono px-3 py-2 bg-muted border-b border-border">
                  spec.functional.yaml · auto-generado
                </summary>
                <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed">
{`spec_id: SPEC-2026-0142
spec_version: 0.1.0
title: Aprobaciones de compras > 50k€
archetype: app-interna-corporativa
domain: procurement
process_owner: marta.l@naturgy.com

actors: [solicitante, jefe_directo, responsable_presupuesto, compliance]
entities: [SolicitudCompra, Aprobacion, PedidoSAP]
integrations: [sap_mm (oauth2), azure_ad (oidc), teams_api]
features: 6
estimated_cost_eur: 203
estimated_hours: 64

acceptance_criteria:
  - "Solicitudes > 10k€ requieren compliance"
  - "Aprobación SLA: 48h máx por paso"
  - "Auditoría: cada acción queda registrada"`}
                </pre>
              </details>
            )}

            <FeatureCanvas
              onSubmit={() => {
                setStep(3);
                toast({
                  kind: "success",
                  title: "Specs publicadas en GitHub",
                  description: "SPEC-2026-0142 → repo specs-platform · enjambre AKS lanzado · 6 pods en cola",
                });
              }}
            />

            <div className="flex justify-start">
              <Button variant="secondary" onClick={() => setStep(0)}>
                ← Editar proceso
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-naturgy-success/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-naturgy-success" />
            </div>
            <h3 className="text-lg font-semibold">¡Enviado a construcción!</h3>
            <p className="text-sm text-muted-fg max-w-md mx-auto">
              <span className="font-mono">SPEC-2026-0142</span> publicada en{" "}
              <span className="font-mono text-naturgy-orange-500">specs-platform/apps/aprobaciones-compras/</span>.
              Las <strong className="text-fg">6 funcionalidades</strong> entran en el enjambre como pods independientes
              en AKS. Puedes seguir el progreso en vivo desde el Builder.
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Button variant="secondary" onClick={onBack}>Volver a procesos</Button>
              <a href="/builder">
                <Button>
                  <Activity className="w-4 h-4" /> Ver enjambre construyendo
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Flow 1: Existing app extraction ---
function ExistingAppFlow({ onBack }: { onBack: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="primary">Vía 1 · Extracción desde app existente</Badge>
            <CardTitle className="mt-2">Conecta tu repo y telemetría</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>← Cambiar vía</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-bg p-4 space-y-3">
            <h4 className="font-semibold text-sm">1. Conecta el repositorio</h4>
            <button className="w-full p-3 rounded-md border border-dashed border-border hover:border-naturgy-orange-500 hover:bg-naturgy-orange-500/5 transition-all text-left group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-naturgy-blue-900 flex items-center justify-center">
                  <FileCode2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">GitHub Enterprise</div>
                  <div className="text-[11px] text-muted-fg">naturgy/portal-aprobaciones-legacy</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-fg group-hover:text-naturgy-orange-500" />
              </div>
            </button>
            <button className="w-full p-3 rounded-md border border-dashed border-border hover:border-naturgy-orange-500 hover:bg-naturgy-orange-500/5 transition-all text-left group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                  <Upload className="w-4 h-4 text-muted-fg" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Subir ZIP</div>
                  <div className="text-[11px] text-muted-fg">App empaquetada · max 100MB</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-fg group-hover:text-naturgy-orange-500" />
              </div>
            </button>
          </div>

          <div className="rounded-lg border border-border bg-bg p-4 space-y-3">
            <h4 className="font-semibold text-sm">2. Adjunta telemetría (opcional pero recomendado)</h4>
            <p className="text-xs text-muted-fg">Logs, trazas y eventos enriquecen la extracción. Sin telemetría, los agentes IA solo verán código.</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 rounded-md border border-border hover:border-naturgy-orange-500 text-xs transition-all">
                <Activity className="w-4 h-4 mx-auto mb-1 text-naturgy-orange-500" />
                App Insights
              </button>
              <button className="p-3 rounded-md border border-border hover:border-naturgy-orange-500 text-xs transition-all">
                <FileCode2 className="w-4 h-4 mx-auto mb-1 text-naturgy-orange-500" />
                Logs JSON
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-naturgy-orange-500/30 bg-naturgy-orange-500/5 p-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-naturgy-orange-500" /> Lo que harán los agentes
          </h4>
          <div className="grid md:grid-cols-3 gap-3 mt-3 text-xs">
            <div>
              <Badge variant="ghost">@architect</Badge>
              <p className="text-muted-fg mt-1">Reconstruye BLUEPRINT inverso</p>
            </div>
            <div>
              <Badge variant="ghost">@review</Badge>
              <p className="text-muted-fg mt-1">Análisis exhaustivo del legacy</p>
            </div>
            <div>
              <Badge variant="ghost">@data</Badge>
              <p className="text-muted-fg mt-1">Extrae esquema y dependencias</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button disabled>
            <Sparkles className="w-4 h-4" /> Extraer specs (selecciona fuente primero)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Flow 2: Vibe Coding ---
function VibeCodingFlow({ onBack }: { onBack: () => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="primary">Vía 2 · Prototipado Vibe Coding</Badge>
            <CardTitle className="mt-2">Pinta tu app · de ahí salen las specs</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>← Cambiar vía</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-naturgy-orange-500/30 bg-naturgy-orange-500/5 p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center mx-auto">
            <Paintbrush className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-semibold">Abrir Rapid Prototyping</h3>
          <p className="text-sm text-muted-fg max-w-md mx-auto">
            El IDE de Vibe Coding permite construir un prototipo funcional rápido con datos sintéticos. Cuando el
            prototipo refleja el comportamiento deseado, los agentes extraen las specs automáticamente. No es código
            desplegable — es una herramienta de descubrimiento.
          </p>
          <a href="/prototyping">
            <Button className="mt-2">
              <Sparkles className="w-4 h-4" /> Ir al estudio de prototipos
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
