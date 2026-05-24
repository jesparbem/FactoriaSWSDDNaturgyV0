import { NextResponse } from "next/server";

// Health endpoint para liveness/readiness probes en Azure Container Apps,
// AKS, App Service y orquestadores similares.
//
// - GET /health         → liveness · proceso vivo, no comprueba dependencias
// - GET /health/ready   → readiness · idem aquí porque no hay BD ni externos
//
// En cuanto haya conexiones reales (ADAI Postgres, Service Bus, AI Foundry),
// se separan ambos endpoints y readiness valida que las deps respondan.

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "factoria2",
    version: "2.0.0",
    ts: new Date().toISOString(),
  });
}
