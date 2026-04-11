"use client";

import type { AudienceType } from "@/types";

const OPTIONS: { value: AudienceType; label: string }[] = [
  { value: "peer", label: "Peer / Colleague" },
  { value: "manager", label: "Manager" },
  { value: "direct_report", label: "Direct Report" },
  { value: "cross_functional", label: "Cross-functional Collaborator" },
  { value: "client", label: "Client / External Partner" },
  { value: "custom", label: "Custom..." },
];

interface Props {
  value: AudienceType;
  customValue?: string;
  onChange: (value: AudienceType) => void;
  onCustomChange: (value: string) => void;
}

export default function AudienceSelect({ value, customValue, onChange, onCustomChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        Audience
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AudienceType)}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {value === "custom" && (
        <input
          type="text"
          placeholder="Describe your audience..."
          value={customValue ?? ""}
          onChange={(e) => onCustomChange(e.target.value)}
          className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      )}
    </div>
  );
}
