import type { Session, SessionRating } from "@/types";

// ── localStorage fallback ────────────────────────────────────────────────────

const LS_KEY = "commcoach_sessions";

function lsGet(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function lsSet(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(sessions));
}

// ── public API ───────────────────────────────────────────────────────────────
// Each function tries the API first. If the request fails or returns an error
// status, it falls back to localStorage transparently.

export async function getSessions(): Promise<Session[]> {
  try {
    const res = await fetch("/api/sessions");
    if (res.ok) {
      const data = (await res.json()) as { sessions: Session[] };
      return data.sessions;
    }
  } catch {
    // network error — fall through
  }
  return lsGet();
}

export async function saveSession(
  session: Omit<Session, "id" | "createdAt">
): Promise<string> {
  try {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
    if (res.ok) {
      const data = (await res.json()) as { id: string };
      return data.id;
    }
  } catch {
    // fall through
  }
  // localStorage fallback
  const newSession: Session = {
    ...session,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const sessions = lsGet();
  sessions.unshift(newSession);
  lsSet(sessions);
  return newSession.id;
}

export async function updateRating(
  sessionId: string,
  rating: SessionRating
): Promise<void> {
  try {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    if (res.ok) return;
  } catch {
    // fall through
  }
  // localStorage fallback
  const sessions = lsGet();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx !== -1) {
    sessions[idx] = { ...sessions[idx], rating };
    lsSet(sessions);
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const res = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
    if (res.ok) return;
  } catch {
    // fall through
  }
  // localStorage fallback
  lsSet(lsGet().filter((s) => s.id !== sessionId));
}

export async function exportJSON(): Promise<string> {
  const sessions = await getSessions();
  return JSON.stringify(sessions, null, 2);
}
