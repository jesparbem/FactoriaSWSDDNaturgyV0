"use client";

import { useState } from "react";
import {
  Zap, Sparkles, Plus, Box, ArrowRight, Star, Wand2, Layers, Eye, Send,
  Smartphone, Monitor, Tablet, Code2, RefreshCw, CheckCircle2, Camera,
  MapPin, ClipboardList, Image as ImageIcon, FileSignature, ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { PROTOTYPES } from "@/lib/data";
import { VoiceInput } from "@/components/VoiceInput";
import { useToast } from "@/components/ToastProvider";

const SUGGESTED_PROMPTS = [
  "App para que el técnico de campo lea contadores con la cámara y suba la foto + lectura",
  "Dashboard simple con 3 KPIs y un gráfico de líneas (mock data)",
  "Formulario de alta cliente con 4 pasos y validación en tiempo real",
  "Comparador de tarifas con sliders y resultado destacado",
];

type Stage = "compose" | "building" | "ready";
type Viewport = "mobile" | "tablet" | "desktop";

interface Screen {
  id: string;
  name: string;
  emoji: string;
}

interface GeneratedPrototype {
  name: string;
  archetype: string;
  stack: string[];
  screens: Screen[];
  features: string[];
  buildSeconds: number;
  costEur: number;
}

export default function PrototypingPage() {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<Stage>("compose");
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState<Viewport>("mobile");
  const [activeScreen, setActiveScreen] = useState(0);
  const [generated, setGenerated] = useState<GeneratedPrototype | null>(null);
  const toast = useToast();

  function startBuild() {
    if (!prompt.trim()) return;

    // Heurística simple para inferir archetipo desde el prompt
    const lower = prompt.toLowerCase();
    const isMobile = /m[oó]vil|cámara|técnico|campo|app/.test(lower);
    const isDashboard = /dashboard|kpi|gr[aá]fic|m[eé]trica/.test(lower);
    const isForm = /formulario|alta|registro|paso/.test(lower);

    const proto: GeneratedPrototype = {
      name: isMobile
        ? "App técnico de campo"
        : isDashboard
        ? "Dashboard de KPIs"
        : isForm
        ? "Formulario multi-paso"
        : "Prototipo Naturgy",
      archetype: isMobile ? "app-movil-corporativa" : isDashboard ? "dashboard-bi" : "app-interna-corporativa",
      stack: isMobile
        ? ["React Native (Expo)", "TanStack Query", "SQLite (op-sqlite)"]
        : ["Next.js 14", "Tailwind CSS", "shadcn/ui"],
      screens: isMobile
        ? [
            { id: "s1", name: "Mis OTs del día", emoji: "📋" },
            { id: "s2", name: "Detalle OT", emoji: "🔧" },
            { id: "s3", name: "Captura foto", emoji: "📸" },
            { id: "s4", name: "Firma cliente", emoji: "✍️" },
          ]
        : isDashboard
        ? [
            { id: "s1", name: "Vista general", emoji: "📊" },
            { id: "s2", name: "Drill-down KPI", emoji: "🔍" },
            { id: "s3", name: "Histórico", emoji: "📈" },
          ]
        : isForm
        ? [
            { id: "s1", name: "Paso 1 · Datos", emoji: "🧾" },
            { id: "s2", name: "Paso 2 · Contacto", emoji: "📞" },
            { id: "s3", name: "Paso 3 · Confirmación", emoji: "✅" },
          ]
        : [
            { id: "s1", name: "Inicio", emoji: "🏠" },
            { id: "s2", name: "Listado", emoji: "📑" },
            { id: "s3", name: "Detalle", emoji: "🔎" },
          ],
      features: isMobile
        ? ["Login Azure AD", "Lista offline-first", "Cámara con OCR", "Firma touch", "Sync background"]
        : isDashboard
        ? ["3 KPIs en hero", "Gráfico de líneas", "Filtros por fecha/región"]
        : isForm
        ? ["Validación en tiempo real", "Auto-save borrador", "Resumen final"]
        : ["Layout responsive", "Datos demo"],
      buildSeconds: 3,
      costEur: 0.84,
    };
    if (isMobile) setViewport("mobile");
    else setViewport("desktop");

    setStage("building");
    setProgress(0);
    setActiveScreen(0);
    setGenerated(proto);

    toast({
      kind: "info",
      title: "Vibe Coding lanzado",
      description: "Layout · componentes · datos demo · preview en sandbox",
    });

    // Animación de progreso 0 → 100 en ~3s
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const pct = Math.min(100, (elapsed / proto.buildSeconds) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setStage("ready");
        toast({
          kind: "success",
          title: "Prototipo listo",
          description: `${proto.screens.length} pantallas · stack: ${proto.stack[0]}`,
        });
      }
    }, 100);
  }

  function reset() {
    setStage("compose");
    setPrompt("");
    setProgress(0);
    setGenerated(null);
    setActiveScreen(0);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">Vibe Coding</Badge>
            <Badge variant="ghost">Sandbox · NO producción</Badge>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-naturgy-orange-500" />
            Rapid Prototyping
          </h1>
          <p className="text-sm text-muted-fg mt-1 max-w-2xl">
            Crea apps funcionales en minutos. Datos sintéticos, pantallas reales. Cuando funciona, los agentes
            extraen specs automáticamente para promoverlo a módulo productivo.
          </p>
        </div>
      </div>

      {/* COMPOSE STAGE */}
      {stage === "compose" && (
        <Card className="border-naturgy-orange-500/30 bg-gradient-to-br from-card via-card to-naturgy-orange-500/5">
          <CardContent className="p-6 lg:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Describe la app que quieres prototipar</h2>
                <p className="text-xs text-muted-fg">Lenguaje natural · voz · o dibuja una pantalla y la IA la implementa</p>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ejemplo: una app para que el técnico de campo apunte qué ha hecho en cada orden de trabajo. Lista de OTs por la mañana, formulario simple por OT (estado, materiales, foto, firma), envío al final del día. Datos demo para 3 técnicos y 12 OTs."
                className="w-full min-h-[160px] p-4 pr-14 rounded-xl border border-border bg-bg text-sm placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              <div className="absolute top-3 right-3">
                <VoiceInput value={prompt} onChange={setPrompt} title="Dictar idea de prototipo" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-fg mr-1 py-1">Inspiración:</span>
              {SUGGESTED_PROMPTS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-naturgy-orange-500/15 hover:text-naturgy-orange-500 transition-all"
                >
                  {s.slice(0, 60)}...
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-muted-fg flex-wrap">
                <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Stack: detección automática</span>
                <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Datos: mock JSON sintético</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Preview live · hot reload</span>
              </div>
              <Button size="lg" disabled={!prompt.trim()} onClick={startBuild}>
                <Sparkles className="w-4 h-4" /> Crear prototipo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BUILDING STAGE */}
      {stage === "building" && generated && (
        <Card className="border-naturgy-orange-500/40 animate-fade-in">
          <CardContent className="p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center agent-pulse">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Generando: {generated.name}</h3>
                <p className="text-sm text-muted-fg">
                  Arquetipo: <span className="font-mono text-naturgy-orange-500">{generated.archetype}</span> ·
                  Stack: <span className="font-mono">{generated.stack.join(" + ")}</span>
                </p>
              </div>
            </div>

            <Progress value={progress} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                { t: "Analizando prompt", thr: 15 },
                { t: "Generando layout y rutas", thr: 35 },
                { t: "Creando componentes UI", thr: 60 },
                { t: "Generando datos demo", thr: 80 },
                { t: "Arrancando sandbox", thr: 100 },
              ].map((s) => (
                <div
                  key={s.t}
                  className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md border transition-all ${
                    progress >= s.thr
                      ? "border-naturgy-success/30 bg-naturgy-success/10 text-fg"
                      : "border-border bg-bg text-muted-fg"
                  }`}
                >
                  {progress >= s.thr ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-naturgy-success" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {s.t}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* READY STAGE - preview real del prototipo */}
      {stage === "ready" && generated && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success"><CheckCircle2 className="w-2.5 h-2.5" /> Prototipo listo</Badge>
                    <Badge variant="ghost">PRO-{Date.now().toString().slice(-3)}</Badge>
                    <Badge variant="ghost" className="font-mono">{generated.archetype}</Badge>
                  </div>
                  <CardTitle>{generated.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex p-1 bg-muted rounded-lg">
                    {[
                      { v: "mobile" as const, icon: Smartphone },
                      { v: "tablet" as const, icon: Tablet },
                      { v: "desktop" as const, icon: Monitor },
                    ].map(({ v, icon: VIcon }) => (
                      <button
                        key={v}
                        onClick={() => setViewport(v)}
                        className={`p-1.5 rounded-md transition-all ${
                          viewport === v ? "bg-card shadow-sm" : "text-muted-fg hover:text-fg"
                        }`}
                      >
                        <VIcon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={reset}><ArrowLeft className="w-3.5 h-3.5" /> Otro</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-naturgy-blue-950 border border-border rounded-xl p-6 flex items-start justify-center min-h-[480px] relative overflow-hidden">
                {/* Background grid */}
                <div className="grid-bg absolute inset-0 opacity-20" />

                {/* Mobile frame */}
                <div className="relative">
                  <PhoneFrame viewport={viewport}>
                    <ScreenContent
                      screen={generated.screens[activeScreen]}
                      protoName={generated.name}
                      archetype={generated.archetype}
                    />
                  </PhoneFrame>
                </div>
              </div>

              {/* Screen navigator */}
              <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-muted-fg">
                  Pantalla {activeScreen + 1} de {generated.screens.length}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {generated.screens.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveScreen(i)}
                      className={`text-xs px-3 py-1.5 rounded-md border transition-all ${
                        activeScreen === i
                          ? "border-naturgy-orange-500 bg-naturgy-orange-500/10 text-naturgy-orange-500"
                          : "border-border hover:border-naturgy-orange-500"
                      }`}
                    >
                      <span className="mr-1">{s.emoji}</span>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <SummaryRow label="Stack" value={generated.stack.join(", ")} />
                <SummaryRow label="Pantallas" value={String(generated.screens.length)} />
                <SummaryRow label="Build time" value={`${generated.buildSeconds}s`} />
                <SummaryRow label="Coste IA" value={`€${generated.costEur.toFixed(2)}`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-naturgy-orange-500" />
                  Features generadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {generated.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-naturgy-success shrink-0" />
                    {f}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() =>
                  toast({
                    kind: "success",
                    title: "Promoción iniciada",
                    description: "@architect extraerá specs · el módulo entrará en el SDLC con todos los gates",
                  })
                }
              >
                <Send className="w-4 h-4" /> Promover a módulo productivo
              </Button>
              <Button variant="secondary" className="w-full"><Code2 className="w-4 h-4" /> Ver código generado</Button>
              <Button variant="ghost" className="w-full"><Eye className="w-4 h-4" /> Compartir con stakeholders</Button>
            </div>

            <div className="rounded-lg border border-naturgy-orange-500/30 bg-naturgy-orange-500/5 p-3">
              <p className="text-xs text-muted-fg leading-relaxed">
                <strong className="text-fg">Recordatorio:</strong> este prototipo NO es desplegable en producción.
                Cuando lo apruebes, los agentes regenerarán el código con stack productivo, tests y auditorías.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery (siempre visible salvo en building) */}
      {stage !== "building" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>Tus prototipos</CardTitle>
              <Button variant="secondary" size="sm" onClick={reset}>
                <Plus className="w-3.5 h-3.5" /> Nuevo desde cero
              </Button>
            </div>
            <p className="text-sm text-muted-fg mt-1">
              Los prototipos sirven para validar ideas. Cuando uno está listo, puede promoverse a módulo productivo —
              entonces los agentes extraen specs y construyen la versión robusta.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROTOTYPES.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-bg overflow-hidden hover:border-naturgy-orange-500 transition-all group"
                >
                  <div className="h-32 bg-gradient-to-br from-naturgy-blue-900 via-naturgy-blue-800 to-naturgy-orange-500/30 flex items-center justify-center text-6xl">
                    {p.thumbnail}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-tight">{p.name}</h3>
                      <Badge
                        variant={p.status === "promoted" ? "success" : p.status === "ready" ? "primary" : "ghost"}
                        className="shrink-0"
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-fg">
                      {p.author} · {p.createdAt}
                    </div>
                    {p.reusedBy && p.reusedBy.length > 0 && (
                      <div className="text-[10px] text-naturgy-success flex items-center gap-1">
                        <Star className="w-3 h-3" /> Promovido a {p.reusedBy.join(", ")}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="secondary" size="sm" className="flex-1"><Eye className="w-3 h-3" /> Abrir</Button>
                      {p.status === "ready" && (
                        <Button size="sm" className="flex-1"><Send className="w-3 h-3" /> Promover</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* New card */}
              <button
                onClick={reset}
                className="rounded-xl border-2 border-dashed border-border bg-bg hover:border-naturgy-orange-500 hover:bg-naturgy-orange-500/5 transition-all flex flex-col items-center justify-center text-center p-6 min-h-[260px] group"
              >
                <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-naturgy-orange-500 transition-colors flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-muted-fg group-hover:text-white" />
                </div>
                <div className="text-sm font-semibold">Nuevo prototipo</div>
                <div className="text-[11px] text-muted-fg mt-1">En menos de 5 minutos</div>
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-fg">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

// Marco según viewport
function PhoneFrame({ viewport, children }: { viewport: Viewport; children: React.ReactNode }) {
  const dims =
    viewport === "mobile"
      ? "w-[280px] h-[560px]"
      : viewport === "tablet"
      ? "w-[420px] h-[560px]"
      : "w-[640px] h-[480px]";
  return (
    <div className={`${dims} rounded-3xl bg-naturgy-neutral-900 p-3 shadow-2xl shadow-naturgy-orange-500/20 border border-naturgy-neutral-700`}>
      <div className="w-full h-full rounded-2xl bg-white overflow-hidden relative">
        {/* Notch */}
        {viewport === "mobile" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-naturgy-neutral-800 rounded-full" />
        )}
        {children}
      </div>
    </div>
  );
}

function ScreenContent({
  screen, protoName, archetype,
}: {
  screen: Screen; protoName: string; archetype: string;
}) {
  // Render mockups distintos según el id de pantalla y arquetipo
  if (archetype === "app-movil-corporativa") {
    return <MobileWorkOrderScreen screen={screen} />;
  }
  if (archetype === "dashboard-bi") {
    return <DashboardScreen screen={screen} />;
  }
  return <GenericScreen screen={screen} title={protoName} />;
}

// Mockup móvil: OTs del técnico de campo
function MobileWorkOrderScreen({ screen }: { screen: Screen }) {
  if (screen.id === "s1") {
    return (
      <div className="h-full bg-white text-naturgy-blue-950 text-[10px]">
        <div className="bg-naturgy-orange-500 text-white px-3 py-3 pt-6">
          <div className="font-bold text-sm">Mis OTs del día</div>
          <div className="text-[10px] opacity-90 mt-0.5">3 pendientes · 1 completada</div>
        </div>
        <div className="p-3 space-y-2">
          {[
            { ot: "OT-1284", cliente: "Polígono Norte", dir: "C/ Industrial 42", urg: "Alta", status: "pending" },
            { ot: "OT-1287", cliente: "Edif. Almendra", dir: "Av. Naturgy 12", urg: "Media", status: "pending" },
            { ot: "OT-1290", cliente: "C.C. Levante", dir: "Pl. Comercial 1", urg: "Baja", status: "pending" },
            { ot: "OT-1278", cliente: "Hosp. San Juan", dir: "Ronda Sur 88", urg: "Alta", status: "done" },
          ].map((o) => (
            <div
              key={o.ot}
              className={`p-2.5 rounded-md border ${
                o.status === "done" ? "border-naturgy-success/30 bg-naturgy-success/5" : "border-naturgy-neutral-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-naturgy-blue-950">{o.cliente}</div>
                  <div className="text-naturgy-neutral-500 mt-0.5">{o.dir}</div>
                </div>
                <span className="text-naturgy-neutral-400 text-[9px]">{o.ot}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    o.urg === "Alta"
                      ? "bg-red-100 text-red-700"
                      : o.urg === "Media"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {o.urg}
                </span>
                {o.status === "done" ? (
                  <CheckCircle2 className="w-3 h-3 text-naturgy-success" />
                ) : (
                  <span className="text-[9px] text-naturgy-orange-500 font-semibold">→</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (screen.id === "s2") {
    return (
      <div className="h-full bg-white text-naturgy-blue-950 text-[10px]">
        <div className="bg-naturgy-orange-500 text-white px-3 py-3 pt-6 flex items-center gap-2">
          <ArrowLeft className="w-3 h-3" />
          <div className="font-bold text-xs">OT-1284</div>
        </div>
        <div className="p-3 space-y-2.5">
          <div className="font-semibold">Polígono Norte</div>
          <div className="text-naturgy-neutral-500">C/ Industrial 42 · Madrid</div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <Tile icon={<MapPin className="w-3 h-3" />} label="Ver mapa" />
            <Tile icon={<Camera className="w-3 h-3" />} label="Foto" />
            <Tile icon={<ClipboardList className="w-3 h-3" />} label="Materiales" />
            <Tile icon={<FileSignature className="w-3 h-3" />} label="Firma" />
          </div>

          <div className="mt-3">
            <div className="text-[9px] text-naturgy-neutral-500 uppercase">Estado</div>
            <select className="w-full mt-1 px-2 py-1.5 rounded border border-naturgy-neutral-200 text-[10px]">
              <option>En curso</option>
              <option>Completada</option>
              <option>Bloqueada (necesito materiales)</option>
            </select>
          </div>

          <button className="w-full mt-2 bg-naturgy-orange-500 text-white py-2 rounded-md font-semibold">
            Cerrar OT
          </button>
        </div>
      </div>
    );
  }
  if (screen.id === "s3") {
    return (
      <div className="h-full bg-naturgy-neutral-900 text-white">
        <div className="px-3 py-3 pt-6 flex items-center gap-2">
          <ArrowLeft className="w-3 h-3" />
          <div className="font-bold text-xs">Captura foto · OT-1284</div>
        </div>
        <div className="px-3 mt-12 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center mb-3">
            <Camera className="w-12 h-12 text-white/60" />
          </div>
          <div className="text-[10px] text-white/70">Apunta a la instalación</div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="w-14 h-14 rounded-full bg-white border-4 border-white/40" />
        </div>
      </div>
    );
  }
  // s4 firma
  return (
    <div className="h-full bg-white text-naturgy-blue-950 text-[10px]">
      <div className="bg-naturgy-orange-500 text-white px-3 py-3 pt-6 flex items-center gap-2">
        <ArrowLeft className="w-3 h-3" />
        <div className="font-bold text-xs">Firma cliente · OT-1284</div>
      </div>
      <div className="p-3">
        <p className="text-[10px] text-naturgy-neutral-600">
          Confirme que el técnico ha completado los trabajos descritos en la orden.
        </p>
        <div className="mt-3 h-36 rounded-md border-2 border-dashed border-naturgy-neutral-300 bg-naturgy-neutral-50 relative">
          <ImageIcon className="absolute inset-0 m-auto w-8 h-8 text-naturgy-neutral-300" />
          <span className="absolute bottom-2 left-2 text-[9px] text-naturgy-neutral-400">Firme aquí</span>
        </div>
        <div className="mt-3 text-[10px] text-naturgy-neutral-500">
          Nombre del firmante: <span className="text-naturgy-blue-950 font-semibold">Juan Martínez</span>
        </div>
        <button className="w-full mt-3 bg-naturgy-success text-white py-2 rounded-md font-semibold">
          Confirmar y enviar
        </button>
      </div>
    </div>
  );
}

function Tile({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-md border border-naturgy-neutral-200 p-2 flex flex-col items-center justify-center text-naturgy-blue-950 hover:border-naturgy-orange-500 transition-colors">
      <div className="text-naturgy-orange-500">{icon}</div>
      <div className="text-[9px] mt-1">{label}</div>
    </div>
  );
}

// Mockup dashboard
function DashboardScreen({ screen }: { screen: Screen }) {
  if (screen.id === "s1") {
    return (
      <div className="h-full bg-white text-naturgy-blue-950 p-3 text-[10px]">
        <div className="font-bold text-sm mb-1">Dashboard de KPIs</div>
        <div className="text-naturgy-neutral-500 text-[9px] mb-3">Refresh: hace 4 min</div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Pérdidas red", v: "2.4%", trend: "▼ 0.3" },
            { l: "TIEPI", v: "18 min", trend: "▼ 2" },
            { l: "NIEPI", v: "1.2", trend: "▲ 0.1" },
          ].map((k) => (
            <div key={k.l} className="rounded-md border border-naturgy-neutral-200 p-2">
              <div className="text-[8px] text-naturgy-neutral-500 uppercase">{k.l}</div>
              <div className="font-bold text-naturgy-orange-500">{k.v}</div>
              <div className="text-[8px] text-naturgy-success">{k.trend}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-md border border-naturgy-neutral-200 p-3">
          <div className="text-[9px] text-naturgy-neutral-500 mb-2">Evolución últimos 30 días</div>
          <svg viewBox="0 0 200 60" className="w-full h-12">
            <polyline
              fill="none"
              stroke="#FF671B"
              strokeWidth="2"
              points="0,40 20,38 40,42 60,30 80,28 100,32 120,22 140,18 160,24 180,14 200,12"
            />
            <polyline
              fill="rgba(255,103,27,0.1)"
              stroke="none"
              points="0,40 20,38 40,42 60,30 80,28 100,32 120,22 140,18 160,24 180,14 200,12 200,60 0,60"
            />
          </svg>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-[9px]">
          <div className="px-2 py-1 rounded bg-naturgy-blue-50 border border-naturgy-blue-100 text-naturgy-blue-700">
            Filtrar por región
          </div>
          <div className="px-2 py-1 rounded bg-naturgy-blue-50 border border-naturgy-blue-100 text-naturgy-blue-700">
            Últimos 30 días
          </div>
        </div>
      </div>
    );
  }
  return <GenericScreen screen={screen} title="Dashboard" />;
}

function GenericScreen({ screen, title }: { screen: Screen; title: string }) {
  return (
    <div className="h-full bg-white text-naturgy-blue-950 text-[10px]">
      <div className="bg-naturgy-orange-500 text-white px-3 py-3 pt-6">
        <div className="font-bold text-xs">{title}</div>
        <div className="text-[10px] opacity-90 mt-0.5">{screen.name}</div>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-4xl text-center py-4">{screen.emoji}</div>
        <div className="rounded-md border border-naturgy-neutral-200 p-2.5">
          <div className="h-2 w-2/3 rounded bg-naturgy-neutral-200 mb-2" />
          <div className="h-2 w-1/2 rounded bg-naturgy-neutral-100 mb-2" />
          <div className="h-2 w-3/4 rounded bg-naturgy-neutral-100" />
        </div>
        <div className="rounded-md border border-naturgy-neutral-200 p-2.5">
          <div className="h-2 w-3/4 rounded bg-naturgy-neutral-200 mb-2" />
          <div className="h-2 w-1/2 rounded bg-naturgy-neutral-100" />
        </div>
        <button className="w-full bg-naturgy-orange-500 text-white py-2 rounded-md font-semibold text-[10px] mt-2">
          Continuar
        </button>
      </div>
    </div>
  );
}
