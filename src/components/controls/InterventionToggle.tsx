"use client";

import type { InterventionMode } from "@/types";

const OPTIONS: { value: InterventionMode; label: string }[] = [
  { value: "gentle", label: "Gentle suggestions" },
  { value: "direct", label: "Direct coaching" },
];

interface Props {
  value: InterventionMode;
  onChange: (value: InterventionMode) => void;
}

export default function InterventionToggle({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        Coaching Style
      </label>
      <div className="flex rounded-md border border-gray-200 overflow-hidden">
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              i > 0 ? "border-l border-gray-200" : ""
            } ${
              value === opt.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
