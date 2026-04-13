import type { Session, SessionRating } from "@/types";

export async function getSessions(): Promise<Session[]> {
  const res = await fetch("/api/sessions");
  if (!res.ok) return [];
  const data = await res.json() as { sessions: Session[] };
  return data.sessions;
}

export async function saveSession(
  session: Omit<Session, "id" | "createdAt">
): Promise<string> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  if (!res.ok) return "";
  const data = await res.json() as { id: string };
  return data.id;
}

export async function updateRating(
  sessionId: string,
  rating: SessionRating
): Promise<void> {
  await fetch(`/api/sessions/${sessionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
}

export async function deleteSession(sessionId: string): Promise<void> {
  await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
}

export async function exportJSON(): Promise<string> {
  const sessions = await getSessions();
  return JSON.stringify(sessions, null, 2);
}
