// Datos mock de la Factoría SDD Naturgy.
// En producción: provendrán de ADAI (PostgreSQL) + GitHub Enterprise + AKS.

export type Role = "process-owner" | "domain-owner" | "product-owner" | "tech-enabler";

export const ROLES: Record<Role, { label: string; color: string; description: string }> = {
  "process-owner": {
    label: "Process Owner",
    color: "blue",
    description: "Visión E2E del proceso de negocio. Diseña KPIs e interlocuta con POs y DOs.",
  },
  "domain-owner": {
    label: "Domain Owner",
    color: "indigo",
    description: "Propietario del dominio funcional. Define módulos, entidades e integraciones.",
  },
  "product-owner": {
    label: "Product Owner",
    color: "violet",
    description: "Responsable de un módulo. Define funcionalidad, datos y SDLC.",
  },
  "tech-enabler": {
    label: "Technology Enabler",
    color: "orange",
    description: "Perfil mixto. Ayuda al PO con la plataforma y la evoluciona.",
  },
};

export type AgentId =
  | "architect" | "frontend" | "backend" | "cyber" | "ux" | "qa"
  | "devops" | "data" | "deploy" | "orchestrator" | "self-improve"
  | "legal" | "review" | "a11y" | "incident" | "reality" | "perf"
  | "skill-creator";

export interface Agent {
  id: AgentId;
  num: string;
  cmd: string;
  name: string;
  domain: string;
  icon: string;
  color: "blue" | "orange" | "violet" | "green" | "red" | "amber" | "cyan" | "pink";
  subagents?: string[];
  kpis: { name: string; value: string; trend?: "up" | "down" | "flat" }[];
  costPerCall: number; // EUR
  avgDuration: number; // seconds
  callsToday: number;
}

export const AGENTS: Agent[] = [
  {
    id: "architect", num: "01", cmd: "@architect", name: "ArchitectAgent",
    domain: "Diseño, BLUEPRINT, ADRs", icon: "Compass", color: "blue",
    kpis: [
      { name: "Secciones BLUEPRINT", value: "16/16", trend: "flat" },
      { name: "Iteraciones medias", value: "2.3", trend: "down" },
      { name: "Tiempo entrevista", value: "18 min", trend: "down" },
    ],
    costPerCall: 1.42, avgDuration: 1080, callsToday: 8,
  },
  {
    id: "frontend", num: "02", cmd: "@frontend", name: "FrontendAgent",
    domain: "React, Next.js, UI", icon: "Layout", color: "violet",
    subagents: ["UIBuilder", "ComponentLibrarian", "CSSArchitect", "A11yChecker"],
    kpis: [
      { name: "Bundle inicial", value: "187 KB", trend: "down" },
      { name: "LCP", value: "1.8 s", trend: "down" },
      { name: "Tipado estricto", value: "98%", trend: "up" },
    ],
    costPerCall: 3.20, avgDuration: 2400, callsToday: 12,
  },
  {
    id: "backend", num: "03", cmd: "@backend", name: "BackendAgent",
    domain: "APIs, BD, auth, integraciones", icon: "Server", color: "green",
    subagents: ["APIDesigner", "DBOptimizer", "AuthSpecialist", "IntegrationsExpert"],
    kpis: [
      { name: "p95 latencia", value: "142 ms", trend: "down" },
      { name: "Endpoints con test", value: "94%", trend: "up" },
      { name: "Queries N+1", value: "0", trend: "flat" },
    ],
    costPerCall: 2.85, avgDuration: 2100, callsToday: 14,
  },
  {
    id: "cyber", num: "04", cmd: "@cyber", name: "CyberAgent",
    domain: "Seguridad · 5 sub-agentes paralelos", icon: "Shield", color: "red",
    subagents: ["SecretsScanner", "DependencyAuditor", "InfraReviewer", "SupplyChainChecker", "ConfigAuditor"],
    kpis: [
      { name: "Critical/High", value: "0/0", trend: "flat" },
      { name: "Subagentes pasados", value: "100%", trend: "up" },
      { name: "Tiempo audit", value: "12 min", trend: "down" },
    ],
    costPerCall: 4.10, avgDuration: 720, callsToday: 6,
  },
  {
    id: "ux", num: "05", cmd: "@ux", name: "UXAgent",
    domain: "Diseño UI, brand Naturgy", icon: "Palette", color: "pink",
    kpis: [
      { name: "Flujos cubiertos", value: "100%", trend: "flat" },
      { name: "Brand checklist", value: "97%", trend: "up" },
    ],
    costPerCall: 1.85, avgDuration: 1500, callsToday: 5,
  },
  {
    id: "qa", num: "06", cmd: "@qa", name: "QAAgent",
    domain: "Tests unit + integración + e2e", icon: "TestTube", color: "green",
    subagents: ["UnitTester", "E2ETester", "CoverageAnalyst", "RegressionHunter"],
    kpis: [
      { name: "Cobertura", value: "82%", trend: "up" },
      { name: "Tests verdes", value: "100%", trend: "flat" },
      { name: "Tests flaky", value: "2", trend: "down" },
    ],
    costPerCall: 2.40, avgDuration: 1800, callsToday: 10,
  },
  {
    id: "devops", num: "07", cmd: "@devops", name: "DevOpsAgent",
    domain: "CI/CD, Docker, observabilidad", icon: "Cog", color: "cyan",
    subagents: ["CIBuilder", "DockerEngineer", "SecretManager", "ObservabilityEngineer"],
    kpis: [
      { name: "Tiempo pipeline", value: "4.2 min", trend: "down" },
      { name: "Imagen Docker", value: "142 MB", trend: "down" },
      { name: "Secretos en repo", value: "0", trend: "flat" },
    ],
    costPerCall: 1.95, avgDuration: 1200, callsToday: 7,
  },
  {
    id: "data", num: "08", cmd: "@data", name: "DataAgent",
    domain: "ETL, dashboards, Excel", icon: "Database", color: "blue",
    subagents: ["ExtractorAgent", "TransformerAgent", "ChartDesigner", "ExcelSpecialist"],
    kpis: [
      { name: "Calidad score", value: "96%", trend: "up" },
      { name: "Nulos inesperados", value: "0", trend: "flat" },
    ],
    costPerCall: 2.10, avgDuration: 1800, callsToday: 4,
  },
  {
    id: "deploy", num: "09", cmd: "@deploy", name: "DeployAgent",
    domain: "Preview → producción con rollback", icon: "Rocket", color: "orange",
    kpis: [
      { name: "Tiempo deploy", value: "3.8 min", trend: "down" },
      { name: "Gates pasados", value: "100%", trend: "flat" },
      { name: "Rollbacks", value: "1.2%", trend: "down" },
    ],
    costPerCall: 0.95, avgDuration: 420, callsToday: 3,
  },
  {
    id: "orchestrator", num: "10", cmd: "@orchestrator", name: "OrchestratorAgent",
    domain: "Coordina multi-agente", icon: "Network", color: "violet",
    kpis: [
      { name: "Skills invocados", value: "8.4", trend: "up" },
      { name: "Paralelización", value: "62%", trend: "up" },
      { name: "Handoffs PASS", value: "94%", trend: "up" },
    ],
    costPerCall: 0.60, avgDuration: 180, callsToday: 18,
  },
  {
    id: "self-improve", num: "11", cmd: "@self-improve", name: "SelfImproveAgent",
    domain: "Retrospectiva, mejora continua", icon: "TrendingUp", color: "amber",
    kpis: [
      { name: "Lecciones aplicadas", value: "23", trend: "up" },
      { name: "Mejora neta KPIs", value: "+12%", trend: "up" },
    ],
    costPerCall: 0.85, avgDuration: 600, callsToday: 1,
  },
  {
    id: "legal", num: "12", cmd: "@legal", name: "LegalComplianceAgent",
    domain: "GDPR, CNMC, ENS, ISO 27001", icon: "Scale", color: "blue",
    kpis: [
      { name: "Critical legal", value: "0", trend: "flat" },
      { name: "Marcos aplicables", value: "4", trend: "flat" },
    ],
    costPerCall: 2.20, avgDuration: 900, callsToday: 4,
  },
  {
    id: "review", num: "13", cmd: "@review", name: "CodeReviewerAgent",
    domain: "Smells, complejidad, deuda", icon: "Eye", color: "cyan",
    subagents: ["SmellHunter", "ComplexityAnalyst", "DependencyMapper", "DebtCollector"],
    kpis: [
      { name: "Bloqueantes", value: "2", trend: "down" },
      { name: "Ciclomática media", value: "4.2", trend: "down" },
    ],
    costPerCall: 1.40, avgDuration: 540, callsToday: 11,
  },
  {
    id: "a11y", num: "14", cmd: "@a11y", name: "A11yAuditorAgent",
    domain: "WCAG 2.2 AA · Ley 11/2023", icon: "Accessibility", color: "green",
    kpis: [
      { name: "Criterios pasados", value: "100%", trend: "up" },
      { name: "Violaciones nivel A", value: "0", trend: "flat" },
    ],
    costPerCall: 1.10, avgDuration: 480, callsToday: 6,
  },
  {
    id: "incident", num: "15", cmd: "@incident", name: "IncidentResponseAgent",
    domain: "SEV-1/2, rollback, post-mortem", icon: "Siren", color: "red",
    kpis: [
      { name: "MTTR", value: "18 min", trend: "down" },
      { name: "MTTD", value: "3 min", trend: "down" },
    ],
    costPerCall: 3.50, avgDuration: 1200, callsToday: 0,
  },
  {
    id: "reality", num: "16", cmd: "@reality", name: "RealityCheckerAgent",
    domain: "Anti-alucinación · exige prueba", icon: "ShieldCheck", color: "amber",
    kpis: [
      { name: "Pass rate", value: "87%", trend: "up" },
      { name: "Alucinaciones detectadas", value: "31", trend: "up" },
    ],
    costPerCall: 0.45, avgDuration: 60, callsToday: 142,
  },
  {
    id: "perf", num: "17", cmd: "@perf", name: "PerformanceAgent",
    domain: "Core Web Vitals · p95 latencia", icon: "Gauge", color: "orange",
    kpis: [
      { name: "LCP", value: "1.8 s", trend: "down" },
      { name: "INP", value: "92 ms", trend: "down" },
      { name: "p95 API", value: "142 ms", trend: "down" },
    ],
    costPerCall: 1.65, avgDuration: 720, callsToday: 5,
  },
  {
    id: "skill-creator", num: "18", cmd: "@skill-creator", name: "SkillCreatorAgent",
    domain: "Meta-agente · crea otros agentes/SKILLs", icon: "Wand2", color: "pink",
    kpis: [
      { name: "Skills generados", value: "4", trend: "up" },
      { name: "Aprobación al 1er intento", value: "75%", trend: "up" },
    ],
    costPerCall: 1.20, avgDuration: 900, callsToday: 2,
  },
];

// Estructura editable de un SKILL (los 7 bloques)
export interface SkillSpec {
  num: string;
  cmd: string;
  name: string;
  version: string;
  sources: string;
  identity: string;
  mission: string;
  criticalRules: string[];
  deliverables: string[];
  workflow: string[];
  subagents?: string[];
  kpis: { name: string; target: string }[];
  communicationStyle: string;
  handoffFrom: string;
  handoffTo: string;
  hooks: string[];
  realityChecker: boolean;
}

// Plantilla vacía para crear un SKILL desde cero
export const EMPTY_SKILL: SkillSpec = {
  num: "19",
  cmd: "@new-skill",
  name: "NewSkillAgent",
  version: "1.0",
  sources: "",
  identity: "",
  mission: "",
  criticalRules: [""],
  deliverables: [""],
  workflow: [""],
  subagents: [],
  kpis: [{ name: "", target: "" }],
  communicationStyle: "",
  handoffFrom: "",
  handoffTo: "",
  hooks: [],
  realityChecker: true,
};

// Ejemplo de SKILL ya rellenado (el de @architect) para mostrar al editar
export const ARCHITECT_SKILL_SPEC: SkillSpec = {
  num: "01",
  cmd: "@architect",
  name: "ArchitectAgent",
  version: "2.1",
  sources: "The Architect (Hainrixz · Trifecta) + Software Architect (agency-agents)",
  identity:
    "Arquitecto de software senior con experiencia en sistemas regulados. Transforma ideas vagas en blueprints accionables. Pragmático: prefiere 3 opciones con trade-offs antes que una sola \"perfecta\".",
  mission:
    "Recibir una idea de negocio en español natural → entrevistar al usuario en 4 fases → entregar un BLUEPRINT.md de 16 secciones listo para que el resto de SKILLs construyan.",
  criticalRules: [
    "NUNCA genera blueprint sin confirmar: tipo de app, público, datos tratados, restricciones legales.",
    "SIEMPRE ofrece 3 opciones con trade-offs en decisiones significativas (stack, BD, hosting).",
    "Documenta cada decisión arquitectónica importante en .context/decisions/ADR-{n}-{slug}.md.",
    "Prefiere arquitecturas modulares e incrementales sobre monolitos rígidos.",
    "Si la idea involucra datos personales o sistemas regulados → consulta a @legal antes de cerrar el BLUEPRINT.",
  ],
  deliverables: [
    "BLUEPRINT.md → raíz del proyecto (16 secciones)",
    ".context/decisions/ADR-{n}-{slug}.md por cada decisión significativa.",
  ],
  workflow: [
    "Fase 1 · DISCOVERY — ¿Qué? ¿Para quién? ¿Qué problema? Clasifica arquetipo.",
    "Fase 2 · DEEP DIVE — Features core (máx 5), integraciones, restricciones.",
    "Fase 3 · ARCHITECTURE — 3 opciones de stack con trade-offs, valida stack-compatibility.",
    "Fase 4 · GENERATE — Rellena BLUEPRINT-TEMPLATE.md, sección 9 (Build Order) obligatoria.",
  ],
  kpis: [
    { name: "kpi_secciones_completas", target: "16/16" },
    { name: "kpi_iteraciones_blueprint", target: "< 3" },
    { name: "kpi_adrs_generados", target: "≥ 1 por decisión significativa" },
  ],
  communicationStyle:
    "Pregunta máximo 3 cosas por turno. Resume lo entendido antes de avanzar. Si detecta ambigüedad, la verbaliza.",
  handoffFrom: "usuario (idea inicial)",
  handoffTo: "@orchestrator (con BLUEPRINT.md aprobado)",
  hooks: ["blueprint-approved"],
  realityChecker: true,
};

export type SDLCPhase =
  | "spec"
  | "mapping"
  | "build"
  | "test"
  | "promote"
  | "deploy";

export const SDLC_PHASES: { id: SDLCPhase; label: string; icon: string; roles: Role[] }[] = [
  { id: "spec",    label: "Definición Specs",      icon: "FileText",   roles: ["process-owner", "product-owner"] },
  { id: "mapping", label: "Mapeo Entidades",       icon: "Network",    roles: ["process-owner", "domain-owner", "product-owner"] },
  { id: "build",   label: "Construcción IA",       icon: "Code2",      roles: ["product-owner", "tech-enabler"] },
  { id: "test",    label: "Testing & Validación",  icon: "TestTube",   roles: ["product-owner", "tech-enabler"] },
  { id: "promote", label: "Promoción Código",      icon: "GitMerge",   roles: ["product-owner", "tech-enabler"] },
  { id: "deploy",  label: "Despliegue Producción", icon: "Rocket",     roles: ["process-owner", "domain-owner", "product-owner", "tech-enabler"] },
];

export interface Module {
  id: string;
  name: string;
  domain: string;
  archetype: string;
  status: "draft" | "building" | "testing" | "review" | "deployed" | "issue";
  phase: SDLCPhase;
  progress: number; // 0-100
  productOwner: string;
  domainOwner: string;
  agentsActive: AgentId[];
  costToDate: number;
  lastUpdate: string;
}

export const MODULES: Module[] = [
  {
    id: "MOD-024", name: "Portal Aprobaciones Compras", domain: "Procurement",
    archetype: "app-interna-corporativa", status: "deployed", phase: "deploy",
    progress: 100, productOwner: "Marta L.", domainOwner: "Juan G.",
    agentsActive: [], costToDate: 184.20, lastUpdate: "hace 2 días",
  },
  {
    id: "MOD-031", name: "Dashboard Pérdidas Red", domain: "Distribución",
    archetype: "dashboard-bi", status: "building", phase: "build",
    progress: 62, productOwner: "Carlos M.", domainOwner: "Ana R.",
    agentsActive: ["backend", "data", "frontend"], costToDate: 92.40, lastUpdate: "hace 8 min",
  },
  {
    id: "MOD-042", name: "Conector SAP MM → Portal", domain: "Procurement",
    archetype: "integracion-sap", status: "testing", phase: "test",
    progress: 85, productOwner: "Marta L.", domainOwner: "Juan G.",
    agentsActive: ["qa", "reality"], costToDate: 156.80, lastUpdate: "hace 24 min",
  },
  {
    id: "MOD-055", name: "Área Cliente · Facturas", domain: "Comercial Cliente",
    archetype: "portal-cliente", status: "review", phase: "promote",
    progress: 92, productOwner: "Lucía P.", domainOwner: "Sergio T.",
    agentsActive: ["review", "cyber", "legal", "a11y"], costToDate: 412.15, lastUpdate: "hace 1 h",
  },
  {
    id: "MOD-067", name: "ETL Lecturas Contadores", domain: "Operación Red",
    archetype: "automatizacion-etl", status: "deployed", phase: "deploy",
    progress: 100, productOwner: "Iván B.", domainOwner: "Ana R.",
    agentsActive: [], costToDate: 78.90, lastUpdate: "hace 5 días",
  },
  {
    id: "MOD-068", name: "App Técnico Campo · OT", domain: "Operación Red",
    archetype: "app-movil-corporativa", status: "draft", phase: "spec",
    progress: 18, productOwner: "Iván B.", domainOwner: "Ana R.",
    agentsActive: ["architect"], costToDate: 14.20, lastUpdate: "hace 3 h",
  },
  {
    id: "MOD-071", name: "Comparador Tarifas Lead", domain: "Comercial Cliente",
    archetype: "portal-cliente", status: "issue", phase: "deploy",
    progress: 95, productOwner: "Lucía P.", domainOwner: "Sergio T.",
    agentsActive: ["incident"], costToDate: 245.30, lastUpdate: "hace 12 min",
  },
];

export interface BuildEvent {
  id: string;
  ts: string;
  agent: AgentId;
  module: string;
  action: string;
  status: "running" | "ok" | "warning" | "error";
  duration?: number; // seconds
  cost?: number; // EUR
}

export const BUILD_EVENTS: BuildEvent[] = [
  { id: "e1", ts: "12:42:18", agent: "architect", module: "MOD-068", action: "Generando BLUEPRINT.md sección 4 (Data Model)", status: "running" },
  { id: "e2", ts: "12:41:55", agent: "reality", module: "MOD-031", action: "PASS · evidence: build output verde + 3 screenshots", status: "ok", duration: 12, cost: 0.08 },
  { id: "e3", ts: "12:41:30", agent: "frontend", module: "MOD-031", action: "UIBuilder generó 4 componentes (DashboardLayout, KpiCard, ChartWrapper, FilterPanel)", status: "ok", duration: 287, cost: 3.42 },
  { id: "e4", ts: "12:40:12", agent: "cyber", module: "MOD-055", action: "SecretsScanner: 0 hallazgos · DependencyAuditor: 1 medium (axios)", status: "warning", duration: 162, cost: 4.10 },
  { id: "e5", ts: "12:39:48", agent: "review", module: "MOD-055", action: "ComplexityAnalyst: ciclomática media 4.1 · sin bloqueantes", status: "ok", duration: 94, cost: 1.40 },
  { id: "e6", ts: "12:38:21", agent: "a11y", module: "MOD-055", action: "ContrastChecker: 1 par 4.3:1 (esperado ≥ 4.5) en breadcrumbs", status: "warning", duration: 76, cost: 1.10 },
  { id: "e7", ts: "12:37:55", agent: "backend", module: "MOD-031", action: "DBOptimizer: índice compuesto en (region_id, timestamp) propuesto", status: "ok", duration: 145, cost: 2.85 },
  { id: "e8", ts: "12:36:40", agent: "data", module: "MOD-031", action: "ETL nightly cargó 142.380 lecturas · 12 anomalías flageadas", status: "ok", duration: 423, cost: 2.10 },
  { id: "e9", ts: "12:35:12", agent: "incident", module: "MOD-071", action: "SEV-2 declarado · p95 latencia 4.2 s (baseline 800 ms)", status: "error", duration: 8, cost: 3.50 },
  { id: "e10", ts: "12:34:50", agent: "orchestrator", module: "MOD-068", action: "Activado playbook prototipo-rapido · arquetipo app-movil-corporativa", status: "ok", duration: 6, cost: 0.18 },
];

export interface SelfImproveSuggestion {
  id: string;
  title: string;
  rationale: string;
  evidence: string[];
  impactKPI: string;
  expectedDelta: string;
  votes: { up: number; down: number };
  status: "proposed" | "approved" | "applied" | "rejected";
  comments: { author: string; role: Role; text: string; ts: string }[];
}

export const SUGGESTIONS: SelfImproveSuggestion[] = [
  {
    id: "SUG-014",
    title: "Cachear catálogo SAP en @backend.IntegrationsExpert",
    rationale: "El 73% de las llamadas a SAP MM en los últimos 30 días son consultas de datos maestros poco volátiles (clientes, materiales). Cachear con TTL de 24h ahorraría ~210 llamadas/día.",
    evidence: ["Trace App Insights · MOD-024", "Trace App Insights · MOD-042"],
    impactKPI: "kpi_p95_latencia (@backend)",
    expectedDelta: "-180ms p95",
    votes: { up: 14, down: 1 },
    status: "proposed",
    comments: [
      { author: "Marta L.", role: "product-owner", text: "+1, MOD-024 sufre esto en hora punta.", ts: "hace 2 h" },
      { author: "Juan G.", role: "domain-owner", text: "OK si TTL invalidate cuando cambien datos maestros vía evento.", ts: "hace 1 h" },
    ],
  },
  {
    id: "SUG-018",
    title: "Añadir sub-agente 'I18nChecker' a @frontend",
    rationale: "5 de los últimos 8 módulos cliente tuvieron hallazgos de textos hardcoded en español. Un sub-agente que valide i18n estructurado evitaría retrabajo.",
    evidence: ["RETRO-2026-04-MOD-055", "RETRO-2026-03-MOD-049"],
    impactKPI: "kpi_retrabajo (@frontend)",
    expectedDelta: "-30% retrabajo en módulos cliente",
    votes: { up: 9, down: 0 },
    status: "approved",
    comments: [
      { author: "Lucía P.", role: "product-owner", text: "Lo necesitamos para portal-cliente cualquier mercado.", ts: "hace 4 h" },
    ],
  },
  {
    id: "SUG-021",
    title: "Reemplazar Playwright por k6+Playwright en @qa.E2ETester",
    rationale: "Tests e2e tardan 8 min de media; con paralelización k6 bajaría a < 3 min y permitiría tests de carga el mismo flujo.",
    evidence: ["Pipeline log MOD-031 · 487s suite"],
    impactKPI: "kpi_tiempo_suite (@qa)",
    expectedDelta: "-60% tiempo CI",
    votes: { up: 6, down: 4 },
    status: "proposed",
    comments: [
      { author: "Carlos M.", role: "product-owner", text: "Voto en contra: la curva de aprendizaje de k6 es alta.", ts: "hace 5 h" },
    ],
  },
  {
    id: "SUG-007",
    title: "Generar runbook automático tras cada incidente cerrado por @incident",
    rationale: "MTTR mejoraría si los runbooks se actualizasen automáticamente con cada post-mortem en vez de manualmente.",
    evidence: ["POSTMORTEM-MOD-071-2026-04", "POSTMORTEM-MOD-039-2026-02"],
    impactKPI: "kpi_mttr (@incident)",
    expectedDelta: "-25% MTTR",
    votes: { up: 11, down: 0 },
    status: "applied",
    comments: [],
  },
];

export interface CostBucket {
  day: string;
  cost: number;
}

export const COST_TIMELINE: CostBucket[] = [
  { day: "Lun", cost: 142.40 },
  { day: "Mar", cost: 168.92 },
  { day: "Mié", cost: 184.50 },
  { day: "Jue", cost: 156.20 },
  { day: "Vie", cost: 198.74 },
  { day: "Sáb", cost: 42.10 },
  { day: "Dom", cost: 28.40 },
];

export const SPECS_EXTRACTION_METHODS = [
  {
    id: "existing-app",
    title: "Extracción desde app existente",
    icon: "Search",
    subtitle: "El código + telemetría enseña qué hace ya",
    description:
      "Instrumentalizamos la ejecución (logs, trazas, eventos) y los agentes IA analizan código + comportamiento real para generar specs.",
    inputs: ["Código fuente", "Instrumentalización (logs/trazas)", "Agentes IA"],
    bestFor: "Modernización legacy · refactor mayor",
  },
  {
    id: "vibe-coding",
    title: "Prototipado Vibe Coding",
    icon: "Paintbrush",
    subtitle: "Pintamos la app y de ahí salen las specs",
    description:
      "IDE de prototipado rápido. Pantallas + datos sintéticos visualizan el proceso. Cuando refleja el comportamiento, extraemos specs. NO desplegable en producción.",
    inputs: ["Prototipo rápido", "Datos sintéticos", "Specs generadas"],
    bestFor: "Ideas nuevas · validar con stakeholders antes de invertir",
  },
  {
    id: "process-detailed",
    title: "Proceso detallado + IA",
    icon: "Users",
    subtitle: "Process Owner + IA documentan el proceso",
    description:
      "El Process Owner documenta el proceso con nivel de detalle suficiente. Con IA, los procesos se transforman en specs funcionales, identificando funcionalidades, entidades e integraciones.",
    inputs: ["Process Owner", "Soporte IA", "Proceso detallado"],
    bestFor: "Procesos nuevos · sin app previa · alta interlocución negocio",
  },
];

export interface SwarmPod {
  id: string;
  spec: string;
  agent: AgentId;
  status: "init" | "building" | "delivering" | "done" | "error";
  progress: number;
  tokens: number;
  costUsd: number;
  durationS: number;
}

export const SWARM_PODS: SwarmPod[] = [
  { id: "pod-7f3a", spec: "MOD-068/feature-ot-list", agent: "frontend", status: "building", progress: 64, tokens: 18420, costUsd: 0.62, durationS: 142 },
  { id: "pod-9b2c", spec: "MOD-031/perf-dashboard-cache", agent: "backend", status: "building", progress: 38, tokens: 24180, costUsd: 0.81, durationS: 198 },
  { id: "pod-4d8e", spec: "MOD-068/ot-form-validations", agent: "frontend", status: "init", progress: 8, tokens: 1240, costUsd: 0.04, durationS: 18 },
  { id: "pod-2a1f", spec: "MOD-031/sql-index-region-ts", agent: "backend", status: "done", progress: 100, tokens: 12880, costUsd: 0.43, durationS: 167 },
  { id: "pod-6e5d", spec: "MOD-055/a11y-contrast-fix", agent: "a11y", status: "delivering", progress: 92, tokens: 4280, costUsd: 0.15, durationS: 76 },
];

export interface Prototype {
  id: string;
  name: string;
  author: string;
  createdAt: string;
  thumbnail: string; // emoji preview
  status: "draft" | "ready" | "promoted";
  reusedBy?: string[]; // module IDs
}

export const PROTOTYPES: Prototype[] = [
  { id: "PRO-001", name: "Asistente lectura contador OCR", author: "Iván B.", createdAt: "hace 3 días", thumbnail: "📸", status: "promoted", reusedBy: ["MOD-068"] },
  { id: "PRO-002", name: "Comparador tarifas v2", author: "Lucía P.", createdAt: "hace 1 día", thumbnail: "⚡", status: "ready" },
  { id: "PRO-003", name: "Onboarding técnico", author: "Iván B.", createdAt: "hace 8 horas", thumbnail: "🧰", status: "draft" },
  { id: "PRO-004", name: "Vista 360° cliente", author: "Lucía P.", createdAt: "hace 2 horas", thumbnail: "🔍", status: "draft" },
];
