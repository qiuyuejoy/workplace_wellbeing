"use client";

import { useState } from "react";
import type { Session } from "@/types";
import { getDimension } from "@/lib/dimensions";
import SessionDetail from "./SessionDetail";

interface Props {
  session: Session;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const MODE_LABELS: Record<string, string> = {
  "pre-send": "Pre-send",
  reflect: "Reflect",
};

export default function SessionRow({ session, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
              {MODE_LABELS[session.mode] ?? session.mode}
            </span>
            <span className="text-xs text-gray-400">{formatDate(session.createdAt)}</span>
            {session.rating && (
              <span className="text-[10px] text-amber-500 font-medium">Rated ★{session.rating.usefulness}</span>
            )}
          </div>
          <p className="text-sm text-gray-700 truncate">{session.message.slice(0, 100)}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{session.result.summary.slice(0, 90)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex flex-wrap gap-1">
            {session.dimensions.slice(0, 3).map((d) => (
              <span
                key={d}
                className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium"
              >
                {getDimension(d)?.label ?? d}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session.id);
            }}
            className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete session"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          <SessionDetail session={session} />
        </div>
      )}
    </div>
  );
}
