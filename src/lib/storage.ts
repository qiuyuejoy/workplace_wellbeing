"use client";

import type { Session, SessionRating } from "@/types";

const STORAGE_KEY = "commcoach_sessions";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getSessions(): Session[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

export function saveSession(session: Omit<Session, "id" | "createdAt">): string {
  if (!isClient()) return "";
  const id = crypto.randomUUID();
  const newSession: Session = {
    ...session,
    id,
    createdAt: new Date().toISOString(),
  };
  try {
    const existing = getSessions();
    const updated = [newSession, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage quota exceeded or unavailable — fail silently
  }
  return id;
}

export function updateRating(sessionId: string, rating: SessionRating): void {
  if (!isClient()) return;
  try {
    const sessions = getSessions();
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, rating } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fail silently
  }
}

export function deleteSession(sessionId: string): void {
  if (!isClient()) return;
  try {
    const sessions = getSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // fail silently
  }
}

export function clearAll(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

export function exportJSON(): string {
  return JSON.stringify(getSessions(), null, 2);
}
