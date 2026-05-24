"use client";

import { useState } from "react";
import {
  Save, X, Plus, Trash2, FileCode2, AlertTriangle, CheckCircle2,
  Eye, Edit3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkillSpec } from "@/lib/data";
import { useToast } from "@/components/ToastProvider";

export interface SkillEditorProps {
  initial: SkillSpec;
  /** true si es un agente nuevo (cambia textos y validación) */
  isNew?: boolean;
  onSave?: (spec: SkillSpec) => void;
  onCancel?: () => void;
}

export function SkillEditor({ initial, isNew = false, onSave, onCancel }: SkillEditorProps) {
  const [spec, setSpec] = useState<SkillSpec>(initial);
  const [previewMode, setPreviewMode] = useState(false);
  const toast = useToast();

  const update = <K extends keyof SkillSpec>(key: K, value: SkillSpec[K]) =>
    setSpec((s) => ({ ...s, [key]: value }));

  function save() {
    // Validación mínima
    if (!spec.cmd.trim() || !spec.name.trim() || !spec.identity.trim() || !spec.mission.trim()) {
      toast({
        kind: "warning",
        title: "Faltan campos obligatorios",
        description: "Comando, nombre, identidad y misión son obligatorios",
      });
      return;
    }
    onSave?.(spec);
    toast({
      kind: "success",
      title: isNew ? "Agente creado" : "Cambios guardados",
      description: `${spec.cmd} → commit a .skills/${spec.num}-${spec.cmd.slice(1)}/SKILL.md`,
    });
  }

  return (
    <Card className="border-naturgy-orange-500">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="primary">{isNew ? "Nuevo agente" : "Editando agente"}</Badge>
              <Badge variant="ghost">v{spec.version}</Badge>
              {!previewMode && <Badge variant="warning"><Edit3 className="w-2.5 h-2.5" /> editor</Badge>}
              {previewMode && <Badge variant="success"><Eye className="w-2.5 h-2.5" /> preview SKILL.md</Badge>}
            </div>
            <CardTitle>
              {isNew ? "Definir un nuevo SKILL" : `Editando ${spec.cmd}`}
            </CardTitle>
            <p className="text-xs text-muted-fg mt-1">
              Plantilla canónica de 7 bloques. Los cambios se commitean a{" "}
              <code className="font-mono">.skills/{spec.num}-{spec.cmd.slice(1) || "nuevo"}/SKILL.md</code> tras
              aprobación humana.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setPreviewMode((p) => !p)}>
              {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {previewMode ? "Editar" : "Vista previa"}
            </Button>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              <X className="w-3.5 h-3.5" /> Cancelar
            </Button>
            <Button size="sm" onClick={save}>
              <Save className="w-3.5 h-3.5" /> {isNew ? "Crear SKILL" : "Guardar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {previewMode ? <Preview spec={spec} /> : <EditForm spec={spec} update={update} setSpec={setSpec} />}
      </CardContent>
    </Card>
  );
}

function EditForm({
  spec,
  update,
  setSpec,
}: {
  spec: SkillSpec;
  update: <K extends keyof SkillSpec>(key: K, value: SkillSpec[K]) => void;
  setSpec: React.Dispatch<React.SetStateAction<SkillSpec>>;
}) {
  return (
    <div className="space-y-5">
      {/* Identidad básica */}
      <Section title="Identidad básica">
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Número (orden)">
            <input
              value={spec.num}
              onChange={(e) => update("num", e.target.value)}
              placeholder="19"
              className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
          <Field label="Comando" required>
            <input
              value={spec.cmd}
              onChange={(e) => update("cmd", e.target.value)}
              placeholder="@nuevo-skill"
              className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
          <Field label="Versión">
            <input
              value={spec.version}
              onChange={(e) => update("version", e.target.value)}
              placeholder="1.0"
              className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
        </div>
        <Field label="Nombre del agente" required>
          <input
            value={spec.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="NewSkillAgent"
            className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </Field>
        <Field label="Fuentes / inspiración">
          <input
            value={spec.sources}
            onChange={(e) => update("sources", e.target.value)}
            placeholder="ej: Agency-agents · Trifecta Perfecta · práctica interna Naturgy"
            className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </Field>
      </Section>

      <Section title="1. Identidad" hint="Quién es el agente, qué experiencia simula, tono">
        <TextArea value={spec.identity} onChange={(v) => update("identity", v)} placeholder="Especialista en..." required />
      </Section>

      <Section title="2. Misión" hint="Una frase con el objetivo. Qué entra y qué sale">
        <TextArea value={spec.mission} onChange={(v) => update("mission", v)} placeholder="Recibe X → entrega Y" required />
      </Section>

      <Section title="3. Reglas Críticas (innegociables)">
        <ListField items={spec.criticalRules} onChange={(v) => update("criticalRules", v)} placeholder="Regla sagrada..." />
      </Section>

      <Section title="4. Entregables Técnicos">
        <ListField items={spec.deliverables} onChange={(v) => update("deliverables", v)} placeholder="archivo.md → ubicación" />
      </Section>

      <Section title="5. Workflow" hint="Pasos numerados. Si hay sub-agentes paralelos, declararlos aparte">
        <ListField items={spec.workflow} onChange={(v) => update("workflow", v)} placeholder="Lee X · ejecuta Y · entrega Z" />
        <div className="mt-3">
          <label className="text-xs font-semibold uppercase text-muted-fg block mb-1.5">
            Sub-agentes paralelos (opcional)
          </label>
          <input
            value={(spec.subagents ?? []).join(", ")}
            onChange={(e) =>
              update(
                "subagents",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder="UIBuilder, ComponentLibrarian, CSSArchitect..."
            className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </Section>

      <Section title="6. Métricas de Éxito (KPIs)">
        <div className="space-y-2">
          {spec.kpis.map((k, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input
                value={k.name}
                onChange={(e) => {
                  const next = [...spec.kpis];
                  next[i] = { ...k, name: e.target.value };
                  setSpec((s) => ({ ...s, kpis: next }));
                }}
                placeholder="kpi_tiempo"
                className="h-9 px-3 rounded-md border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                value={k.target}
                onChange={(e) => {
                  const next = [...spec.kpis];
                  next[i] = { ...k, target: e.target.value };
                  setSpec((s) => ({ ...s, kpis: next }));
                }}
                placeholder="< 5 min"
                className="h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSpec((s) => ({ ...s, kpis: s.kpis.filter((_, j) => j !== i) }));
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSpec((s) => ({ ...s, kpis: [...s.kpis, { name: "", target: "" }] }))}
          >
            <Plus className="w-3.5 h-3.5" /> Añadir KPI
          </Button>
        </div>
      </Section>

      <Section title="7. Estilo de Comunicación">
        <TextArea
          value={spec.communicationStyle}
          onChange={(v) => update("communicationStyle", v)}
          placeholder="Tono con el usuario · formato de respuesta · qué pregunta proactivamente..."
        />
      </Section>

      <Section title="Handoff" hint="Cómo encaja en el flujo">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Recibe de">
            <input
              value={spec.handoffFrom}
              onChange={(e) => update("handoffFrom", e.target.value)}
              placeholder="@architect (con BLUEPRINT)"
              className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
          <Field label="Entrega a">
            <input
              value={spec.handoffTo}
              onChange={(e) => update("handoffTo", e.target.value)}
              placeholder="@cyber, @qa"
              className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </Field>
        </div>
        <Field label="Hooks que dispara">
          <input
            value={spec.hooks.join(", ")}
            onChange={(e) =>
              update(
                "hooks",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder="post-build, pre-deploy"
            className="w-full h-9 px-3 rounded-md border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </Field>
        <label className="flex items-center gap-2 text-xs cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={spec.realityChecker}
            onChange={(e) => update("realityChecker", e.target.checked)}
            className="accent-naturgy-orange-500"
          />
          <span>
            Requiere <strong>Reality Checker</strong> antes de aceptar handoff (recomendado)
          </span>
        </label>
      </Section>
    </div>
  );
}

function Preview({ spec }: { spec: SkillSpec }) {
  return (
    <pre className="rounded-lg border border-border bg-bg p-4 overflow-x-auto text-xs font-mono leading-relaxed">
{`# SKILL · ${spec.name || "(sin nombre)"}
**Agente:** ${spec.name || "Agent"} | **Cmd:** \`${spec.cmd || "@cmd"}\` | **v${spec.version || "1.0"}**
${spec.sources ? `**Fuentes:** ${spec.sources}\n` : ""}
## 1. Identidad
${spec.identity || "(pendiente)"}

## 2. Misión
${spec.mission || "(pendiente)"}

## 3. Reglas Críticas
${spec.criticalRules.filter(Boolean).map((r) => `- ${r}`).join("\n") || "- (pendiente)"}

## 4. Entregables Técnicos
${spec.deliverables.filter(Boolean).map((d) => `- ${d}`).join("\n") || "- (pendiente)"}

## 5. Workflow
${spec.workflow.filter(Boolean).map((w, i) => `${i + 1}. ${w}`).join("\n") || "(pendiente)"}
${spec.subagents && spec.subagents.length > 0 ? `\n**Sub-agentes paralelos:**\n${spec.subagents.map((s) => `- ${s}`).join("\n")}` : ""}

## 6. Métricas de Éxito
${spec.kpis.filter((k) => k.name).map((k) => `- \`${k.name}\`: ${k.target}`).join("\n") || "- (pendiente)"}

## 7. Estilo de Comunicación
${spec.communicationStyle || "(pendiente)"}

## Handoff
- **Recibe de:** ${spec.handoffFrom || "(pendiente)"}
- **Entrega a:** ${spec.handoffTo || "(pendiente)"}
- **Hooks:** ${spec.hooks.join(", ") || "(ninguno)"}
- **Reality Checker:** ${spec.realityChecker ? "sí" : "no"}`}
    </pre>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      {hint && <p className="text-[11px] text-muted-fg mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <label className="text-[10px] font-semibold uppercase text-muted-fg block mb-1">
        {label}{required && <span className="text-naturgy-orange-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full min-h-[80px] p-3 rounded-md border border-border bg-bg text-sm placeholder:text-muted-fg focus:outline-none focus:ring-1 focus:ring-ring resize-y"
    />
  );
}

function ListField({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-1 h-9 px-3 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus className="w-3.5 h-3.5" /> Añadir
      </Button>
    </div>
  );
}
