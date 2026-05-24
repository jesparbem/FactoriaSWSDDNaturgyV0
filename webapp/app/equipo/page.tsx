"use client";

import { useState } from "react";
import {
  Users, Layers, Settings, Lightbulb, ArrowRight, ArrowDown,
  Eye, BarChart3, FileText, Mail, Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type RoleId = "process-owner" | "domain-owner" | "product-owner" | "tech-enabler";

const ROLE_CARDS: Record<RoleId, {
  id: RoleId;
  label: string;
  subtitle: string;
  icon: typeof Users;
  color: string;          // tailwind bg color
  border: string;
  description: string;
  responsibilities: string[];
  sees: string[];
  manages: string[];
  examples: { name: string; team: string }[];
  interaction: string;
}> = {
  "process-owner": {
    id: "process-owner",
    label: "Process Owner",
    subtitle: "Visión E2E del proceso de negocio",
    icon: Users,
    color: "bg-naturgy-blue-500",
    border: "border-naturgy-blue-500",
    description: "Garantiza que los módulos proporcionan la funcionalidad adecuada a cada fase del proceso. Diseña KPIs e interlocuta con POs y DOs.",
    responsibilities: [
      "Garantiza que los módulos cubren cada fase del proceso",
      "Diseña los KPIs del proceso",
      "Interlocución directa con Product Owners y Domain Owners",
    ],
    sees: [
      "Todos los procesos de los que es propietario",
      "Los dominios funcionales con sus módulos y entidades",
    ],
    manages: [
      "KPIs e indicadores por proceso",
      "Cobertura de módulos por fase",
    ],
    examples: [
      { name: "Marta L.", team: "Procurement" },
      { name: "Lucía P.", team: "Comercial Cliente" },
    ],
    interaction: "Visión horizontal · cruza varios dominios",
  },
  "domain-owner": {
    id: "domain-owner",
    label: "Domain Owner",
    subtitle: "Propietario del dominio funcional",
    icon: Layers,
    color: "bg-indigo-500",
    border: "border-indigo-500",
    description: "Define qué módulos componen el dominio, las entidades disponibles y las integraciones (internas y con otros dominios). Visión perpendicular al PO.",
    responsibilities: [
      "Define qué módulos componen el dominio",
      "Define entidades e integraciones disponibles",
      "Visión vertical: estructura vs proceso",
    ],
    sees: [
      "Todos los módulos de su dominio funcional",
      "Todas las entidades e integraciones del dominio",
    ],
    manages: [
      "Estructura del dominio",
      "Integraciones internas y externas",
    ],
    examples: [
      { name: "Juan G.", team: "Procurement" },
      { name: "Ana R.", team: "Operación Red" },
      { name: "Sergio T.", team: "Comercial Cliente" },
    ],
    interaction: "Visión vertical · coordina procesos que cruzan el dominio",
  },
  "product-owner": {
    id: "product-owner",
    label: "Product Owner",
    subtitle: "Responsable de un módulo",
    icon: Settings,
    color: "bg-violet-500",
    border: "border-violet-500",
    description: "Define funcionalidad y datos del módulo con el PO. Garantiza el gobierno correcto de las entidades y es responsable del SDLC.",
    responsibilities: [
      "Define funcionalidad y datos del módulo con el PO",
      "Garantiza gobierno correcto de entidades",
      "Responsable del SDLC de los artefactos del módulo",
    ],
    sees: [
      "Procesos a los que sus módulos dan soporte",
      "Funcionalidades y entidades de sus módulos",
    ],
    manages: [
      "Mapeo de entidades con inventario",
      "Creación de entidades nuevas",
      "Integraciones con otros módulos",
    ],
    examples: [
      { name: "Carlos M.", team: "Distribución" },
      { name: "Iván B.", team: "Operación Red" },
      { name: "Lucía P.", team: "Comercial Cliente" },
    ],
    interaction: "Punto de cruce entre Process Owner (qué hace) y Domain Owner (dónde encaja)",
  },
  "tech-enabler": {
    id: "tech-enabler",
    label: "Technology Enabler",
    subtitle: "Perfil mixto tecnología-negocio",
    icon: Lightbulb,
    color: "bg-naturgy-orange-500",
    border: "border-naturgy-orange-500",
    description: "Ayuda al Product Owner en el uso de la plataforma agéntica. Identifica necesidades para evolucionar la plataforma.",
    responsibilities: [
      "Ayuda al PO con la plataforma agéntica",
      "Identifica necesidades para evolucionar la plataforma",
    ],
    sees: [
      "Todos los procesos y funcionalidades del dominio",
      "Estado de la plataforma agéntica",
    ],
    manages: [
      "Identificar solapamientos",
      "Evolución de la plataforma",
    ],
    examples: [
      { name: "Jesús E.", team: "Factoría IA & Data" },
    ],
    interaction: "Acompaña a los POs · detecta gaps · alimenta @self-improve",
  },
};

export default function EquipoPage() {
  const [view, setView] = useState<"matrix" | "cards" | "interactions">("matrix");
  const [selected, setSelected] = useState<RoleId | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Equipo</h1>
          <p className="text-sm text-muted-fg mt-1 max-w-2xl">
            El modelo organizativo Naturgy para construir software con IA. 4 roles complementarios que articulan
            el proceso (horizontal) y el dominio (vertical).
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {[
            { id: "matrix", label: "Matriz" },
            { id: "cards", label: "Tarjetas" },
            { id: "interactions", label: "Interacciones" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id as typeof view)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                view === v.id ? "bg-card text-fg shadow-sm" : "text-muted-fg hover:text-fg"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* MATRIX VIEW: horizontal vs vertical */}
      {view === "matrix" && (
        <Card>
          <CardHeader>
            <CardTitle>Dos ejes complementarios</CardTitle>
            <p className="text-sm text-muted-fg mt-1">
              <strong className="text-fg">Eje horizontal</strong> · proceso E2E que cruza varios dominios ·{" "}
              <strong className="text-fg">Eje vertical</strong> · dominio funcional que coordina varios procesos
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative pt-2 pb-4 overflow-x-auto">
              <div className="min-w-[640px] grid grid-cols-[180px_1fr] gap-x-6 gap-y-6 items-start">
                {/* Top-left empty / legend */}
                <div className="text-[10px] text-muted-fg uppercase pt-3 text-right">
                  Eje vertical ↓
                  <br />
                  Dominio funcional
                </div>

                {/* Eje horizontal label */}
                <div className="relative rounded-lg border-2 border-dashed border-naturgy-blue-500/40 bg-naturgy-blue-500/5 p-4 mb-2">
                  <div className="text-[10px] font-mono text-naturgy-blue-500 uppercase mb-2">
                    EJE HORIZONTAL → Proceso E2E · cruza varios dominios
                  </div>
                  <RoleChip role="process-owner" onClick={() => setSelected("process-owner")} />
                </div>

                {/* Domain Owner (vertical) */}
                <div className="rounded-lg border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 p-4">
                  <RoleChip role="domain-owner" onClick={() => setSelected("domain-owner")} />
                  <div className="text-[10px] font-mono text-indigo-400 uppercase mt-3">
                    Coordina módulos del dominio
                  </div>
                </div>

                {/* Product + Tech Enabler grid */}
                <div className="grid gap-3">
                  <div className="rounded-lg border border-border bg-bg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <RoleChip role="product-owner" onClick={() => setSelected("product-owner")} />
                      <Badge variant="ghost">Responsable del módulo</Badge>
                    </div>
                    <div className="text-xs text-muted-fg flex items-center gap-2">
                      <ArrowDown className="w-3 h-3" /> recibe requisitos del PO · estructura del DO
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-bg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <RoleChip role="tech-enabler" onClick={() => setSelected("tech-enabler")} />
                      <Badge variant="ghost">Acompañamiento plataforma</Badge>
                    </div>
                    <div className="text-xs text-muted-fg flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> soporta al PrO · alimenta @self-improve
                    </div>
                  </div>
                </div>
              </div>

              {/* Leyenda */}
              <div className="mt-6 pt-4 border-t border-border text-xs text-muted-fg space-y-1">
                <div>
                  <strong className="text-fg">Process Owner ↔ Domain Owner</strong> — visión perpendicular: el PO
                  ve procesos que cruzan dominios (horizontal). El DO ve toda la estructura de su dominio (vertical).
                </div>
                <div>
                  <strong className="text-fg">Product Owner</strong> — punto de cruce entre los dos ejes:
                  implementa funcionalidad para procesos dentro de un dominio.
                </div>
                <div>
                  <strong className="text-fg">Technology Enabler</strong> — perfil transversal que asiste al PrO en
                  la plataforma agéntica y detecta evoluciones necesarias.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CARDS VIEW */}
      {view === "cards" && (
        <div className="grid md:grid-cols-2 gap-4">
          {(Object.values(ROLE_CARDS) as (typeof ROLE_CARDS)[RoleId][]).map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.id} className={`hover:${r.border} transition-all`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg ${r.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle>{r.label}</CardTitle>
                      <p className="text-xs text-muted-fg mt-0.5">{r.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-fg/90 leading-relaxed">{r.description}</p>

                  <div>
                    <h4 className="text-[10px] font-semibold uppercase text-muted-fg mb-1.5 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Lo que ve
                    </h4>
                    <ul className="space-y-1">
                      {r.sees.map((s, i) => (
                        <li key={i} className="text-xs flex gap-2 text-fg/80">
                          <span className="text-naturgy-orange-500 mt-1">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-semibold uppercase text-muted-fg mb-1.5 flex items-center gap-1">
                      <Settings className="w-3 h-3" /> Lo que gestiona
                    </h4>
                    <ul className="space-y-1">
                      {r.manages.map((s, i) => (
                        <li key={i} className="text-xs flex gap-2 text-fg/80">
                          <span className="text-naturgy-orange-500 mt-1">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <span className="text-[10px] text-muted-fg uppercase">Hoy en el equipo:</span>
                    <div className="flex flex-wrap gap-1">
                      {r.examples.map((p) => (
                        <span key={p.name} className="text-[10px] px-2 py-0.5 rounded-full bg-muted">
                          {p.name} <span className="text-muted-fg">· {p.team}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* INTERACTIONS VIEW */}
      {view === "interactions" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {[
            {
              title: "Process Owner → Product Owner",
              from: ROLE_CARDS["process-owner"],
              to: ROLE_CARDS["product-owner"],
              desc: "El PO tiene visión E2E del proceso y define qué funcionalidad necesita en cada fase. El PrO recibe estos requisitos y los implementa en su módulo.",
              touchpoint: "Reuniones de spec · workshops de proceso · revisión de BLUEPRINT",
            },
            {
              title: "Domain Owner → Product Owner",
              from: ROLE_CARDS["domain-owner"],
              to: ROLE_CARDS["product-owner"],
              desc: "El DO estructura el dominio funcional: decide qué módulos lo componen, qué entidades están disponibles y qué integraciones existen. El PrO opera dentro de este marco.",
              touchpoint: "Catálogo de entidades · review de integraciones · governance del dominio",
            },
            {
              title: "Process Owner ↔ Domain Owner",
              from: ROLE_CARDS["process-owner"],
              to: ROLE_CARDS["domain-owner"],
              desc: "Visión perpendicular. El PO ve procesos que cruzan dominios (horizontal). El DO ve toda la estructura de su dominio (vertical). Se coordinan cuando un proceso requiere módulos de varios dominios.",
              touchpoint: "Comité multi-dominio · roadmap conjunto · resolución de dependencias",
            },
            {
              title: "Product Owner → Technology Enabler",
              from: ROLE_CARDS["product-owner"],
              to: ROLE_CARDS["tech-enabler"],
              desc: "El TE, con perfil mixto, ayuda al PrO a usar la plataforma agéntica y detecta nuevas necesidades para evolucionarla.",
              touchpoint: "Soporte en builder · sesiones de mejora · canal directo en chat",
            },
          ].map((p, i) => {
            const FromIcon = p.from.icon;
            const ToIcon = p.to.icon;
            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-3 py-2">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-xl ${p.from.color} text-white flex items-center justify-center shadow-sm`}>
                        <FromIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase">{p.from.label}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-naturgy-orange-500 to-transparent" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-xl ${p.to.color} text-white flex items-center justify-center shadow-sm`}>
                        <ToIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase">{p.to.label}</span>
                    </div>
                  </div>
                  <p className="text-sm text-fg/90 leading-relaxed">{p.desc}</p>
                  <div className="rounded-lg border border-border bg-bg p-3">
                    <div className="text-[10px] text-muted-fg uppercase mb-1">Touchpoints reales</div>
                    <p className="text-xs">{p.touchpoint}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail panel cuando se clica un chip */}
      {selected && (
        <Card className="border-naturgy-orange-500 animate-slide-up">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>Detalle de rol</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>✕</Button>
            </div>
          </CardHeader>
          <CardContent>
            <RoleDetailCard role={ROLE_CARDS[selected]} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RoleChip({ role, onClick }: { role: RoleId; onClick: () => void }) {
  const r = ROLE_CARDS[role];
  const Icon = r.icon;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
    >
      <div className={`w-10 h-10 rounded-lg ${r.color} text-white flex items-center justify-center shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <div className="font-semibold text-sm">{r.label}</div>
        <div className="text-[11px] text-muted-fg">{r.subtitle}</div>
      </div>
    </button>
  );
}

function RoleDetailCard({ role }: { role: (typeof ROLE_CARDS)[RoleId] }) {
  const Icon = role.icon;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-xl ${role.color} text-white flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-bold">{role.label}</div>
          <div className="text-xs text-muted-fg">{role.interaction}</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{role.description}</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <DetailCol title="Responsabilidades" items={role.responsibilities} icon={<FileText className="w-3 h-3" />} />
        <DetailCol title="Lo que ve" items={role.sees} icon={<Eye className="w-3 h-3" />} />
        <DetailCol title="Lo que gestiona" items={role.manages} icon={<BarChart3 className="w-3 h-3" />} />
      </div>
    </div>
  );
}

function DetailCol({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold uppercase text-muted-fg mb-1.5 flex items-center gap-1">
        {icon}
        {title}
      </h4>
      <ul className="space-y-1">
        {items.map((s, i) => (
          <li key={i} className="text-xs text-fg/85 leading-relaxed">{s}</li>
        ))}
      </ul>
    </div>
  );
}
