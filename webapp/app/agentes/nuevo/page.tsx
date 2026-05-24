"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Wand2, Edit3, Sparkles, ArrowRight, Bot, Send,
  CheckCircle2, ChevronRight, MessageSquare, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkillEditor } from "@/components/SkillEditor";
import { EMPTY_SKILL, SkillSpec } from "@/lib/data";
import { VoiceInput } from "@/components/VoiceInput";
import { useToast } from "@/components/ToastProvider";
import { cn } from "@/lib/utils";

type Mode = "choose" | "manual" | "creator";

export default function NuevoAgentePage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [creatorSpec, setCreatorSpec] = useState<SkillSpec | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/agentes">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Agentes</Button>
        </Link>
        <div className="text-muted-fg text-sm">/</div>
        <span className="text-sm font-medium">Crear nuevo agente</span>
      </div>

      {mode === "choose" && <ModeChooser onChoose={setMode} />}
      {mode === "manual" && (
        <SkillEditor
          initial={EMPTY_SKILL}
          isNew
          onSave={() => setMode("choose")}
          onCancel={() => setMode("choose")}
        />
      )}
      {mode === "creator" && !creatorSpec && (
        <SkillCreatorWizard
          onComplete={(spec) => setCreatorSpec(spec)}
          onCancel={() => setMode("choose")}
        />
      )}
      {mode === "creator" && creatorSpec && (
        <SkillEditor
          initial={creatorSpec}
          isNew
          onSave={() => {
            setCreatorSpec(null);
            setMode("choose");
          }}
          onCancel={() => setCreatorSpec(null)}
        />
      )}
    </div>
  );
}

function ModeChooser({ onChoose }: { onChoose: (m: Mode) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">¿Cómo quieres crear el agente?</h1>
        <p className="text-sm text-muted-fg mt-1 max-w-2xl">
          Puedes rellenar la plantilla 7-bloques tú mismo, o dejar que <code className="font-mono text-naturgy-orange-500">@skill-creator</code> te
          entreviste y la genere por ti.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => onChoose("manual")}
          className="text-left rounded-xl border border-border bg-card hover:border-naturgy-orange-500 transition-all p-6 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-naturgy-blue-500/5 rounded-full blur-3xl group-hover:bg-naturgy-blue-500/15 transition-all" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-naturgy-blue-500 flex items-center justify-center text-white">
                <Edit3 className="w-6 h-6" />
              </div>
              <Badge variant="outline">Modo manual</Badge>
            </div>
            <h3 className="font-semibold text-lg">Editor de plantilla</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              Rellenas tú los 7 bloques canónicos (Identidad, Misión, Reglas críticas, Entregables, Workflow,
              KPIs, Estilo) con su preview en directo del SKILL.md.
            </p>
            <div className="text-xs flex items-center gap-2 text-naturgy-blue-500 pt-2">
              <ChevronRight className="w-4 h-4" /> Para ti si ya sabes qué quieres
            </div>
          </div>
        </button>

        <button
          onClick={() => onChoose("creator")}
          className="text-left rounded-xl border-2 border-naturgy-orange-500/40 bg-card hover:border-naturgy-orange-500 transition-all p-6 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-naturgy-orange-500/10 rounded-full blur-3xl group-hover:bg-naturgy-orange-500/25 transition-all" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center text-white shadow-lg">
                <Wand2 className="w-6 h-6" />
              </div>
              <Badge variant="primary"><Sparkles className="w-2.5 h-2.5" /> Recomendado</Badge>
            </div>
            <h3 className="font-semibold text-lg">
              Asistido por <code className="font-mono text-naturgy-orange-500">@skill-creator</code>
            </h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              Un meta-agente te entrevista en 5 preguntas, infiere lo que falta y rellena la plantilla por ti.
              Tú revisas y ajustas antes de aprobar.
            </p>
            <div className="text-xs flex items-center gap-2 text-naturgy-orange-500 pt-2">
              <ChevronRight className="w-4 h-4" /> Para ti si quieres ir rápido
            </div>
          </div>
        </button>
      </div>

      {/* Tips */}
      <Card className="bg-naturgy-orange-500/5 border-naturgy-orange-500/30">
        <CardContent className="p-5">
          <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-naturgy-orange-500" />
            Antes de crear un nuevo agente, pregúntate...
          </h4>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            {[
              { q: "¿Hace algo que ya hace otro?", a: "Si solapa con @cyber, @qa, @review… mejor añadir sub-agente." },
              { q: "¿Es transversal o vertical?", a: "Transversal (como @reality, @self-improve) o de fase específica del SDLC." },
              { q: "¿Tiene KPIs medibles?", a: "Sin KPIs, @self-improve no podrá mejorarlo. Defínelos antes." },
            ].map((t, i) => (
              <div key={i} className="rounded-md border border-border bg-card p-3">
                <div className="font-semibold text-fg mb-1">{t.q}</div>
                <div className="text-muted-fg">{t.a}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------- Wizard conversacional @skill-creator ----------------

interface WizardStep {
  question: string;
  hint?: string;
  placeholder: string;
  field: keyof SkillSpec | "_combined_subagents" | "_combined_kpis";
}

const WIZARD_STEPS: WizardStep[] = [
  {
    question: "¿Qué problema resuelve este nuevo agente?",
    hint: "Una descripción corta. No te preocupes por la forma — yo la formateo después.",
    placeholder: "Ej: queremos un agente que revise contratos con proveedores y detecte cláusulas leoninas o no estándar...",
    field: "mission",
  },
  {
    question: "¿Cómo deberíamos llamarlo? Comando + nombre técnico",
    hint: "Comando empieza por @, nombre acaba en 'Agent'. Ej: @contract-reviewer + ContractReviewerAgent",
    placeholder: "@contract-reviewer · ContractReviewerAgent",
    field: "cmd",
  },
  {
    question: "¿Qué reglas innegociables debe seguir?",
    hint: "Lo que NUNCA debe hacer, o lo que SIEMPRE debe validar. Una por línea.",
    placeholder: "NUNCA aprueba un contrato con cláusulas leoninas.\nSIEMPRE consulta a @legal si encuentra términos GDPR no estándar.",
    field: "criticalRules",
  },
  {
    question: "¿Qué entrega? ¿Qué artefactos produce?",
    hint: "Un fichero, un report, un audit... lo que sea concreto y comprobable.",
    placeholder: "CONTRACT-REVIEW-{fecha}.md con lista de hallazgos clasificados",
    field: "deliverables",
  },
  {
    question: "¿Cómo medirías que funciona bien? (KPIs)",
    hint: "2-3 métricas. Formato: nombre · objetivo",
    placeholder: "kpi_clausulas_problematicas_detectadas · objetivo: > 95% de las marcadas por humano",
    field: "_combined_kpis",
  },
];

function SkillCreatorWizard({
  onComplete,
  onCancel,
}: {
  onComplete: (spec: SkillSpec) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(WIZARD_STEPS.length).fill(""));
  const [thinking, setThinking] = useState(false);
  const toast = useToast();

  const current = WIZARD_STEPS[step];
  const progress = ((step + 1) / WIZARD_STEPS.length) * 100;

  function next() {
    if (!answers[step].trim()) {
      toast({ kind: "warning", title: "Necesito una respuesta", description: "Aunque sea breve, ayúdame con esta" });
      return;
    }
    if (step < WIZARD_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function finish() {
    setThinking(true);

    // Simulamos "razonamiento" del skill-creator
    setTimeout(() => {
      // Inferimos comando y nombre del campo combinado
      const cmdRaw = answers[1].trim();
      const cmdMatch = cmdRaw.match(/(@[a-z0-9-]+)/i);
      const nameMatch = cmdRaw.match(/([A-Z][A-Za-z]+Agent)/);
      const cmd = cmdMatch?.[1] ?? "@new-agent";
      const name = nameMatch?.[1] ?? "NewAgent";

      const kpisParsed = answers[4]
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split(/·|:|->|—/);
          return {
            name: (parts[0] ?? "kpi_nuevo").trim().replace(/\s+/g, "_").toLowerCase(),
            target: (parts.slice(1).join(":") || "definir").trim(),
          };
        });

      const spec: SkillSpec = {
        num: "19",
        cmd,
        name,
        version: "1.0",
        sources: "Generado por @skill-creator · entrevista de 5 fases",
        identity: `Especialista del dominio descrito en la entrevista. ${answers[0].split(".")[0]}.`,
        mission: answers[0],
        criticalRules: answers[2].split("\n").map((s) => s.trim()).filter(Boolean),
        deliverables: answers[3].split("\n").map((s) => s.trim()).filter(Boolean),
        workflow: [
          "Lee BLUEPRINT.md y contexto relevante",
          "Aplica las reglas críticas declaradas",
          "Genera los entregables declarados",
          "Reporta KPIs al cierre a @self-improve",
        ],
        subagents: [],
        kpis: kpisParsed.length > 0 ? kpisParsed : [{ name: "kpi_pendiente", target: "definir" }],
        communicationStyle:
          "Tono profesional, conciso, en español. Cita siempre fuentes y evidencias concretas. Distingue 'opinión' de 'dato'.",
        handoffFrom: "Pendiente de definir según playbook",
        handoffTo: "Pendiente de definir según playbook",
        hooks: [],
        realityChecker: true,
      };

      setThinking(false);
      onComplete(spec);
      toast({
        kind: "success",
        title: "@skill-creator ha generado el borrador",
        description: "Revísalo y ajústalo antes de aprobar la creación del SKILL",
      });
    }, 2500);
  }

  if (thinking) {
    return (
      <Card className="border-naturgy-orange-500/40 animate-fade-in">
        <CardContent className="p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center mx-auto agent-pulse">
            <Wand2 className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="font-semibold text-lg">
            <code className="font-mono text-naturgy-orange-500">@skill-creator</code> razonando...
          </h3>
          <p className="text-sm text-muted-fg max-w-md mx-auto">
            Cruzando tus respuestas con el catálogo actual de SKILLs, building blocks y plantilla canónica de 7
            bloques. Detecta solapamientos, infiere KPIs faltantes y propone un primer borrador.
          </p>
          <div className="flex flex-col gap-2 max-w-sm mx-auto pt-2 text-left">
            {[
              "Buscando solapamientos con 18 agentes existentes",
              "Inferiendo handoffs probables",
              "Mapeando a building blocks reutilizables",
              "Generando borrador del SKILL.md",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs animate-slide-up" style={{ animationDelay: `${i * 400}ms` }}>
                <Loader2 className="w-3.5 h-3.5 text-naturgy-orange-500 animate-spin" />
                {s}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-naturgy-orange-500/40">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary">@skill-creator</Badge>
                <Badge variant="ghost">META · #18</Badge>
              </div>
              <CardTitle className="mt-1">Wizard de creación de SKILLs</CardTitle>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>✕ Salir</Button>
        </div>
        {/* Stepper */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-fg mb-2">
            <span>Pregunta {step + 1} de {WIZARD_STEPS.length}</span>
            <span className="font-mono">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-naturgy-orange-500 to-naturgy-orange-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Conversación previa */}
        {step > 0 && (
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border-l-2 border-naturgy-orange-500/30 pl-4">
            {WIZARD_STEPS.slice(0, step).map((s, i) => (
              <div key={i} className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <div className="text-xs text-naturgy-orange-500 font-mono">@skill-creator</div>
                <div className="text-sm">{s.question}</div>
                <div className="text-xs bg-muted px-3 py-2 rounded-md italic">{answers[i]}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pregunta actual */}
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <Bot className="w-5 h-5 text-naturgy-orange-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">{current.question}</div>
              {current.hint && <div className="text-xs text-muted-fg mt-1">{current.hint}</div>}
            </div>
          </div>
          <div className="relative">
            <textarea
              value={answers[step]}
              onChange={(e) => {
                const next = [...answers];
                next[step] = e.target.value;
                setAnswers(next);
              }}
              placeholder={current.placeholder}
              className="w-full min-h-[120px] p-3 pr-14 rounded-md border border-border bg-bg text-sm placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <div className="absolute top-3 right-3">
              <VoiceInput
                value={answers[step]}
                onChange={(v) => {
                  const next = [...answers];
                  next[step] = v;
                  setAnswers(next);
                }}
                title="Dictar respuesta"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-border">
          <Button
            variant="secondary"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ← Anterior
          </Button>
          <div className="text-[11px] text-muted-fg">
            Puedes dejar respuestas cortas, yo las completo.
          </div>
          <Button onClick={next}>
            {step === WIZARD_STEPS.length - 1 ? (
              <><Sparkles className="w-4 h-4" /> Generar SKILL</>
            ) : (
              <>Siguiente <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
