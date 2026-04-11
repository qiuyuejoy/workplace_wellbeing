import type { FeedbackPoint } from "@/types";
import DimensionBadge from "./DimensionBadge";

interface Props {
  suggestions: FeedbackPoint[];
}

export default function SuggestionsSection({ suggestions }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Suggestions
      </h3>
      <ul className="space-y-2">
        {suggestions.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-[10px]">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-relaxed">{item.text}</p>
              {item.dimensions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.dimensions.map((d) => (
                    <DimensionBadge key={d} id={d} />
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
