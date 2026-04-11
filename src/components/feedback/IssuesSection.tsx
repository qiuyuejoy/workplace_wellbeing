import type { FeedbackPoint } from "@/types";
import DimensionBadge from "./DimensionBadge";

interface Props {
  issues: FeedbackPoint[];
}

export default function IssuesSection({ issues }: Props) {
  if (issues.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Areas to Consider
      </h3>
      <ul className="space-y-2">
        {issues.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
