import { NextResponse } from "next/server";
import { AGENTS, MODULES, SWARM_PODS } from "@/lib/data";

// Esta ruta genera eventos sintéticos del enjambre que rotan en cada llamada.
// El frontend hace polling cada 2-3s para simular el stream del Service Bus.
//
// En producción: provendrá de Azure App Insights via Log Analytics Query API,
// o de Service Bus directamente vía WebSocket / SSE.

const ACTIONS = [
  { agent: "frontend", verb: "componente generado", what: "DashboardLayout.tsx" },
  { agent: "frontend", verb: "componente generado", what: "KpiCard.tsx" },
  { agent: "backend", verb: "endpoint creado", what: "GET /api/v1/lecturas" },
  { agent: "backend", verb: "índice propuesto", what: "idx_lecturas_region_ts" },
  { agent: "data", verb: "ETL ejecutado", what: "142.380 filas → warehouse" },
  { agent: "cyber", verb: "scan completo", what: "0 critical · 1 medium en axios" },
  { agent: "review", verb: "review emitida", what: "2 sugerencias · 0 bloqueantes" },
  { agent: "a11y", verb: "auditoría WCAG", what: "1 par contraste 4.3:1 · arreglar" },
  { agent: "qa", verb: "tests verdes", what: "47/47 unit · 8/8 e2e" },
  { agent: "perf", verb: "benchmark", what: "p95 142ms · LCP 1.8s" },
  { agent: "reality", verb: "PASS", what: "evidence: stdout build + screenshot" },
  { agent: "reality", verb: "FAIL", what: "diff no incluye archivo declarado" },
  { agent: "orchestrator", verb: "handoff", what: "@backend → @qa" },
  { agent: "legal", verb: "compliance check", what: "0 critical · GDPR OK" },
  { agent: "deploy", verb: "preview armado", what: "preview-7f3a.app.naturgy.com" },
];

function generateEvents(count = 5) {
  const now = new Date();
  return Array.from({ length: count }).map((_, i) => {
    const a = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const ts = new Date(now.getTime() - i * 4000);
    const mod = MODULES[Math.floor(Math.random() * MODULES.length)];
    const status =
      a.verb.toLowerCase().includes("fail") ? "error" :
      a.verb.toLowerCase().includes("medium") || a.verb.toLowerCase().includes("contraste") ? "warning" :
      "ok";
    return {
      id: `${ts.getTime()}-${i}`,
      ts: ts.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      agent: a.agent,
      module: mod.id,
      action: `${a.verb} · ${a.what}`,
      status,
      duration: Math.floor(60 + Math.random() * 400),
      cost: Math.round(Math.random() * 350) / 100,
    };
  });
}

function generatePods() {
  return SWARM_PODS.map((p) => {
    if (p.status === "done") return p;
    const drift = Math.floor(Math.random() * 8);
    const newProgress = Math.min(99, p.progress + drift);
    return {
      ...p,
      progress: newProgress,
      tokens: p.tokens + Math.floor(Math.random() * 500),
      costUsd: +(p.costUsd + Math.random() * 0.04).toFixed(2),
      durationS: p.durationS + 4,
      status: newProgress >= 99 ? "delivering" : p.status,
    };
  });
}

export const dynamic = "force-dynamic";

export async function GET() {
  const totalCost = AGENTS.reduce((s, a) => s + a.callsToday * a.costPerCall, 0);
  return NextResponse.json({
    ts: new Date().toISOString(),
    pods: generatePods(),
    events: generateEvents(6),
    summary: {
      activePods: SWARM_PODS.filter((p) => p.status !== "done").length,
      totalCostToday: +totalCost.toFixed(2),
      tokensToday: 142000 + Math.floor(Math.random() * 8000),
      callsToday: AGENTS.reduce((s, a) => s + a.callsToday, 0),
    },
  });
}
