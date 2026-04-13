"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types";
import { getLocalSessions, getSessions, deleteSession } from "@/lib/storage";
import SessionRow from "./SessionRow";
import ExportButton from "./ExportButton";

export default function SessionTable() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Show localStorage data immediately, then update when API responds
    setSessions(getLocalSessions());
    getSessions().then(setSessions);
  }, []);

  function handleDelete(id: string) {
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-sm text-gray-500">No sessions yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          Use Pre-send Review or Reflect to generate your first session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
        <ExportButton />
      </div>
      <div className="space-y-2">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
