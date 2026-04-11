"use client";

import { DIMENSIONS } from "@/lib/dimensions";
import type { DimensionId } from "@/types";

const COLOR_CLASSES: Record<string, { active: string; inactive: string }> = {
  green: {
    active: "bg-green-100 border-green-500 text-green-800",
    inactive: "border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50",
  },
  blue: {
    active: "bg-blue-100 border-blue-500 text-blue-800",
    inactive: "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50",
  },
  purple: {
    active: "bg-purple-100 border-purple-500 text-purple-800",
    inactive: "border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50",
  },
  rose: {
    active: "bg-rose-100 border-rose-500 text-rose-800",
    inactive: "border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50",
  },
  amber: {
    active: "bg-amber-100 border-amber-500 text-amber-800",
    inactive: "border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50",
  },
};

interface Props {
  selected: DimensionId[];
  onChange: (selected: DimensionId[]) => void;
}

export default function DimensionSelector({ selected, onChange }: Props) {
  function toggle(id: DimensionId) {
    if (selected.includes(id)) {
      onChange(selected.filter((d) => d !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Communication Dimensions
      </label>
      <div className="flex flex-wrap gap-2">
        {DIMENSIONS.map((dim) => {
          const active = selected.includes(dim.id);
          const colors = COLOR_CLASSES[dim.color] ?? COLOR_CLASSES.blue;
          return (
            <button
              key={dim.id}
              type="button"
              title={dim.description}
              onClick={() => toggle(dim.id)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                active ? colors.active : colors.inactive
              }`}
            >
              {dim.label}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="mt-1.5 text-xs text-amber-600">Select at least one dimension.</p>
      )}
    </div>
  );
}
