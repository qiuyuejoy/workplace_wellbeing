"use client";

import type { MessageIntent } from "@/types";

const OPTIONS: { value: MessageIntent; label: string }[] = [
  { value: "request", label: "Request" },
  { value: "update", label: "Update" },
  { value: "feedback", label: "Feedback" },
  { value: "clarification", label: "Clarification" },
  { value: "check_in", label: "Check-in" },
  { value: "conflict_repair", label: "Conflict Repair" },
  { value: "other", label: "Other" },
];

interface Props {
  value: MessageIntent;
  onChange: (value: MessageIntent) => void;
}

export default function IntentSelect({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        Message Intent
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as MessageIntent)}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
