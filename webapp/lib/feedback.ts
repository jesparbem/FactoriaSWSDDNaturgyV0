"use client";

// Cliente de feedback persistido en localStorage.
// En producción esto irá a una API + DB (ADAI), pero el contrato es el mismo.
// Cierra el bucle del @self-improve: comentarios reales → análisis → propuestas.

const KEY_COMMENTS = "factoria:feedback:comments";
const KEY_VOTES = "factoria:feedback:votes";
const KEY_FEEDBACK = "factoria:feedback:submitted";

export interface FeedbackComment {
  id: string;
  suggestionId: string;
  text: string;
  author: string;
  role: "process-owner" | "domain-owner" | "product-owner" | "tech-enabler";
  ts: string;
}

export interface FeedbackEntry {
  id: string;
  text: string;
  author: string;
  ts: string;
  status: "queued" | "analyzed" | "promoted";
}

export interface VoteRecord {
  suggestionId: string;
  direction: "up" | "down";
  ts: string;
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota o private mode — ignorar silenciosamente */
  }
}

export function getStoredComments(): FeedbackComment[] {
  return safeGet<FeedbackComment[]>(KEY_COMMENTS, []);
}

export function addComment(c: Omit<FeedbackComment, "id" | "ts">): FeedbackComment {
  const entry: FeedbackComment = {
    ...c,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: new Date().toISOString(),
  };
  const all = getStoredComments();
  safeSet(KEY_COMMENTS, [...all, entry]);
  return entry;
}

export function getStoredVotes(): VoteRecord[] {
  return safeGet<VoteRecord[]>(KEY_VOTES, []);
}

/** Devuelve la dirección de voto del usuario actual, o null si no votó */
export function getMyVote(suggestionId: string): "up" | "down" | null {
  const v = getStoredVotes().find((x) => x.suggestionId === suggestionId);
  return v ? v.direction : null;
}

export function castVote(suggestionId: string, direction: "up" | "down"): VoteRecord {
  const existing = getStoredVotes();
  const others = existing.filter((v) => v.suggestionId !== suggestionId);
  const entry: VoteRecord = { suggestionId, direction, ts: new Date().toISOString() };
  safeSet(KEY_VOTES, [...others, entry]);
  return entry;
}

export function getSubmittedFeedback(): FeedbackEntry[] {
  return safeGet<FeedbackEntry[]>(KEY_FEEDBACK, []);
}

export function submitFeedback(text: string, author = "Jesús E."): FeedbackEntry {
  const entry: FeedbackEntry = {
    id: `f-${Date.now()}`,
    text,
    author,
    ts: new Date().toISOString(),
    status: "queued",
  };
  const all = getSubmittedFeedback();
  safeSet(KEY_FEEDBACK, [entry, ...all].slice(0, 50));
  return entry;
}

/** Cuenta cuántas sugerencias propuestas tienen ya voto en este navegador */
export function getEngagementStats() {
  return {
    commentsThisDevice: getStoredComments().length,
    votesThisDevice: getStoredVotes().length,
    feedbackQueued: getSubmittedFeedback().length,
  };
}
