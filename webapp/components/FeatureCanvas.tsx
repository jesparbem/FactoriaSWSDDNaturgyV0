"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, X, MessageSquare, Users, Layers,
  Settings, Lightbulb, ChevronRight, Send, Eye, Code2,
  Database, Zap, GitBranch, FileCode2, Rocket, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useToast } from "@/components/ToastProvider";
import { cn } from "@/lib/utils";

type RoleId = "process-owner" | "domain-owner" | "product-owner" | "compliance";

const ROLE_INFO: Record<RoleId, { label: string; icon: typeof Users; color: string; short: string }> = {
  "process-owner":  { label: "Process Owner",  icon: Users,     color: "bg-naturgy-blue-500", short: "PO" },
  "domain-owner":   { label: "Domain Owner",   icon: Layers,    color: "bg-indigo-500",       short: "DO" },
  "product-owner":  { label: "Product Owner",  icon: Settings,  color: "bg-violet-500",       short: "PrO" },
  "compliance":     { label: "Compliance",     icon: AlertCircle, color: "bg-naturgy-orange-500", short: "C" },
};

type ApprovalStatus = "pending" | "approved" | "changes" | "rejected";

interface RoleApproval {
  role: RoleId;
  status: ApprovalStatus;
  by?: string;
  comment?: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  type: "ui" | "api" | "data" | "integration" | "workflow";
  entities: string[];
  integrations: string[];
  acceptance: string[];
  estimatedCostEur: number;
  estimatedHours: number;
  /** Roles requeridos para aprobar (en orden). Si no aplica, no se incluye. */
  approvals: RoleApproval[];
}

// Datos sintéticos: 6 funcionalidades extraídas de "Aprobaciones de compras > 50k€"
export const DEFAULT_FEATURES: FeatureCard[] = [
  {
    id: "F1",
    title: "Formulario de solicitud de compra",
    description: "Pantalla para que cualquier empleado registre una solicitud con campos: descripción, importe, departamento, urgencia, documento adjunto.",
    type: "ui",
    entities: ["SolicitudCompra"],
    integrations: ["azure_ad"],
    acceptance: [
      "Validación de importe (> 0, máx 50k€)",
      "Auto-detecta departamento desde Azure AD",
      "Adjuntar PDF hasta 10MB",
      "Borrador auto-guardado",
    ],
    estimatedCostEur: 18.20,
    estimatedHours: 6,
    approvals: [
      { role: "process-owner",  status: "approved",  by: "Marta L.",  comment: "OK, falta validar que urgencia tiene 3 niveles solamente" },
      { role: "product-owner",  status: "approved",  by: "Carlos M." },
    ],
  },
  {
    id: "F2",
    title: "Workflow de aprobación multinivel",
    description: "Lógica de routing: jefe directo → responsable de presupuesto → (si > 10k€) compliance. SLA de 48h por paso. Notificaciones por email + Teams.",
    type: "workflow",
    entities: ["SolicitudCompra", "Aprobacion"],
    integrations: ["azure_ad", "teams_api"],
    acceptance: [
      "Routing automático según importe y departamento",
      "Recordatorio a las 24h si SLA al 50%",
      "Escalado al manager+1 si SLA agotado",
      "Auditoría completa de cada decisión",
    ],
    estimatedCostEur: 42.50,
    estimatedHours: 14,
    approvals: [
      { role: "process-owner",  status: "approved",  by: "Marta L." },
      { role: "domain-owner",   status: "pending" },
      { role: "product-owner",  status: "pending" },
    ],
  },
  {
    id: "F3",
    title: "Compliance check para importes > 10k€",
    description: "Bifurcación del workflow: si importe supera umbral, se inyecta paso adicional con responsable de compliance. Documentación adicional requerida.",
    type: "workflow",
    entities: ["SolicitudCompra", "Aprobacion"],
    integrations: ["azure_ad"],
    acceptance: [
      "Umbral configurable (default 10k€)",
      "Solicita documentación complementaria (justificación, due diligence proveedor)",
      "Bloqueo si falta documentación al 90% del SLA",
    ],
    estimatedCostEur: 22.80,
    estimatedHours: 8,
    approvals: [
      { role: "process-owner",  status: "approved",  by: "Marta L." },
      { role: "compliance",     status: "changes",   by: "R. Vega",  comment: "Falta paso obligatorio de due diligence si proveedor es nuevo." },
      { role: "domain-owner",   status: "pending" },
    ],
  },
  {
    id: "F4",
    title: "Integración SAP MM (envío de pedido)",
    description: "Cliente OAuth2 service-to-service vía SAP BTP destination. Idempotencia con hash de solicitud. Reintentos con backoff. DLQ en caso de fallo definitivo.",
    type: "integration",
    entities: ["PedidoSAP", "SolicitudCompra"],
    integrations: ["sap_mm"],
    acceptance: [
      "Idempotencia (mismo input = mismo output)",
      "Circuit breaker si SAP cae",
      "Max 5 reintentos exponential backoff + jitter",
      "DLQ con alerta si > 3 fallos en 1h",
    ],
    estimatedCostEur: 56.40,
    estimatedHours: 18,
    approvals: [
      { role: "process-owner",  status: "approved",  by: "Marta L." },
      { role: "domain-owner",   status: "approved",  by: "Juan G." },
      { role: "product-owner",  status: "pending" },
    ],
  },
  {
    id: "F5",
    title: "API REST de consulta del estado",
    description: "Endpoints para que solicitante y aprobadores consulten estado de sus solicitudes. Filtros, paginación cursor-based, búsqueda.",
    type: "api",
    entities: ["SolicitudCompra", "Aprobacion"],
    integrations: ["azure_ad"],
    acceptance: [
      "GET /solicitudes filtrable por estado, fecha, departamento",
      "Cursor pagination · max 50/página",
      "Permisos: solicitante ve solo las suyas, jefe ve las de su equipo",
      "Latencia p95 < 200ms",
    ],
    estimatedCostEur: 34.90,
    estimatedHours: 10,
    approvals: [
      { role: "process-owner",  status: "approved",  by: "Marta L." },
      { role: "product-owner",  status: "approved",  by: "Carlos M." },
    ],
  },
  {
    id: "F6",
    title: "Modelo de datos + migraciones",
    description: "3 tablas (SolicitudCompra, Aprobacion, PedidoSAP) en SQL Server con índices, soft delete, audit log en tabla aparte, migraciones versionadas.",
    type: "data",
    entities: ["SolicitudCompra", "Aprobacion", "PedidoSAP"],
    integrations: [],
    acceptance: [
      "Migraciones reversibles (up/down)",
      "Índices propuestos por @backend.DBOptimizer",
      "Soft delete con deleted_at",
      "Backup probado",
    ],
    estimatedCostEur: 28.10,
    estimatedHours: 8,
    approvals: [
      { role: "domain-owner",   status: "approved",  by: "Juan G." },
      { role: "product-owner",  status: "pending" },
    ],
  },
];

const TYPE_ICONS = {
  ui: { icon: Code2, color: "text-violet-500", bg: "bg-violet-500/15", label: "UI" },
  api: { icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/15", label: "API" },
  data: { icon: Database, color: "text-naturgy-blue-500", bg: "bg-naturgy-blue-500/15", label: "Data" },
  integration: { icon: GitBranch, color: "text-naturgy-orange-500", bg: "bg-naturgy-orange-500/15", label: "Integración" },
  workflow: { icon: FileCode2, color: "text-cyan-500", bg: "bg-cyan-500/15", label: "Workflow" },
} as const;

export function FeatureCanvas({
  features: initialFeatures,
  onSubmit,
}: {
  features?: FeatureCard[];
  onSubmit?: () => void;
}) {
  const [features, setFeatures] = useState<FeatureCard[]>(initialFeatures ?? DEFAULT_FEATURES);
  const [selected, setSelected] = useState<string | null>(null);
  const toast = useToast();

  const totalCost = features.reduce((s, f) => s + f.estimatedCostEur, 0);
  const totalHours = features.reduce((s, f) => s + f.estimatedHours, 0);
  const allApproved = features.every((f) => f.approvals.every((a) => a.status === "approved"));
  const blocked = features.filter((f) => f.approvals.some((a) => a.status === "rejected" || a.status === "changes")).length;
  const fullyApproved = features.filter((f) => f.approvals.every((a) => a.status === "approved")).length;
  const totalApprovals = features.reduce((s, f) => s + f.approvals.length, 0);
  const approvedCount = features.reduce(
    (s, f) => s + f.approvals.filter((a) => a.status === "approved").length,
    0,
  );
  const progress = totalApprovals > 0 ? (approvedCount / totalApprovals) * 100 : 0;

  function updateApproval(featureId: string, role: RoleId, status: ApprovalStatus, comment?: string) {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id !== featureId
          ? f
          : {
              ...f,
              approvals: f.approvals.map((a) =>
                a.role !== role ? a : { ...a, status, by: "Jesús E.", comment },
              ),
            },
      ),
    );
    const roleLabel = ROLE_INFO[role].label;
    const msgMap = {
      approved: { kind: "success" as const, title: "Funcionalidad aprobada", desc: `${roleLabel} validó ${featureId}` },
      changes: { kind: "warning" as const, title: "Cambios solicitados", desc: `${roleLabel} pide ajustes en ${featureId}` },
      rejected: { kind: "danger" as const, title: "Funcionalidad rechazada", desc: `${roleLabel} bloqueó ${featureId}` },
      pending: { kind: "info" as const, title: "Aprobación reabierta", desc: `${roleLabel} ha reabierto ${featureId}` },
    } as const;
    const m = msgMap[status];
    toast({ kind: m.kind, title: m.title, description: m.desc });
  }

  return (
    <div className="space-y-5">
      {/* Status banner */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-naturgy-orange-500/5 p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <h3 className="font-semibold text-lg">Tablero de aprobaciones</h3>
            <p className="text-sm text-muted-fg mt-1">
              {features.length} funcionalidades extraídas · {totalApprovals} aprobaciones requeridas ·{" "}
              <span className="font-mono">{approvedCount}/{totalApprovals}</span> recibidas
            </p>
          </div>
          <div className="flex items-center gap-2">
            {blocked > 0 && (
              <Badge variant="warning">
                <AlertCircle className="w-3 h-3" />
                {blocked} con cambios
              </Badge>
            )}
            <Badge variant="ghost">
              Coste estimado: <span className="font-mono text-naturgy-orange-500 ml-1">€{totalCost.toFixed(0)}</span>
            </Badge>
            <Badge variant="ghost">
              {totalHours}h trabajo
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Progress value={progress} className="flex-1" />
          <span className="text-xs font-mono shrink-0">
            {fullyApproved}/{features.length} listas
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-fg flex-wrap">
            <LegendDot color="bg-naturgy-success" label="Aprobada" />
            <LegendDot color="bg-naturgy-warning" label="Cambios" />
            <LegendDot color="bg-muted" label="Pendiente" />
            <LegendDot color="bg-naturgy-danger" label="Rechazada" />
          </div>
          <Button
            size="lg"
            disabled={!allApproved}
            onClick={() => {
              if (!allApproved) return;
              toast({
                kind: "success",
                title: "Enviado a construcción",
                description: `${features.length} funcionalidades → enjambre AKS lanzado · 6 pods en cola`,
              });
              onSubmit?.();
            }}
          >
            <Rocket className="w-4 h-4" />
            {allApproved ? "Enviar todo a construcción" : `Faltan ${totalApprovals - approvedCount} aprobaciones`}
          </Button>
        </div>
      </div>

      {/* Canvas grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {features.map((f) => (
          <FeatureTile
            key={f.id}
            feature={f}
            selected={selected === f.id}
            onClick={() => setSelected(selected === f.id ? null : f.id)}
          />
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <FeatureDetail
          feature={features.find((f) => f.id === selected)!}
          onClose={() => setSelected(null)}
          onUpdate={updateApproval}
        />
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("w-1.5 h-1.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function FeatureTile({
  feature,
  selected,
  onClick,
}: {
  feature: FeatureCard;
  selected: boolean;
  onClick: () => void;
}) {
  const T = TYPE_ICONS[feature.type];
  const TIcon = T.icon;
  const allApproved = feature.approvals.every((a) => a.status === "approved");
  const hasIssues = feature.approvals.some((a) => a.status === "changes" || a.status === "rejected");
  const pending = feature.approvals.filter((a) => a.status === "pending").length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left rounded-xl border bg-card hover:border-naturgy-orange-500 transition-all p-5 relative overflow-hidden",
        selected
          ? "border-naturgy-orange-500 ring-2 ring-naturgy-orange-500/30"
          : allApproved
          ? "border-naturgy-success/50"
          : hasIssues
          ? "border-naturgy-warning/50"
          : "border-border",
      )}
    >
      {/* Status flag */}
      <div className="absolute top-0 right-0">
        {allApproved && (
          <div className="bg-naturgy-success/15 text-naturgy-success text-[10px] font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Lista
          </div>
        )}
        {hasIssues && !allApproved && (
          <div className="bg-naturgy-warning/15 text-naturgy-warning text-[10px] font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Cambios
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 mb-3 pr-20">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", T.bg, T.color)}>
          <TIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[10px] text-muted-fg">{feature.id}</span>
            <Badge variant="ghost" className="text-[10px]">
              {T.label}
            </Badge>
          </div>
          <h3 className="font-semibold text-sm leading-tight">{feature.title}</h3>
        </div>
      </div>

      <p className="text-xs text-muted-fg leading-relaxed line-clamp-3">{feature.description}</p>

      <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-fg">
        <span className="font-mono">€{feature.estimatedCostEur.toFixed(0)}</span>
        <span>·</span>
        <span className="font-mono">{feature.estimatedHours}h</span>
        {feature.entities.length > 0 && (
          <>
            <span>·</span>
            <span>{feature.entities.length} entidades</span>
          </>
        )}
      </div>

      {/* Approvals chips */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-fg uppercase">Aprobaciones:</span>
        <div className="flex gap-1">
          {feature.approvals.map((a) => (
            <ApprovalChip key={a.role} approval={a} />
          ))}
        </div>
        {pending > 0 && (
          <span className="ml-auto text-[10px] text-muted-fg">{pending} pendiente{pending > 1 ? "s" : ""}</span>
        )}
      </div>
    </button>
  );
}

function ApprovalChip({ approval }: { approval: RoleApproval }) {
  const role = ROLE_INFO[approval.role];
  const Icon =
    approval.status === "approved" ? CheckCircle2 :
    approval.status === "changes" ? AlertCircle :
    approval.status === "rejected" ? X :
    Clock;
  const cls =
    approval.status === "approved" ? "bg-naturgy-success/15 text-naturgy-success border-naturgy-success/30" :
    approval.status === "changes" ? "bg-naturgy-warning/15 text-naturgy-warning border-naturgy-warning/30" :
    approval.status === "rejected" ? "bg-naturgy-danger/15 text-naturgy-danger border-naturgy-danger/30" :
    "bg-muted text-muted-fg border-border";
  return (
    <div
      title={`${role.label} · ${approval.status}${approval.by ? ` (${approval.by})` : ""}`}
      className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold",
        cls,
      )}
    >
      <Icon className="w-2.5 h-2.5" />
      {role.short}
    </div>
  );
}

function FeatureDetail({
  feature,
  onClose,
  onUpdate,
}: {
  feature: FeatureCard;
  onClose: () => void;
  onUpdate: (id: string, role: RoleId, status: ApprovalStatus, comment?: string) => void;
}) {
  const T = TYPE_ICONS[feature.type];
  const TIcon = T.icon;

  return (
    <Card className="border-naturgy-orange-500 animate-slide-up">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", T.bg, T.color)}>
              <TIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary">{feature.id}</Badge>
                <Badge variant="ghost">{T.label}</Badge>
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <p className="text-sm text-muted-fg mt-1 max-w-2xl">{feature.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid md:grid-cols-3 gap-3">
          <InfoBox label="Coste estimado" value={`€${feature.estimatedCostEur.toFixed(2)}`} />
          <InfoBox label="Esfuerzo" value={`${feature.estimatedHours} horas`} />
          <InfoBox
            label="Entidades"
            value={feature.entities.length > 0 ? feature.entities.join(", ") : "—"}
          />
        </div>

        {feature.integrations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-fg mb-1.5">Integraciones</h4>
            <div className="flex gap-2 flex-wrap">
              {feature.integrations.map((i) => (
                <Badge key={i} variant="ghost" className="font-mono">
                  {i}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-fg mb-2">Criterios de aceptación</h4>
          <ul className="space-y-1.5">
            {feature.acceptance.map((c, i) => (
              <li key={i} className="text-sm flex gap-2 text-fg/90">
                <ChevronRight className="w-3.5 h-3.5 text-naturgy-orange-500 shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-fg mb-3">Aprobaciones por rol</h4>
          <div className="space-y-2">
            {feature.approvals.map((a) => (
              <ApprovalRow
                key={a.role}
                approval={a}
                onUpdate={(status, comment) => onUpdate(feature.id, a.role, status, comment)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-3">
      <div className="text-[10px] text-muted-fg uppercase">{label}</div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </div>
  );
}

function ApprovalRow({
  approval,
  onUpdate,
}: {
  approval: RoleApproval;
  onUpdate: (status: ApprovalStatus, comment?: string) => void;
}) {
  const role = ROLE_INFO[approval.role];
  const RoleIcon = role.icon;
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <div className="rounded-lg border border-border bg-bg p-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0", role.color)}>
          <RoleIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{role.label}</div>
          <div className="text-[11px] text-muted-fg">
            {approval.status === "pending" && "Esperando decisión"}
            {approval.status === "approved" && `✓ Aprobado por ${approval.by}`}
            {approval.status === "changes" && `↺ Cambios solicitados por ${approval.by}`}
            {approval.status === "rejected" && `✗ Rechazado por ${approval.by}`}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={approval.status === "approved" ? "primary" : "secondary"}
            onClick={() => onUpdate("approved")}
            title="Aprobar"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowComment((s) => !s)}
            title="Solicitar cambios"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onUpdate("rejected")}
            title="Rechazar"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {approval.comment && !showComment && (
        <div className="mt-2 text-xs bg-muted px-3 py-2 rounded-md italic text-muted-fg">
          “{approval.comment}”
        </div>
      )}

      {showComment && (
        <div className="mt-2 flex gap-2 animate-fade-in">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué cambios necesitas?"
            className="flex-1 h-8 px-3 rounded-md bg-card border border-border text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button
            size="sm"
            disabled={!comment.trim()}
            onClick={() => {
              onUpdate("changes", comment);
              setComment("");
              setShowComment(false);
            }}
          >
            <Send className="w-3 h-3" /> Enviar
          </Button>
        </div>
      )}
    </div>
  );
}
