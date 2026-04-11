import type { FeedbackPoint } from "@/types";
import DimensionBadge from "./DimensionBadge";

interface Props {
  strengths: FeedbackPoint[];
}

export default function StrengthsSection({ strengths }: Props) {
  if (strengths.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        What Worked Well
      </h3>
      <ul className="space-y-2">
        {strengths.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
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
