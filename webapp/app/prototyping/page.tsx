"use client";

import { useState } from "react";
import { Zap, Sparkles, Plus, Mic, Box, ArrowRight, Star, Wand2, Layers, Eye, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PROTOTYPES } from "@/lib/data";

const SUGGESTED_PROMPTS = [
  "App para que el técnico de campo lea contadores con la cámara y suba la foto + lectura",
  "Dashboard simple con 3 KPIs y un gráfico de líneas (mock data)",
  "Formulario de alta cliente con 4 pasos y validación en tiempo real",
  "Comparador de tarifas con sliders y resultado destacado",
];

export default function PrototypingPage() {
  const [prompt, setPrompt] = useState("");
  const [building, setBuilding] = useState(false);

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

      {/* Hero builder */}
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
            <button
              title="Dictar"
              className="absolute top-3 right-3 h-9 w-9 rounded-md bg-card border border-border hover:border-naturgy-orange-500 transition-all flex items-center justify-center"
            >
              <Mic className="w-4 h-4 text-naturgy-orange-500" />
            </button>
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
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Stack: Next.js + Tailwind + shadcn</span>
              <span className="flex items-center gap-1"><Box className="w-3 h-3" /> Datos: mock JSON sintético</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Preview live · hot reload</span>
            </div>
            <Button
              size="lg"
              disabled={!prompt.trim() || building}
              onClick={() => {
                setBuilding(true);
                setTimeout(() => setBuilding(false), 3500);
              }}
            >
              {building ? (
                <><Sparkles className="w-4 h-4 animate-pulse" /> Generando prototipo...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Crear prototipo</>
              )}
            </Button>
          </div>

          {building && (
            <div className="rounded-lg border border-naturgy-orange-500/30 bg-naturgy-orange-500/5 p-4 animate-fade-in">
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-naturgy-orange-500 animate-pulse" />
                <span>Generando layout · componentes · datos demo · routing · preview en sandbox...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Tus prototipos</CardTitle>
            <Button variant="secondary" size="sm"><Plus className="w-3.5 h-3.5" /> Nuevo desde cero</Button>
          </div>
          <p className="text-sm text-muted-fg mt-1">
            Los prototipos sirven para validar ideas. Cuando uno está listo, puede promoverse a módulo productivo —
            entonces los agentes extraen specs y construyen la versión robusta.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROTOTYPES.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-bg overflow-hidden hover:border-naturgy-orange-500 transition-all group">
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
            <button className="rounded-xl border-2 border-dashed border-border bg-bg hover:border-naturgy-orange-500 hover:bg-naturgy-orange-500/5 transition-all flex flex-col items-center justify-center text-center p-6 min-h-[260px] group">
              <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-naturgy-orange-500 transition-colors flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-muted-fg group-hover:text-white" />
              </div>
              <div className="text-sm font-semibold">Nuevo prototipo</div>
              <div className="text-[11px] text-muted-fg mt-1">En menos de 5 minutos</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* From prototype to module */}
      <Card>
        <CardHeader>
          <CardTitle>Del prototipo al módulo productivo</CardTitle>
          <p className="text-sm text-muted-fg mt-1">Cuando un prototipo está listo, los agentes lo formalizan</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            {[
              { num: 1, title: "Validas el prototipo", desc: "Demos con stakeholders. Iteras hasta que refleja lo que quieres." },
              { num: 2, title: "@architect extrae specs", desc: "Analiza el prototipo + datos sintéticos. Genera BLUEPRINT.md." },
              { num: 3, title: "Enjambre construye módulo real", desc: "Stack productivo, tests, auditorías, despliegue con gates." },
              { num: 4, title: "Se integra en aplicación mayor", desc: "El módulo encaja con otros como pieza autocontenida." },
            ].map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-bg p-4 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {s.num}
                </div>
                <h4 className="font-semibold text-sm mt-2">{s.title}</h4>
                <p className="text-xs text-muted-fg mt-1 leading-relaxed">{s.desc}</p>
                {i < 3 && <ArrowRight className="w-4 h-4 text-naturgy-orange-500 absolute -right-2 top-1/2 hidden md:block" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
