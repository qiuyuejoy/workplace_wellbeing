"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

interface Props {
  original: string;
  rewrite: string | null;
}

export default function RewritePanel({ original, rewrite }: Props) {
  const [open, setOpen] = useState(false);

  if (!rewrite) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span>Suggested rewrite</span>
        <div className="flex items-center gap-2">
          {open && <CopyButton text={rewrite} label="Copy rewrite" />}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          <div className="p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Original
            </p>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{original}</p>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Suggested
            </p>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{rewrite}</p>
          </div>
        </div>
      )}
    </div>
  );
}
