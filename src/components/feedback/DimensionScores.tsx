import { DIMENSIONS } from "@/lib/dimensions";
import type { FeedbackResult } from "@/types";

const BAR_COLOR: Record<string, string> = {
  rose: "bg-rose-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  green: "bg-green-400",
  purple: "bg-purple-400",
};

interface Props {
  dimensionScores: FeedbackResult["dimension_scores"];
}

export default function DimensionScores({ dimensionScores }: Props) {
  if (!dimensionScores) return null;

  const scored = DIMENSIONS.filter((d) => dimensionScores[d.id] != null);
  if (scored.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {scored.map((dim) => {
        const entry = dimensionScores[dim.id]!;
        const pct = (entry.score / 5) * 100;
        const barColor = BAR_COLOR[dim.color] ?? "bg-gray-400";
        return (
          <div key={dim.id} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-gray-600">{dim.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-7 shrink-0 text-right text-xs font-medium text-gray-700">
              {entry.score}/5
            </span>
          </div>
        );
      })}
    </div>
  );
}
