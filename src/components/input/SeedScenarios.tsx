"use client";

import { SEED_SCENARIOS } from "@/lib/seeds";
import type { SeedScenario } from "@/types";

interface Props {
  mode: "pre-send" | "reflect";
  onSelect: (scenario: SeedScenario) => void;
}

export default function SeedScenarios({ mode, onSelect }: Props) {
  const scenarios = SEED_SCENARIOS.filter((s) => s.mode === mode);

  if (scenarios.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
        Example scenarios
      </p>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
